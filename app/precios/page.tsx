import { Check, Zap } from "lucide-react"
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
  "Historial de análisis",
  "Los créditos no vencen",
]

export default function PreciosPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-16">

      {/* Header */}
      <div className="mb-14 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Precios
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Planes simples y transparentes
        </h1>
        <p className="text-muted-foreground">
          Pago único, sin suscripciones. Cada crédito = 1 análisis completo de CV.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plansList.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              plan.popular
                ? "border-primary/50 ring-2 ring-primary/20"
                : "border-border/60"
            }`}
          >
            {plan.popular && (
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-600 to-violet-600" />
            )}

            <CardHeader className="pb-4 pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{plan.nombre}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.descripcion}</p>
                </div>
                {plan.popular && (
                  <Badge className="shrink-0 border-0 bg-linear-to-r from-indigo-600 to-violet-600 text-white">
                    <Zap className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-5">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-medium text-muted-foreground">S/</span>
                  <span className="text-4xl font-black tabular-nums">{plan.precio}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.credits} análisis · S/{" "}
                  {(parseFloat(plan.precio) / plan.credits).toFixed(2)} c/u
                </p>
              </div>

              <Separator />

              <ul className="space-y-2.5">
                {beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pb-6 pt-4">
              <BuyButton planId={plan.id} credits={plan.credits} popular={plan.popular} />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Trust */}
      <div className="mt-12 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <p>Pago seguro procesado por Stripe · Soles peruanos (PEN)</p>
        <p>Los créditos no tienen fecha de vencimiento.</p>
      </div>

    </main>
  )
}
