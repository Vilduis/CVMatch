import Stripe from "stripe"
import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLANS, type PlanId } from "@/lib/plans"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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
        const planId = session.metadata?.planId as PlanId | undefined
        planNombre = planId ? PLANS[planId]?.nombre ?? "" : ""
      }
    } catch {
      // session_id inválido — mostrar error
    }
  }

  if (!paid) {
    return (
      <main className="container mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/30">
          <XCircle className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">No se pudo confirmar el pago</h1>
        <p className="mb-8 text-muted-foreground">
          El pago no fue procesado o el enlace ya no es válido.
        </p>
        <Link href="/precios">
          <Button>Ver planes</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      </div>

      <h1 className="mb-2 text-2xl font-bold">¡Pago recibido!</h1>
      <p className="mb-1 text-muted-foreground">
        {planNombre ? (
          <>
            Plan{" "}
            <span className="font-semibold text-foreground">{planNombre}</span>
            {" "}— compra exitosa.
          </>
        ) : (
          "Tu compra fue exitosa."
        )}
      </p>
      <p className="mb-8 text-muted-foreground">
        Se acreditarán{" "}
        <span className="font-semibold text-foreground">
          {credits} análisis
        </span>{" "}
        a tu cuenta en breve.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/analizar">
          <Button className="bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700">
            Analizar mi CV ahora
          </Button>
        </Link>
        <Link href="/historial">
          <Button variant="outline">Ver mi historial</Button>
        </Link>
      </div>
    </main>
  )
}
