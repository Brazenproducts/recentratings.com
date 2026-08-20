import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"
import { supabaseAdmin } from '@/lib/supabase'

// Free tier: max 3 disputed reviews
const FREE_DISPUTE_LIMIT = 0 // Free plan gets no fraud disputes — paid feature only

// GET — list all reviews for a business (by email)
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  // Look up business
  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id, plan, domain')
    .eq('email', email.toLowerCase())
    .maybeSingle()
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  // Find their restaurant by domain
  const { data: restaurants } = await supabaseAdmin
    .from('restaurants')
    .select('slug, google_place_id, name')
    .ilike('website', `%${business.domain}%`)
    .limit(5)

  if (!restaurants?.length) return NextResponse.json({ reviews: [], disputedCount: 0 })

  const placeId = restaurants[0].google_place_id
  if (!placeId) return NextResponse.json({ reviews: [], disputedCount: 0 })

  // Fetch ALL reviews (including disputed) for dashboard
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews_cache')
    .select('id, author_name, rating, text, time_published, source, disputed, disputed_at, disputed_by, dispute_reason')
    .eq('google_place_id', placeId)
    .order('time_published', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const disputedCount = (reviews || []).filter(r => r.disputed).length

  return NextResponse.json({ reviews: reviews || [], disputedCount, plan: business.plan })
}

// POST — flag or unflag a review
export async function POST(req: NextRequest) {
  const { reviewId, email, action, reason } = await req.json()

  if (!reviewId || !email || !action) {
    return NextResponse.json({ error: 'reviewId, email, and action required' }, { status: 400 })
  }
  if (!['flag', 'unflag'].includes(action)) {
    return NextResponse.json({ error: 'action must be flag or unflag' }, { status: 400 })
  }

  // Look up business
  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id, plan, domain')
    .eq('email', email.toLowerCase())
    .maybeSingle()
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  // Confirm review belongs to their restaurant
  const { data: restaurants } = await supabaseAdmin
    .from('restaurants')
    .select('google_place_id')
    .ilike('website', `%${business.domain}%`)
    .limit(1)

  const placeId = restaurants?.[0]?.google_place_id
  if (!placeId) return NextResponse.json({ error: 'No linked restaurant found' }, { status: 404 })

  const { data: review } = await supabaseAdmin
    .from('reviews_cache')
    .select('id, google_place_id, disputed')
    .eq('id', reviewId)
    .eq('google_place_id', placeId)
    .maybeSingle()

  if (!review) return NextResponse.json({ error: 'Review not found or does not belong to your business' }, { status: 404 })

  // Free tier limit check
  if (action === 'flag' && business.plan === 'free') {
    const { count } = await supabaseAdmin
      .from('reviews_cache')
      .select('id', { count: 'exact', head: true })
      .eq('google_place_id', placeId)
      .eq('disputed', true)

    if ((count || 0) >= FREE_DISPUTE_LIMIT) {
      return NextResponse.json({
        error: `Free plan is limited to ${FREE_DISPUTE_LIMIT} disputed reviews. Upgrade to Growth or Pro for unlimited flagging.`,
        upgradeRequired: true,
      }, { status: 403 })
    }
  }

  // Apply flag / unflag
  const update = action === 'flag'
    ? { disputed: true, disputed_at: new Date().toISOString(), disputed_by: email, dispute_reason: reason || null }
    : { disputed: false, disputed_at: null, disputed_by: null, dispute_reason: null }

  const { error: updateError } = await supabaseAdmin
    .from('reviews_cache')
    .update(update)
    .eq('id', reviewId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ success: true, action })
}
