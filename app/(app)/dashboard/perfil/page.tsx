import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, LogOut, Mail } from "lucide-react"
import { auth } from "@/auth"
import { signOutAction } from "@/app/actions"
import { db } from "@/db"
import { users, analyses } from "@/db/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DeleteAccountDialog } from "./delete-account-dialog"

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(d)
}

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/")

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  })
  if (!dbUser) redirect("/")

  const analysisCount = await db.$count(
    analyses,
    eq(analyses.userId, dbUser.id)
  )

  const summary: { label: string; value: string }[] = [
    { label: "Créditos", value: String(dbUser.credits) },
    { label: "Análisis realizados", value: String(analysisCount) },
    { label: "Miembro desde", value: formatDate(new Date(dbUser.createdAt)) },
  ]

  const initial = session.user.name?.[0]?.toUpperCase() ?? "U"

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cuenta
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Perfil</h1>
        <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Información de tu cuenta y resumen de uso.
        </p>
      </header>

      {/* Identity */}
      <section className="flex flex-col items-start gap-5 rounded-xl border border-border/60 bg-card/40 p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar className="size-14 shrink-0 sm:size-16">
          <AvatarImage
            src={session.user.image ?? ""}
            alt={session.user.name ?? ""}
          />
          <AvatarFallback className="bg-muted text-lg font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-semibold tracking-tight">
            {session.user.name ?? "Sin nombre"}
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 truncate text-[13px] text-muted-foreground">
            <Mail className="size-3" />
            {session.user.email}
          </p>
        </div>

        <form action={signOutAction} className="w-full sm:w-auto">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full gap-1.5 text-destructive hover:text-destructive sm:w-auto"
          >
            <LogOut className="size-3.5" />
            Cerrar sesión
          </Button>
        </form>
      </section>

      {/* Summary */}
      <section className="flex flex-col gap-3">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Resumen
        </p>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40 sm:grid-cols-3">
          {summary.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 bg-card/40 p-5">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="font-mono text-2xl font-semibold tabular-nums sm:text-3xl">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="flex flex-col gap-3">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Accesos rápidos
        </p>
        <div className="overflow-hidden rounded-xl border border-border/60">
          <QuickLink
            href="/dashboard/creditos"
            title="Gestionar créditos"
            description="Revisa tu saldo y recarga tus análisis."
          />
          <QuickLink
            href="/dashboard/historial"
            title="Ver historial"
            description="Lista completa de tus análisis anteriores."
          />
          <QuickLink
            href="/precios"
            title="Planes y precios"
            description="Compara los paquetes disponibles."
            external
          />
        </div>
      </section>

      {/* Danger zone */}
      <section className="flex flex-col gap-3">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-destructive/80">
          Zona de peligro
        </p>
        <div className="flex flex-col items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="text-[13.5px] font-medium">Eliminar cuenta</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Borra tu cuenta, créditos e historial de análisis de forma permanente.
            </p>
          </div>
          <DeleteAccountDialog />
        </div>
      </section>
    </div>
  )
}

function QuickLink({
  href,
  title,
  description,
  external,
}: {
  href: string
  title: string
  description: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 border-t border-border/60 bg-card/30 px-5 py-4 transition-colors first:border-t-0 hover:bg-card/60"
    >
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium">{title}</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>
      </div>
      <ArrowUpRight
        className={
          "size-3.5 shrink-0 text-muted-foreground transition-transform " +
          (external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-0.5")
        }
      />
    </Link>
  )
}
