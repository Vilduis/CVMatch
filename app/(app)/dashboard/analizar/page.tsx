import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import AnalizarForm from "./form"
import { FREE_COOKIE, FREE_MAX } from "@/app/api/analyze/route"

export default async function AnalizarPage() {
  const session = await auth()
  const cookieStore = await cookies()
  const freeCount = parseInt(cookieStore.get(FREE_COOKIE)?.value ?? "0", 10)
  const freeRemaining = Math.max(0, FREE_MAX - freeCount)

  let credits: number | null = null
  if (session?.user?.email) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      columns: { credits: true },
    })
    credits = user?.credits ?? 0
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Espacio de trabajo
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Nuevo análisis
        </h1>
        <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Sube tu CV y pega la descripción del puesto. Recibirás el match,
          fortalezas, brechas y mejoras concretas en menos de 30 segundos.
        </p>
      </header>

      <AnalizarForm credits={credits} freeRemaining={freeRemaining} />
    </div>
  )
}
