import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { tailoredCvs } from "@/db/schema"
import CvEditor from "@/components/cv/cv-editor"
import { getCurrentUser } from "@/lib/current-user"
import { tailoredCvSchema } from "@/lib/cv-types"

export const metadata = { title: "CV adaptado — CVMatch" }

export default async function TailoredCvPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const row = await db.query.tailoredCvs.findFirst({
    where: and(eq(tailoredCvs.analysisId, id), eq(tailoredCvs.userId, user.id)),
  })
  if (!row) notFound()

  const cv = tailoredCvSchema.parse(JSON.parse(row.data))
  return <CvEditor analysisId={id} initialCv={cv} />
}
