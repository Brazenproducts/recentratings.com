/**
 * PARTNER API — Verified Buyer Reviews
 * Allows authorized partners (e.g. SkipATip) to pull RecentRatings
 * verified buyer reviews for any business by slug.
 *
 * GET /api/partner/reviews/bartact-temecula-ca
 * Header: x-partner-key: <key>
 *
 * Returns only reviews from verified buyer platforms (Yotpo, Judge.me, Stamped).
 * Never returns Google/Yelp review text (legal).
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const PARTNER_KEYS: Record<string, string> = {
  [process.env.SKIPATIP_PARTNER_KEY || 'skipatip-dev']: 'skipatip',
}

const VERIFIED_SOURCES = ['yotpo', 'judgeme', 'stamped', 'okendo', 'csv']

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Auth
  const partnerKey = req.headers.get('x-partner-key') || req.nextUrl.searchParams.get('key') || ''
  const partner = PARTNER_KEYS[partnerKey]
  if (!partner) {
    return NextResponse.json({ error: 'Invalid partner key' }, { status: 401 })
  }

  const { slug } = await params

  // Look up the place
  const { data: place } = await supabaseAdmin
    .from('restaurants')
    .select('id, name, slug, city, state, google_place_id, google_rating, website')
    .eq('slug', slug)
    .maybeSingle()

  if (!place) {
    return NextResponse.json({ error: 'Place not found' }, { status: 404 })
  }

  // Fetch only verified buyer reviews
  const { data: reviews } = await supabaseAdmin
    .from('reviews_cache')
    .select('id, author_name, rating, text, time_published, source')
    .eq('google_place_id', place.google_place_id)
    .in('source', VERIFIED_SOURCES)
    .or('disputed.is.null,disputed.eq.false')
    .order('time_published', { ascending: false })
    .limit(200)

  const reviewList = reviews || []

  // Compute aggregate stats
  const total = reviewList.length
  const avg = total > 0
    ? parseFloat((reviewList.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(2))
    : null

  return NextResponse.json({
    slug,
    name: place.name,
    city: place.city,
    state: place.state,
    recentratings_url: `https://recentratings.com/place/${slug}`,
    verified_reviews: {
      total,
      avg_rating: avg,
      sources: [...new Set(reviewList.map(r => r.source))],
    },
    google_rating: place.google_rating || null,
    reviews: reviewList.map(r => ({
      id: r.id,
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      date: r.time_published,
      source: r.source,
      verified_buyer: true,
    })),
    attribution: 'Powered by RecentRatings — recentratings.com',
    partner,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
