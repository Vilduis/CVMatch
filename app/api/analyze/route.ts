import { randomUUID } from "crypto"
import { and, eq, gt, sql } from "drizzle-orm"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { analyses, users } from "@/db/schema"
import { analyzeCv } from "@/lib/gemini"
import { parseCv } from "@/lib/parse-cv"

export const FREE_COOKIE = "cvmatch_free_used"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("cv") as File | null
  const jobDescription = formData.get("jobDescription") as string | null

  if (!file || !jobDescription?.trim()) {
    return NextResponse.json(
      { error: "Faltan datos: CV y descripción del trabajo son requeridos" },
      { status: 400 }
    )
  }

  const session = await auth()

  let dbUserId: string | null = null

  if (session?.user?.email) {
    // Usuario autenticado: verificar créditos y obtener ID real de DB
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      columns: { id: true, credits: true },
    })
    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "No tienes créditos disponibles", code: "NO_CREDITS" },
        { status: 402 }
      )
    }
    dbUserId = user.id
  } else {
    // Invitado: verificar si ya usó el análisis gratuito
    const cookieStore = await cookies()
    if (cookieStore.get(FREE_COOKIE)) {
      return NextResponse.json(
        { error: "Ya usaste tu análisis gratuito", code: "FREE_USED" },
        { status: 402 }
      )
    }
  }

  let cvText: string
  try {
    cvText = await parseCv(file)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al procesar el archivo"
    return NextResponse.json({ error: message }, { status: 422 })
  }

  if (!cvText.trim()) {
    return NextResponse.json(
      { error: "No se pudo extraer texto del CV. Verifica que el archivo no esté vacío." },
      { status: 422 }
    )
  }

  const result = await analyzeCv(cvText, jobDescription)

  const id = randomUUID()

  await db.insert(analyses).values({
    id,
    userId: dbUserId,
    cvText,
    jobDescription,
    matchScore: result.matchScore,
    strengths: JSON.stringify(result.strengths),
    gaps: JSON.stringify(result.gaps),
    cvSuggestions: JSON.stringify(result.cvSuggestions),
    interviewQuestions: result.interviewQuestions ? JSON.stringify(result.interviewQuestions) : null,
  })

  // Descontar 1 crédito al usuario autenticado
  if (session?.user?.email) {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(and(eq(users.email, session.user.email), gt(users.credits, 0)))
  }

  const response = NextResponse.json({ id })

  // Marcar análisis gratuito como usado para invitados
  if (!dbUserId) {
    response.cookies.set(FREE_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}
