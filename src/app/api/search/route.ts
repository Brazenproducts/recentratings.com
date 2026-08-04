import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const city = searchParams.get('city') || ''
  const state = searchParams.get('state') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('restaurants')
    .select('id,name,slug,address,city,state,google_rating,google_review_count,google_photo_url,google_price_level,yelp_rating,yelp_review_count,cuisine_type', { count: 'exact' })
    .not('google_rating', 'is', null)
    .order('google_review_count', { ascending: false })
    .range(offset, offset + limit - 1)

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }
  if (state) {
    query = query.eq('state', state.toUpperCase())
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    results: data || [],
    total: count || 0,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  })
}
