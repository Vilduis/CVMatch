import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { isPlanId, PLANS } from "@/lib/plans"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para comprar créditos" },
      { status: 401 }
    )
  }

  const { planId } = await req.json()
  if (!isPlanId(planId)) {
    return NextResponse.json({ error: "Plan no válido" }, { status: 400 })
  }
  const plan = PLANS[planId]

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("host")}`

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
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
