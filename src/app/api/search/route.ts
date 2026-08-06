import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Check if a query string exactly matches a city name in our DB
async function isKnownCity(q: string): Promise<boolean> {
  if (!q || q.trim().length < 2) return false
  const { count } = await supabaseAdmin
    .from('restaurants')
    .select('id', { count: 'exact', head: true })
    .ilike('city', q.trim())
    .limit(1)
  return (count ?? 0) > 0
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const city = searchParams.get('city') || ''
  const state = searchParams.get('state') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const offset = (page - 1) * limit

  // Smart routing: if q exactly matches a city in our DB and no explicit city param,
  // treat q as a city browse rather than a name search
  let effectiveQ = q
  let effectiveCity = city
  const modeParam = searchParams.get('mode') || ''
  if (q && !city && modeParam !== 'name') {
    const cityMatch = await isKnownCity(q)
    if (cityMatch) {
      effectiveCity = q
      effectiveQ = ''
    }
  }

  const isCityBrowse = !!(effectiveCity && !effectiveQ)

  // For city browse: query recent_ratings directly so we can sort by 90d score.
  // For name search: query restaurants table with name filter.
  let results: Record<string, unknown>[] = []
  let totalCount = 0

  if (isCityBrowse) {
    // Step 1: fetch certified/featured places for this city from restaurants table (always pinned to top)
    const { data: certifiedPlaces } = await supabaseAdmin
      .from('restaurants')
      .select('slug,name,address,city,state,google_rating,google_review_count,google_photo_url,google_price_level,yelp_rating,yelp_review_count,cuisine_type,is_certified,is_featured,is_founding_member,preferred_timeframe')
      .ilike('city', `%${effectiveCity}%`)
      .or('is_certified.eq.true,is_featured.eq.true')
      .order('is_founding_member', { ascending: false })
      .order('is_certified', { ascending: false })

    const certifiedSlugs = new Set((certifiedPlaces || []).map((p: { slug: string }) => p.slug))

    // Step 2: fetch time-bucketed data for all results, sorting non-certified by 90d score
    let rq = supabaseAdmin
      .from('recent_ratings')
      .select(`
        restaurant_slug,restaurant_name,city,state,
        google_rating_90d,google_rating_365d,google_rating_alltime,
        google_review_count_90d,google_review_count_365d,google_review_count,
        yelp_rating_alltime
      `, { count: 'exact' })
      .ilike('city', `%${effectiveCity}%`)
      .order('google_rating_90d', { ascending: false, nullsFirst: false })
      .order('google_review_count_90d', { ascending: false, nullsFirst: false })
      .range(0, 199) // fetch enough to fill page after certified are pinned

    if (state) rq = rq.eq('state', state.toUpperCase())

    const { data: ratedRows, error: rErr, count: rCount } = await rq
    if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 })

    // Enrich with restaurant details
    const allSlugs = [...new Set([
      ...(certifiedPlaces || []).map((p: { slug: string }) => p.slug),
      ...(ratedRows || []).map((r: { restaurant_slug: string }) => r.restaurant_slug),
    ])]
    const restaurantMap: Record<string, Record<string, unknown>> = {}
    if (allSlugs.length > 0) {
      const { data: rests } = await supabaseAdmin
        .from('restaurants')
        .select('slug,address,google_photo_url,google_price_level,yelp_rating,yelp_review_count,cuisine_type,google_rating,google_review_count,is_certified,is_featured,is_founding_member,preferred_timeframe')
        .in('slug', allSlugs)
      if (rests) {
        for (const r of rests) restaurantMap[r.slug] = r
      }
    }

    // Ratings map from recent_ratings
    const ratingsMap: Record<string, Record<string, unknown>> = {}
    for (const r of (ratedRows || [])) {
      ratingsMap[r.restaurant_slug as string] = r
    }

    function buildRow(slug: string, name: string, city: string, state: string) {
      const rest = restaurantMap[slug] || {}
      const rating = ratingsMap[slug] || {}
      return {
        id: slug,
        slug,
        name,
        city,
        state,
        address: rest.address,
        google_photo_url: rest.google_photo_url,
        google_price_level: rest.google_price_level,
        google_rating: rest.google_rating,
        google_review_count: rest.google_review_count || rating.google_review_count,
        yelp_rating: rest.yelp_rating,
        yelp_review_count: rest.yelp_review_count,
        yelp_rating_alltime: rating.yelp_rating_alltime,
        cuisine_type: rest.cuisine_type,
        is_certified: rest.is_certified,
        is_featured: rest.is_featured,
        is_founding_member: rest.is_founding_member,
        preferred_timeframe: rest.preferred_timeframe,
        google_rating_90d: rating.google_rating_90d,
        google_rating_365d: rating.google_rating_365d,
        google_rating_alltime: rating.google_rating_alltime,
        google_review_count_90d: rating.google_review_count_90d,
        google_review_count_365d: rating.google_review_count_365d,
      }
    }

    // Certified/featured rows — always first
    const certifiedRows = (certifiedPlaces || []).map((p: Record<string, unknown>) =>
      buildRow(p.slug as string, p.name as string, p.city as string, p.state as string)
    )

    // Non-certified rows sorted by 90d score — exclude any already in certified list
    const organicRows = (ratedRows || [])
      .filter((r: { restaurant_slug: string }) => !certifiedSlugs.has(r.restaurant_slug))
      .map((r: Record<string, unknown>) =>
        buildRow(r.restaurant_slug as string, r.restaurant_name as string, r.city as string, r.state as string)
      )

    // Paginate: certified always included on page 1, organic fills the rest
    const allRows = page === 1
      ? [...certifiedRows, ...organicRows].slice(0, limit)
      : organicRows.slice(offset - certifiedRows.length, offset - certifiedRows.length + limit)

    results = allRows
    totalCount = rCount || 0

  } else {
    // Name search: query restaurants table
    let query = supabaseAdmin
      .from('restaurants')
      .select('id,name,slug,address,city,state,google_rating,google_review_count,google_photo_url,google_price_level,yelp_rating,yelp_review_count,cuisine_type', { count: 'exact' })
      .not('google_rating', 'is', null)
      .order('google_review_count', { ascending: false })
      .range(offset, offset + limit - 1)

    if (effectiveQ) query = query.ilike('name', `%${effectiveQ}%`)
    if (effectiveCity) query = query.ilike('city', `%${effectiveCity}%`)
    if (state) query = query.eq('state', state.toUpperCase())

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const places = data || []
    totalCount = count || 0

    // Enrich name-search results with time-bucketed data
    if (places.length > 0) {
      const slugs = places.map((p: { slug: string }) => p.slug)
      const { data: ratingsRows } = await supabaseAdmin
        .from('recent_ratings')
        .select('restaurant_slug,google_rating_90d,google_rating_365d,google_rating_alltime,google_review_count_90d,google_review_count_365d,yelp_rating_alltime')
        .in('restaurant_slug', slugs)
      const ratingsMap: Record<string, Record<string, unknown>> = {}
      if (ratingsRows) {
        for (const r of ratingsRows) ratingsMap[r.restaurant_slug] = r
      }
      results = places.map((p: Record<string, unknown>) => ({ ...p, ...(ratingsMap[p.slug as string] || {}) }))
    } else {
      results = places
    }
  }

  return NextResponse.json({
    results,
    total: totalCount,
    page,
    limit,
    pages: Math.ceil(totalCount / limit),
    cityMode: isCityBrowse ? effectiveCity : undefined,
  })
}
