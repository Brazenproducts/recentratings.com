import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const { data: business, error } = await supabaseAdmin
    .from('businesses')
    .select('id, name, domain, email, plan, stripe_customer_id, created_at')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error || !business) {
    return NextResponse.json({ error: 'No account found for that email.' }, { status: 404 })
  }

  // Get connected platforms
  const { data: sources } = await supabaseAdmin
    .from('business_review_sources')
    .select('id, platform, last_synced_at')
    .eq('business_id', business.id)

  // Get review stats — find their restaurant slug by domain match
  const { data: restaurants } = await supabaseAdmin
    .from('restaurants')
    .select('slug, google_place_id')
    .ilike('website', `%${business.domain}%`)
    .limit(5)

  let stats = null
  if (restaurants && restaurants.length > 0) {
    const restaurant = restaurants[0]
    if (restaurant.google_place_id) {
      const { count: reviewCount } = await supabaseAdmin
        .from('reviews_cache')
        .select('id', { count: 'exact', head: true })
        .eq('google_place_id', restaurant.google_place_id)

      const { data: ratingData } = await supabaseAdmin
        .from('reviews_cache')
        .select('rating')
        .eq('google_place_id', restaurant.google_place_id)
        .not('rating', 'is', null)

      const avgRating = ratingData && ratingData.length > 0
        ? ratingData.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / ratingData.length
        : 0

      stats = { reviewCount: reviewCount || 0, avgRating, pageSlug: restaurant.slug }
    } else {
      stats = { reviewCount: 0, avgRating: 0, pageSlug: restaurant.slug }
    }
  }

  return NextResponse.json({ business, sources: sources || [], stats })
}
