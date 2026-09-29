import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { ArrowRight, Download, FileText, PencilLine } from "lucide-react"
import { db } from "@/db"
import { analyses, tailoredCvs } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/current-user"
import { pendingPlaceholders, tailoredCvSchema } from "@/lib/cv-types"

export const metadata = { title: "Mis CVs — CVMatch" }

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d)
}

function summarize(text: string) {
  const line = text.replace(/\s+/g, " ").trim()
  return line.length <= 90
    ? line
    : line.slice(0, 90).replace(/\s+\S*$/, "") + "…"
}

export default async function MisCvsPage() {
  const user = await getCurrentUser()

  const rows = await db
    .select({
      analysisId: tailoredCvs.analysisId,
      data: tailoredCvs.data,
      updatedAt: tailoredCvs.updatedAt,
      matchScore: analyses.matchScore,
      jobDescription: analyses.jobDescription,
    })
    .from(tailoredCvs)
    .innerJoin(analyses, eq(analyses.id, tailoredCvs.analysisId))
    .where(eq(tailoredCvs.userId, user.id))
    .orderBy(desc(tailoredCvs.updatedAt))

  const cvs = rows.map((row) => {
    const cv = tailoredCvSchema.parse(JSON.parse(row.data))
    return {
      id: row.analysisId,
      role: cv.target?.role || summarize(row.jobDescription),
      company: cv.target?.company ?? "",
      pending: pendingPlaceholders(cv),
      matchScore: row.matchScore,
      updatedAt: row.updatedAt,
    }
  })

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Espacio de trabajo
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Mis CVs</h1>
        <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Cada CV adaptado a una oferta. Edítalo o descárgalo en PDF cuando
          quieras, sin gastar créditos.
        </p>
      </header>

      {cvs.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="stagger overflow-hidden rounded-xl border border-border/60">
          {cvs.map((cv) => (
            <li
              key={cv.id}
              className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 first:border-t-0 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{cv.role}</p>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    {cv.company && `${cv.company} · `}Match {cv.matchScore} ·
                    Actualizado {formatDate(cv.updatedAt)}
                  </p>
                  {cv.pending > 0 && (
                    <p className="mt-1 text-[12px] text-[var(--warning)]">
                      {cv.pending}{" "}
                      {cv.pending === 1 ? "dato pendiente" : "datos pendientes"}{" "}
                      antes de descargar
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 gap-2 pl-12 sm:pl-0">
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <Link href={`/dashboard/resultado/${cv.id}/cv`}>
                    <PencilLine className="size-3.5" />
                    Editar
                  </Link>
                </Button>
                {cv.pending === 0 && (
                  <Button asChild size="sm" className="gap-1.5">
                    <a href={`/api/cv/${cv.id}`} download>
                      <Download className="size-3.5" />
                      PDF
                    </a>
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center sm:py-20">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileText className="size-5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">
        Aún no adaptaste ningún CV.
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
        Analiza tu CV contra una oferta y, en el resultado, pulsa “Adaptar CV”.
        Aparecerá aquí listo para editar y descargar.
      </p>
      <Button asChild className="mt-6 gap-1.5">
        <Link href="/dashboard/analizar">
          Analizar mi CV
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  )
}
