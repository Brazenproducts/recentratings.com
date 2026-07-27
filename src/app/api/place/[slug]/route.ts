import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Get the restaurant
  const { data: place, error } = await supabaseAdmin
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !place) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Get recent_ratings data if it exists
  const { data: ratings } = await supabaseAdmin
    .from('recent_ratings')
    .select('*')
    .eq('restaurant_slug', slug)
    .single()

  // Get reviews from reviews_cache
  const { data: reviews } = await supabaseAdmin
    .from('reviews_cache')
    .select('*')
    .eq('place_id', place.google_place_id)
    .order('time', { ascending: false })
    .limit(20)

  return NextResponse.json({ place, ratings, reviews: reviews || [] })
}
