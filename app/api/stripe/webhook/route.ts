import Stripe from "stripe"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { stripeEvents, users } from "@/db/schema"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Sin firma Stripe" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET no configurado" },
      { status: 500 }
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error"
    return NextResponse.json({ error: `Firma inválida: ${message}` }, { status: 400 })
  }

  // Idempotencia: ignorar eventos ya procesados
  const existing = await db.query.stripeEvents.findFirst({
    where: eq(stripeEvents.eventId, event.id),
    columns: { eventId: true },
  })
  if (existing) {
    return NextResponse.json({ received: true })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === "paid") {
      const userId = session.metadata?.userId
      const credits = parseInt(session.metadata?.credits ?? "0", 10)

      if (userId && credits > 0) {
        await db
          .update(users)
          .set({ credits: sql`${users.credits} + ${credits}` })
          .where(eq(users.id, userId))
      }
    }
  }

  // Registrar el evento como procesado
  await db.insert(stripeEvents).values({ eventId: event.id }).onConflictDoNothing()

  return NextResponse.json({ received: true })
}
