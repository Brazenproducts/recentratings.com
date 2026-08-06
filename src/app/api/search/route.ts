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
    // Pull from recent_ratings (has time buckets) joined with restaurant info
    // Sort: 90d score desc (nulls last), then 365d, then alltime, then review count
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
      .range(offset, offset + limit - 1)

    if (state) rq = rq.eq('state', state.toUpperCase())

    const { data: ratedRows, error: rErr, count: rCount } = await rq
    if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 })

    // Enrich with photo/address/slug from restaurants table
    const slugs = (ratedRows || []).map((r: { restaurant_slug: string }) => r.restaurant_slug)
    let restaurantMap: Record<string, Record<string, unknown>> = {}
    if (slugs.length > 0) {
      const { data: rests } = await supabaseAdmin
        .from('restaurants')
        .select('slug,address,google_photo_url,google_price_level,yelp_rating,yelp_review_count,cuisine_type,google_rating,google_review_count')
        .in('slug', slugs)
      if (rests) {
        for (const r of rests) restaurantMap[r.slug] = r
      }
    }

    results = (ratedRows || []).map((r: Record<string, unknown>) => {
      const rest = restaurantMap[r.restaurant_slug as string] || {}
      return {
        id: r.restaurant_slug,
        slug: r.restaurant_slug,
        name: r.restaurant_name,
        city: r.city,
        state: r.state,
        address: rest.address,
        google_photo_url: rest.google_photo_url,
        google_price_level: rest.google_price_level,
        google_rating: rest.google_rating,
        google_review_count: rest.google_review_count || r.google_review_count,
        yelp_rating: rest.yelp_rating,
        yelp_review_count: rest.yelp_review_count,
        yelp_rating_alltime: r.yelp_rating_alltime,
        cuisine_type: rest.cuisine_type,
        google_rating_90d: r.google_rating_90d,
        google_rating_365d: r.google_rating_365d,
        google_rating_alltime: r.google_rating_alltime,
        google_review_count_90d: r.google_review_count_90d,
        google_review_count_365d: r.google_review_count_365d,
      }
    })
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
