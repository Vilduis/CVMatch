import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PLANS, type PlanId } from "@/lib/plans"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para comprar créditos" },
      { status: 401 }
    )
  }

  const { planId } = await req.json()
  const plan = PLANS[planId as PlanId]
  if (!plan) {
    return NextResponse.json({ error: "Plan no válido" }, { status: 400 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("host")}`

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "pen",
          product_data: {
            name: `CVMatch AI — ${plan.nombre}`,
            description: `${plan.credits} análisis de CV con inteligencia artificial`,
          },
          unit_amount: plan.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      credits: String(plan.credits),
      planId: plan.id,
    },
    success_url: `${baseUrl}/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/precios`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
