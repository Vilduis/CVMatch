import { randomUUID } from "crypto"
import { and, eq, gt, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { analyses, users } from "@/db/schema"
import { analyzeCv } from "@/lib/gemini"
import { parseCv } from "@/lib/parse-cv"

// Atómico: dos peticiones simultáneas con 1 crédito no pueden pasar ambas
async function reserveCredit(userId: string) {
  const [row] = await db
    .update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(and(eq(users.id, userId), gt(users.credits, 0)))
    .returning({ id: users.id })
  return Boolean(row)
}

async function refundCredit(userId: string) {
  await db
    .update(users)
    .set({ credits: sql`${users.credits} + 1` })
    .where(eq(users.id, userId))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para analizar tu CV" },
      { status: 401 }
    )
  }

  const formData = await req.formData()
  const file = formData.get("cv") as File | null
  const jobDescription = formData.get("jobDescription") as string | null

  if (!file || !jobDescription?.trim()) {
    return NextResponse.json(
      { error: "Faltan datos: CV y descripción del trabajo son requeridos" },
      { status: 400 }
    )
  }

  if (!(await reserveCredit(userId))) {
    return NextResponse.json(
      { error: "No tienes créditos disponibles", code: "NO_CREDITS" },
      { status: 402 }
    )
  }

  let cvText: string
  try {
    cvText = await parseCv(file)
  } catch (err) {
    await refundCredit(userId)
    const message =
      err instanceof Error ? err.message : "Error al procesar el archivo"
    return NextResponse.json({ error: message }, { status: 422 })
  }

  if (!cvText.trim()) {
    await refundCredit(userId)
    return NextResponse.json(
      {
        error:
          "No se pudo extraer texto del CV. Verifica que el archivo no esté vacío.",
      },
      { status: 422 }
    )
  }

  let result
  try {
    result = await analyzeCv(cvText, jobDescription)
  } catch (err) {
    await refundCredit(userId)
    console.error("[analyze] Gemini no disponible:", err)
    return NextResponse.json(
      {
        error:
          "El servicio de análisis con IA no está disponible en este momento. Vuelve a intentarlo en unos minutos.",
        code: "AI_UNAVAILABLE",
      },
      { status: 503 }
    )
  }

  const id = randomUUID()

  await db.insert(analyses).values({
    id,
    userId,
    cvText,
    jobDescription,
    matchScore: result.matchScore,
    strengths: JSON.stringify(result.strengths),
    gaps: JSON.stringify(result.gaps),
    cvSuggestions: JSON.stringify(result.cvSuggestions),
    interviewQuestions: result.interviewQuestions
      ? JSON.stringify(result.interviewQuestions)
      : null,
  })

  return NextResponse.json({ id })
}
