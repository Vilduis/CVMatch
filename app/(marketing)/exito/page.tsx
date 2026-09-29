import Link from "next/link"
import { ArrowRight, CheckCircle2, OctagonX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isPlanId, PLANS } from "@/lib/plans"
import { stripe } from "@/lib/stripe"

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let paid = false
  let credits = 0
  let planNombre = ""

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session.payment_status === "paid") {
        paid = true
        credits = parseInt(session.metadata?.credits ?? "0", 10)
        const planId = session.metadata?.planId
        planNombre = isPlanId(planId) ? PLANS[planId].nombre : ""
      }
    } catch {
      // session_id inválido
    }
  }

  if (!paid) {
    return (
      <main className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
          <OctagonX className="size-5 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          No se pudo confirmar el pago
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          El pago no fue procesado o el enlace ya no es válido.
        </p>
        <Button asChild className="mt-8">
          <Link href="/precios">Ver planes</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="flex size-12 items-center justify-center rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10">
        <CheckCircle2 className="size-5 text-[var(--success)]" />
      </div>

      <p className="mt-6 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        Pago confirmado
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Listo para usar.
      </h1>

      <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
        {planNombre ? (
          <>
            Plan{" "}
            <span className="font-medium text-foreground">{planNombre}</span> —
            compra exitosa.
          </>
        ) : (
          "Tu compra fue exitosa."
        )}
      </p>

      <div className="mt-6 inline-flex items-baseline gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1">
        <span className="font-mono text-base font-semibold tabular-nums">
          +{credits}
        </span>
        <span className="text-[12px] text-muted-foreground">
          análisis acreditados
        </span>
      </div>

      <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild className="w-full gap-1.5 sm:w-auto">
          <Link href="/dashboard/analizar">
            Analizar mi CV
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/dashboard/historial">Ver historial</Link>
        </Button>
      </div>
    </main>
  )
}
