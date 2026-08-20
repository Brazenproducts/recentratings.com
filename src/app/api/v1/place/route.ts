/**
 * PUBLIC PLACE API v1
 * Used by SkipATip and other partners to get RecentRatings data for a business.
 * No auth required — public data only.
 *
 * GET /api/v1/place?slug=bartact-temecula-ca
 * GET /api/v1/place?google_place_id=ChIJ...
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 1800 // 30 min CDN cache when not dynamic

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const googlePlaceId = req.nextUrl.searchParams.get('google_place_id')

  if (!slug && !googlePlaceId) {
    return NextResponse.json({ error: 'slug or google_place_id required' }, { status: 400 })
  }

  // Look up restaurant
  let placeQuery = supabaseAdmin.from('restaurants').select('id,name,slug,city,state,google_place_id,google_rating,google_review_count,website')
  if (slug) placeQuery = placeQuery.eq('slug', slug)
  else placeQuery = placeQuery.eq('google_place_id', googlePlaceId!)
  const { data: place } = await placeQuery.maybeSingle()

  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Get time-bucketed ratings
  const { data: ratings } = await supabaseAdmin
    .from('recent_ratings')
    .select('google_rating_alltime,google_rating_90d,google_rating_180d,google_rating_365d,google_review_count,google_review_count_90d')
    .eq('restaurant_slug', place.slug)
    .maybeSingle()

  // Get verified buyer review stats from reviews_cache
  let verifiedStats = null
  if (place.google_place_id) {
    const { data: reviews } = await supabaseAdmin
      .from('reviews_cache')
      .select('rating,source,time_published')
      .eq('google_place_id', place.google_place_id)
      .in('source', ['yotpo', 'judgeme', 'stamped', 'okendo', 'csv'])
      .not('rating', 'is', null)

    if (reviews && reviews.length > 0) {
      const now = Date.now()
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      verifiedStats = {
        total: reviews.length,
        avg: parseFloat(avg.toFixed(2)),
        d90: reviews.filter(r => r.time_published && (now - new Date(r.time_published).getTime()) < 90 * 86400000).length,
        d180: reviews.filter(r => r.time_published && (now - new Date(r.time_published).getTime()) < 180 * 86400000).length,
        d365: reviews.filter(r => r.time_published && (now - new Date(r.time_published).getTime()) < 365 * 86400000).length,
      }
    }
  }

  return NextResponse.json({
    slug: place.slug,
    name: place.name,
    city: place.city,
    state: place.state,
    google_place_id: place.google_place_id,
    recentratings_url: `https://recentratings.com/place/${place.slug}`,
    // Google ratings (time-bucketed)
    google: {
      rating_alltime: ratings?.google_rating_alltime ?? place.google_rating ?? null,
      rating_90d: ratings?.google_rating_90d ?? null,
      rating_180d: ratings?.google_rating_180d ?? null,
      rating_365d: ratings?.google_rating_365d ?? null,
      review_count: ratings?.google_review_count ?? place.google_review_count ?? null,
      review_count_90d: ratings?.google_review_count_90d ?? null,
    },
    // Verified buyer ratings (Yotpo, Judge.me, etc.)
    verified: verifiedStats,
    attribution: 'RecentRatings.com',
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=1800',
    }
  })
}
