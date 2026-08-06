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

  let query = supabaseAdmin
    .from('restaurants')
    .select('id,name,slug,address,city,state,google_rating,google_review_count,google_photo_url,google_price_level,yelp_rating,yelp_review_count,cuisine_type', { count: 'exact' })
    .not('google_rating', 'is', null)
    .order('google_review_count', { ascending: false })
    .range(offset, offset + limit - 1)

  if (effectiveQ) {
    query = query.ilike('name', `%${effectiveQ}%`)
  }
  if (effectiveCity) {
    query = query.ilike('city', `%${effectiveCity}%`)
  }
  if (state) {
    query = query.eq('state', state.toUpperCase())
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const places = data || []

  // Fetch time-bucketed ratings for all results in one query
  let ratingsMap: Record<string, { google_rating_90d?: number; google_rating_365d?: number; google_rating_alltime?: number; google_review_count_90d?: number; google_review_count_365d?: number; yelp_rating_alltime?: number }> = {}
  if (places.length > 0) {
    const slugs = places.map((p: { slug: string }) => p.slug)
    const { data: ratingsRows } = await supabaseAdmin
      .from('recent_ratings')
      .select('restaurant_slug,google_rating_90d,google_rating_365d,google_rating_alltime,google_review_count_90d,google_review_count_365d,yelp_rating_alltime')
      .in('restaurant_slug', slugs)
    if (ratingsRows) {
      for (const r of ratingsRows) {
        ratingsMap[r.restaurant_slug] = r
      }
    }
  }

  // Merge ratings into results
  const results = places.map((p: Record<string, unknown>) => ({
    ...p,
    ...( ratingsMap[p.slug as string] || {} ),
  }))

  return NextResponse.json({
    results,
    total: count || 0,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
    cityMode: effectiveCity && effectiveQ === '' && !city ? effectiveCity : undefined,
  })
}
