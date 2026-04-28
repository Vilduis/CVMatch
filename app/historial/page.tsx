import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FileSearch } from "lucide-react"
import { auth } from "@/auth"
import { db } from "@/db"
import { analyses, users } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { AnalisisCard } from "./analisis-card"

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
          <Button
            className="bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
            size="sm"
          >
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
            <AnalisisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}
    </main>
  )
}
