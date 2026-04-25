import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronRight, FileSearch } from "lucide-react"
import { auth } from "@/auth"
import { db } from "@/db"
import { analyses, users } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "shrink-0 text-sm font-bold tabular-nums px-3 py-1 rounded-full",
        score >= 70
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
          : score >= 50
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
            : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
      )}
    >
      {score}%
    </span>
  )
}

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

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mi historial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {userAnalyses.length} análisis realizados
          </p>
        </div>
        <Link href="/analizar">
          <Button className="bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700" size="sm">
            Nuevo análisis
          </Button>
        </Link>
      </div>

      {userAnalyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <FileSearch className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mb-1 font-medium">Aún no tienes análisis</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Sube tu CV y analiza tu primer puesto de trabajo.
          </p>
          <Link href="/analizar">
            <Button>Analizar mi CV</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {userAnalyses.map((analysis) => (
            <Link key={analysis.id} href={`/resultado/${analysis.id}`}>
              <Card className="card-hover cursor-pointer border-border/60 shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <ScoreBadge score={analysis.matchScore} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {analysis.jobDescription.slice(0, 100)}...
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(analysis.createdAt).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
