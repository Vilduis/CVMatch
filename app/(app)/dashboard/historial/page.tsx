import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, FileSearch, Sparkles } from "lucide-react"
import { auth } from "@/auth"
import { db } from "@/db"
import { analyses, users } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { StaggerList } from "@/components/stagger"
import { AnalisisRow } from "./analisis-card"

export default async function HistorialPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/")

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
    columns: { id: true },
  })
  if (!dbUser) redirect("/")

  const userAnalyses = await db.query.analyses.findMany({
    where: eq(analyses.userId, dbUser.id),
    orderBy: [desc(analyses.createdAt)],
  })

  const total = userAnalyses.length
  const avgScore =
    total > 0
      ? Math.round(userAnalyses.reduce((s, a) => s + a.matchScore, 0) / total)
      : 0
  const excellentCount = userAnalyses.filter((a) => a.matchScore >= 70).length

  const stats = [
    { label: "Análisis totales", value: String(total), suffix: "" },
    {
      label: "Score promedio",
      value: total > 0 ? String(avgScore) : "—",
      suffix: total > 0 ? "/100" : "",
    },
    {
      label: "Excelentes (≥ 70)",
      value: total > 0 ? String(excellentCount) : "—",
      suffix: "",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Historial
          </h1>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            Todos tus análisis ordenados del más reciente al más antiguo.
          </p>
        </div>
        <Link href="/dashboard/analizar">
          <Button size="sm" className="h-8 gap-1.5">
            <Sparkles className="size-3.5" />
            Nuevo análisis
          </Button>
        </Link>
      </header>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40">
          {stats.map(({ label, value, suffix }) => (
            <div key={label} className="flex flex-col gap-1 bg-card/40 px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="font-mono text-2xl font-semibold tabular-nums sm:text-3xl">
                {value}
                {suffix && (
                  <span className="ml-0.5 text-[12px] font-medium text-muted-foreground">
                    {suffix}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {total === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60">
          <div className="hidden grid-cols-[64px_1fr_auto_auto] items-center gap-4 border-b border-border/60 bg-card/40 px-5 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:grid">
            <span>Score</span>
            <span>Puesto</span>
            <span className="text-right">Fecha</span>
            <span className="w-[88px]" />
          </div>
          <StaggerList>
            {userAnalyses.map((analysis) => (
              <AnalisisRow key={analysis.id} analysis={analysis} />
            ))}
          </StaggerList>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center sm:py-20">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileSearch className="size-5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Sin análisis aún
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">
        Tu historial está vacío.
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
        Cada análisis que ejecutes aparecerá aquí con su score y resumen.
      </p>
      <Link href="/dashboard/analizar" className="mt-6">
        <Button className="gap-1.5">
          Analizar mi CV
          <ArrowRight className="size-3.5" />
        </Button>
      </Link>
    </div>
  )
}
