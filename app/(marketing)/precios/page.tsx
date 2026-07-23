import Link from "next/link"
import { Check, Lock, ShieldCheck, Sparkles } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { plansList } from "@/lib/plans"
import BuyButton from "@/components/buy-button"

const beneficios = [
  "Puntaje de match 0–100",
  "Fortalezas y brechas",
  "Sugerencias para tu CV",
  "Preguntas de entrevista (≥ 70)",
  "Historial guardado",
  "Créditos sin vencimiento",
]

export default function PreciosPage() {
  return (
    <main className="relative">
      <div className="container mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Precios
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Paga una vez. Sin suscripción.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Cada crédito = 1 análisis completo. Compra una vez y úsalos a tu ritmo.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch">
          {plansList.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.06}>
              <div
                className={
                  "group relative flex h-full flex-col rounded-xl border bg-card/40 p-6 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md " +
                  (plan.popular
                    ? "border-primary/40 bg-primary/[0.04]"
                    : "border-border/60 hover:border-border")
                }
              >
                {plan.popular && (
                  <span className="absolute -top-2 left-6 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background px-2 py-0.5 text-[10px] font-medium text-primary">
                    <Sparkles className="size-2.5" />
                    Más popular
                  </span>
                )}

                <div className="flex items-baseline justify-between">
                  <h2 className="text-[16px] font-semibold tracking-tight">
                    {plan.nombre}
                  </h2>
                  <span className="text-[11px] text-muted-foreground">
                    {plan.credits} créditos
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  {plan.descripcion}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground">
                    S/
                  </span>
                  <span className="font-mono text-5xl font-semibold tabular-nums tracking-tight">
                    {plan.precio}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  S/ {(parseFloat(plan.precio) / plan.credits).toFixed(2)} por análisis
                </p>

                <ul className="mt-7 flex-1 space-y-2.5 text-[13px] text-foreground/85">
                  {beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-3.5 shrink-0 text-[var(--success)]"
                        strokeWidth={2.25}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <BuyButton
                    planId={plan.id}
                    credits={plan.credits}
                    popular={plan.popular}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-14 flex max-w-xl flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-[12px] text-muted-foreground">
              <Lock className="size-3" />
              Pago seguro · Stripe · PEN
            </div>
            <p className="text-[12px] text-muted-foreground">
              Los créditos no tienen fecha de vencimiento. Úsalos a tu ritmo.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3" />
              No almacenamos el archivo original de tu CV.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 border-t border-border/60 pt-10 text-center">
            <p className="text-[13px] text-muted-foreground">
              ¿Aún no decides?{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Volver al inicio →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
