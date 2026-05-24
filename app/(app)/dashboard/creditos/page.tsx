import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Check, Lock, ShieldCheck, Sparkles } from "lucide-react"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import BuyButton from "@/components/buy-button"
import { plansList } from "@/lib/plans"

const benefits = [
  "Análisis completo con IA",
  "Sugerencias para tu CV",
  "Preguntas de entrevista",
  "Historial guardado",
]

export default async function CreditosPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/")

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
    columns: { credits: true },
  })
  if (!dbUser) redirect("/")

  const credits = dbUser.credits
  const isEmpty = credits === 0

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cuenta
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Créditos</h1>
        <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Cada análisis consume 1 crédito. Los créditos no vencen — úsalos a tu
          ritmo.
        </p>
      </header>

      {/* Balance */}
      <section className="rounded-xl border border-border/60 bg-card/40 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Saldo disponible
            </p>
            <p className="font-mono text-6xl font-semibold leading-none tabular-nums sm:text-7xl">
              {credits}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {credits === 1 ? "análisis disponible" : "análisis disponibles"}
            </p>
          </div>

          {isEmpty && (
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-3 py-1 text-[11.5px] font-medium text-[var(--warning)]">
              <Sparkles className="size-3" />
              Recarga para seguir analizando
            </div>
          )}
        </div>
      </section>

      {/* Plans */}
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Recargar
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Elige un plan
            </h2>
          </div>
          <Link
            href="/precios"
            className="inline-flex items-center gap-1 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver detalles completos
            <ArrowUpRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch">
          {plansList.map((plan) => (
            <div
              key={plan.id}
              className={
                "group relative flex h-full flex-col rounded-xl border bg-card/40 p-5 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md " +
                (plan.popular
                  ? "border-primary/40 bg-primary/[0.04]"
                  : "border-border/60 hover:border-border")
              }
            >
              {plan.popular && (
                <span className="absolute -top-2 left-5 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background px-2 py-0.5 text-[10px] font-medium text-primary">
                  <Sparkles className="size-2.5" />
                  Más popular
                </span>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="text-[14.5px] font-semibold tracking-tight">
                  {plan.nombre}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  {plan.credits} créditos
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-[11px] font-medium text-muted-foreground">
                  S/
                </span>
                <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
                  {plan.precio}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                S/ {(parseFloat(plan.precio) / plan.credits).toFixed(2)} por análisis
              </p>

              <ul className="mt-5 flex-1 space-y-1.5 text-[12.5px] text-foreground/80">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Check
                      className="size-3 shrink-0 text-[var(--success)]"
                      strokeWidth={2.25}
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <BuyButton
                  planId={plan.id}
                  credits={plan.credits}
                  popular={plan.popular}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3" />
            Pago seguro vía Stripe
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3" />
            Créditos sin fecha de vencimiento
          </span>
        </div>
      </section>
    </div>
  )
}
