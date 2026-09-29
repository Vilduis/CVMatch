"use server"

import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { analyses, tailoredCvs } from "@/db/schema"
import { refundCredit, reserveCredit } from "@/lib/credits"
import { getCurrentUser } from "@/lib/current-user"
import { tailoredCvSchema, type TailoredCv } from "@/lib/cv-types"
import { tailorCv } from "@/lib/tailor-cv"

export type TailorState = { error: string } | null

export async function createTailoredCv(
  analysisId: string
): Promise<TailorState> {
  const user = await getCurrentUser()
  const cvPath = `/dashboard/resultado/${analysisId}/cv`

  const analysis = await db.query.analyses.findFirst({
    where: and(eq(analyses.id, analysisId), eq(analyses.userId, user.id)),
  })
  if (!analysis) return { error: "No encontramos este análisis." }

  const existing = await db.query.tailoredCvs.findFirst({
    where: eq(tailoredCvs.analysisId, analysisId),
    columns: { analysisId: true },
  })
  if (existing) redirect(cvPath)

  if (!(await reserveCredit(user.id))) {
    return { error: "No tienes créditos disponibles." }
  }

  let cv: TailoredCv
  try {
    cv = await tailorCv(
      analysis.cvText,
      analysis.jobDescription,
      JSON.parse(analysis.gaps)
    )
  } catch (err) {
    await refundCredit(user.id)
    console.error("[tailor] IA no disponible:", err)
    return {
      error:
        "No pudimos adaptar tu CV en este momento. No se descontó ningún crédito.",
    }
  }

  // Un doble clic no debe cobrar dos veces: el segundo insert choca con la PK
  const [inserted] = await db
    .insert(tailoredCvs)
    .values({ analysisId, userId: user.id, data: JSON.stringify(cv) })
    .onConflictDoNothing()
    .returning({ analysisId: tailoredCvs.analysisId })
  if (!inserted) await refundCredit(user.id)

  redirect(cvPath)
}

export async function saveTailoredCv(analysisId: string, cv: TailoredCv) {
  const user = await getCurrentUser()
  const parsed = tailoredCvSchema.safeParse(cv)
  if (!parsed.success) return { ok: false }

  const [updated] = await db
    .update(tailoredCvs)
    .set({ data: JSON.stringify(parsed.data), updatedAt: new Date() })
    .where(
      and(
        eq(tailoredCvs.analysisId, analysisId),
        eq(tailoredCvs.userId, user.id)
      )
    )
    .returning({ analysisId: tailoredCvs.analysisId })

  return { ok: Boolean(updated) }
}
