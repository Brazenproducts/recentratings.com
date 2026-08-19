import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Price IDs — set these once Stripe products are created
const PRICE_IDS: Record<string, string> = {
  growth: process.env.STRIPE_PRICE_GROWTH || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey.includes('placeholder')) {
    return NextResponse.json({ error: 'Stripe not configured yet' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey)

  try {
    const { plan, businessId, email } = await req.json()

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan or price not configured' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { businessId, plan },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'}/for-businesses`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
