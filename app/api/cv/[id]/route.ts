import { renderToBuffer } from "@react-pdf/renderer"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { tailoredCvs } from "@/db/schema"
import { HarvardCvDocument } from "@/components/cv/harvard-pdf"
import { pendingPlaceholders, tailoredCvSchema } from "@/lib/cv-types"

function fileName(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `CV-${slug || "CVMatch"}.pdf`
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const row = await db.query.tailoredCvs.findFirst({
    where: and(eq(tailoredCvs.analysisId, id), eq(tailoredCvs.userId, userId)),
  })
  if (!row) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  }

  const cv = tailoredCvSchema.parse(JSON.parse(row.data))
  if (pendingPlaceholders(cv) > 0) {
    return NextResponse.json(
      { error: "Completa los datos entre corchetes antes de descargar" },
      { status: 409 }
    )
  }

  const pdf = await renderToBuffer(HarvardCvDocument({ cv }))

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName(cv.name)}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
