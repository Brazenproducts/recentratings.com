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

    // Certified rows: split into those with data vs those without
    const allCertifiedRows = (certifiedPlaces || []).map((p: Record<string, unknown>) =>
      buildRow(p.slug as string, p.name as string, p.city as string, p.state as string)
    )
    const certifiedWithData = allCertifiedRows.filter(r =>
      r.google_rating || r.google_rating_alltime || r.google_rating_90d || r.google_rating_365d
    )
    const certifiedNoData = allCertifiedRows.filter(r =>
      !r.google_rating && !r.google_rating_alltime && !r.google_rating_90d && !r.google_rating_365d
    )

    // Non-certified organic rows sorted by 90d score
    const organicRows = (ratedRows || [])
      .filter((r: { restaurant_slug: string }) => !certifiedSlugs.has(r.restaurant_slug))
      .map((r: Record<string, unknown>) =>
        buildRow(r.restaurant_slug as string, r.restaurant_name as string, r.city as string, r.state as string)
      )

    // Order: certified with data → organic scored → certified with no data
    const allRows = page === 1
      ? [...certifiedWithData, ...organicRows, ...certifiedNoData].slice(0, limit)
      : [...organicRows, ...certifiedNoData].slice(offset - certifiedWithData.length, offset - certifiedWithData.length + limit)

    results = allRows
    totalCount = rCount || 0

  } else {
    // Name search strategy:
    // 1. Certified restaurants — tiny dataset, always fast, always run first
    // 2. recent_ratings with full-text search — faster than ilike on large tables
    // Certified results always appear first regardless of order.

    // Step 1: certified/featured lookup (small N, instant)
    const certQuery = supabaseAdmin
      .from('restaurants')
      .select('id,name,slug,address,city,state,google_rating,google_review_count,google_photo_url,cuisine_type,is_certified,is_featured,is_founding_member,preferred_timeframe')
      .or('is_certified.eq.true,is_featured.eq.true')
      .limit(50)
    const { data: certAll } = await certQuery

    // Filter certified matches client-side (avoid ilike on even a small set)
    const qLower = (effectiveQ || '').toLowerCase()
    const cityLower = (effectiveCity || '').toLowerCase()
    const certMatches = (certAll || []).filter((r: Record<string, unknown>) => {
      const nameMatch = !qLower || (r.name as string || '').toLowerCase().includes(qLower)
      const cityMatch = !cityLower || (r.city as string || '').toLowerCase().includes(cityLower)
      const stateMatch = !state || (r.state as string || '').toUpperCase() === state.toUpperCase()
      return nameMatch && cityMatch && stateMatch
    })

    const certSlugs = new Set(certMatches.map((r: Record<string, unknown>) => r.slug as string))

    // Step 2: recent_ratings full-text search (faster than ilike)
    let ratedRows: Record<string, unknown>[] = []
    let rCount = 0
    if (effectiveQ) {
      const ftsQuery = effectiveQ.trim().split(/\s+/).map((w: string) => w + ':*').join(' & ')
      let rq = supabaseAdmin
        .from('recent_ratings')
        .select('restaurant_slug,restaurant_name,city,state,google_rating_90d,google_rating_365d,google_rating_alltime,google_review_count_90d,google_review_count_365d,google_review_count', { count: 'estimated' })
        .textSearch('restaurant_name', ftsQuery, { type: 'plain', config: 'english' })
        .order('google_review_count', { ascending: false })
        .limit(limit)
      if (effectiveCity) rq = rq.ilike('city', `%${effectiveCity}%`)
      if (state) rq = rq.eq('state', state.toUpperCase())
      const { data, count, error: rErr } = await rq
      if (!rErr) {
        ratedRows = (data || []).filter((r: Record<string, unknown>) => !certSlugs.has(r.restaurant_slug as string))
        rCount = count || 0
      }
    }

    // Enrich rated rows with restaurant details
    if (ratedRows.length > 0) {
      const slugs = ratedRows.map((r: Record<string, unknown>) => r.restaurant_slug as string)
      const { data: rests } = await supabaseAdmin
        .from('restaurants')
        .select('slug,address,google_photo_url,cuisine_type,google_rating,google_review_count,is_certified,is_featured,is_founding_member,preferred_timeframe')
        .in('slug', slugs)
      const restMap: Record<string, Record<string, unknown>> = {}
      if (rests) { for (const r of rests) restMap[r.slug] = r }
      ratedRows = ratedRows.map((r: Record<string, unknown>) => ({ ...r, id: r.restaurant_slug, slug: r.restaurant_slug, name: r.restaurant_name, ...(restMap[r.restaurant_slug as string] || {}) }))
    }

    // Merge: certified first, then organic
    results = [
      ...certMatches.map((r: Record<string, unknown>) => ({ ...r, id: r.slug })),
      ...ratedRows,
    ].slice(offset, offset + limit)
    totalCount = certMatches.length + rCount
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
