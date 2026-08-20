/**
 * PARTNER RATING ENDPOINT — lightweight, for embedding in cards
 * Returns just the scores — no reviews text, no personal data.
 * Designed to be called inline by SkipATip restaurant cards.
 *
 * GET /api/partner/rating?slug=bartact-temecula-ca
 * GET /api/partner/rating?google_place_id=ChIJ...
 * Header: x-partner-key: <key>  (optional — public data anyway)
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const gid = req.nextUrl.searchParams.get('google_place_id')
  if (!slug && !gid) return NextResponse.json({ error: 'slug or google_place_id required' }, { status: 400 })

  // Lookup
  let q = supabaseAdmin.from('restaurants').select('slug,name,google_place_id,google_rating')
  if (slug) q = q.eq('slug', slug)
  else q = q.eq('google_place_id', gid!)
  const { data: place } = await q.maybeSingle()
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Ratings
  const { data: r } = await supabaseAdmin
    .from('recent_ratings')
    .select('google_rating_alltime,google_rating_90d,google_rating_180d,google_rating_365d,google_review_count')
    .eq('restaurant_slug', place.slug)
    .maybeSingle()

  // Verified buyer count + avg (fast — just aggregates)
  let verifiedAvg = null, verifiedCount = 0
  if (place.google_place_id) {
    const { data: vr } = await supabaseAdmin
      .from('reviews_cache')
      .select('rating')
      .eq('google_place_id', place.google_place_id)
      .in('source', ['yotpo', 'judgeme', 'stamped', 'okendo', 'csv'])
      .not('rating', 'is', null)
    if (vr?.length) {
      verifiedCount = vr.length
      verifiedAvg = parseFloat((vr.reduce((s, x) => s + x.rating, 0) / vr.length).toFixed(2))
    }
  }

  return NextResponse.json({
    slug: place.slug,
    name: place.name,
    url: `https://recentratings.com/place/${place.slug}`,
    alltime: r?.google_rating_alltime ?? place.google_rating ?? null,
    d90: r?.google_rating_90d ?? null,
    d180: r?.google_rating_180d ?? null,
    d365: r?.google_rating_365d ?? null,
    review_count: r?.google_review_count ?? null,
    verified_avg: verifiedAvg,
    verified_count: verifiedCount,
  }, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, s-maxage=900' }
  })
}
