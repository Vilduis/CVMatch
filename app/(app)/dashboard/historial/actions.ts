"use server"

import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/db"
import { analyses, users } from "@/db/schema"

export async function deleteAnalysis(analysisId: string) {
  const session = await auth()
  if (!session?.user?.email) redirect("/")

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
    columns: { id: true },
  })
  if (!dbUser) redirect("/")

  await db
    .delete(analyses)
    .where(and(eq(analyses.id, analysisId), eq(analyses.userId, dbUser.id)))

  revalidatePath("/dashboard/historial")
}
