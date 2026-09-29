"use server"

import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { analyses } from "@/db/schema"
import { getCurrentUser } from "@/lib/current-user"

export async function deleteAnalysis(analysisId: string) {
  const dbUser = await getCurrentUser()

  await db
    .delete(analyses)
    .where(and(eq(analyses.id, analysisId), eq(analyses.userId, dbUser.id)))

  revalidatePath("/dashboard/historial")
}
