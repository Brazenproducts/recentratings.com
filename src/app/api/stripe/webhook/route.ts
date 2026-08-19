import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || stripeKey.includes('placeholder')) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey)
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret!)
  } catch (err: unknown) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const businessId = session.metadata?.businessId
        const plan = session.metadata?.plan
        if (businessId && plan) {
          await supabaseAdmin
            .from('businesses')
            .update({
              plan,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', businessId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const priceId = sub.items.data[0]?.price?.id
        // Map price ID back to plan name
        const planMap: Record<string, string> = {
          [process.env.STRIPE_PRICE_GROWTH || '']: 'growth',
          [process.env.STRIPE_PRICE_PRO || '']: 'pro',
        }
        const plan = planMap[priceId] || 'free'
        await supabaseAdmin
          .from('businesses')
          .update({ plan, stripe_subscription_id: sub.id })
          .eq('stripe_customer_id', sub.customer as string)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from('businesses')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('stripe_customer_id', sub.customer as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
