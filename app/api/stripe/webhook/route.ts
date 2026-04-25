import Stripe from "stripe"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Next.js App Router no consume el body automáticamente, pero igual
// lo indicamos explícitamente para claridad
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === "paid") {
      const userEmail = session.customer_email
      const credits = parseInt(session.metadata?.credits ?? "0", 10)

      if (userEmail && credits > 0) {
        await db
          .update(users)
          .set({ credits: sql`${users.credits} + ${credits}` })
          .where(eq(users.email, userEmail))
      }
    }
  }

  return NextResponse.json({ received: true })
}
