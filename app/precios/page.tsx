import { Check, Lock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { plansList } from "@/lib/plans"
import BuyButton from "./buy-button"

const beneficios = [
  "Puntaje de match del 0 al 100",
  "Análisis de fortalezas y brechas",
  "Sugerencias para mejorar tu CV",
  "Preguntas de entrevista (match ≥ 70%)",
  "Historial de análisis guardado",
  "Los créditos no vencen",
]

export default function PreciosPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-16 sm:py-20">

      {/* Header */}
      <div className="mb-16 text-center">
        <div className="badge-chip mb-5 inline-flex">
          <Sparkles className="h-3.5 w-3.5" />
          Pago único, sin suscripción
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Planes simples y{" "}
          <span className="text-primary">transparentes</span>
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Cada crédito equivale a 1 análisis completo de CV. Paga una vez, úsalos cuando quieras.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
        {plansList.map((plan) => (
          <div key={plan.id} className={`relative ${plan.popular ? "pt-4" : ""}`}>

            {plan.popular && (
              <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
                <Badge className="bg-primary px-4 py-0.5 text-xs text-primary-foreground shadow-sm">
                  Más popular
                </Badge>
              </div>
            )}

            <Card
              className={`flex h-full flex-col transition-all duration-200 hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary/40 shadow-lg ring-2 ring-primary/25 hover:shadow-xl"
                  : "border-border/60 shadow-sm hover:shadow-md"
              }`}
            >
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{plan.nombre}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.descripcion}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-5">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-muted-foreground">S/</span>
                    <span className="text-5xl font-black tabular-nums">{plan.precio}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {plan.credits} análisis ·{" "}
                    <span className="font-medium text-foreground">
                      S/ {(parseFloat(plan.precio) / plan.credits).toFixed(2)}
                    </span>{" "}
                    por análisis
                  </p>
                </div>

                <Separator />

                <ul className="space-y-3">
                  {beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pb-6 pt-4">
                <BuyButton planId={plan.id} credits={plan.credits} popular={plan.popular} />
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="mt-12 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Pago seguro procesado por Stripe · Soles peruanos (PEN)
        </div>
        <p className="text-xs text-muted-foreground">
          Los créditos no tienen fecha de vencimiento. Úsalos a tu ritmo.
        </p>
      </div>

    </main>
  )
}
