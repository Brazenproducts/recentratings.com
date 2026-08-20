/**
 * ON-THE-FLY BUSINESS LOOKUP
 * When a business isn't in our DB, look it up via Google Places API
 * and create a stub page instantly. Requires Google billing to be enabled.
 *
 * POST /api/search/lookup { name, city, state }
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function slugify(name: string, city: string, state: string): string {
  return [name, city, state]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(req: NextRequest) {
  const { name, city, state } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  // Check if we already have it
  const slug = slugify(name, city || '', state || '')
  const { data: existing } = await supabaseAdmin
    .from('restaurants')
    .select('id,name,slug,city,state,google_rating,google_review_count,google_place_id,is_approved')
    .eq('slug', slug)
    .maybeSingle()
  if (existing) return NextResponse.json({ result: existing, created: false })

  // Try Google Places Find Place API (needs billing enabled)
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Google API not configured' }, { status: 503 })

  const query = [name, city, state].filter(Boolean).join(' ')
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total,geometry&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK' || !data.candidates?.length) {
    return NextResponse.json({ error: 'Business not found', status: data.status }, { status: 404 })
  }

  const place = data.candidates[0]
  const parts = (place.formatted_address || '').split(',')
  const cityFromAddr = parts[1]?.trim() || city || ''
  const stateFromAddr = parts[2]?.trim().split(' ')[0] || state || ''
  const newSlug = slugify(place.name, cityFromAddr, stateFromAddr)

  // Create stub in restaurants table
  const { data: created, error } = await supabaseAdmin
    .from('restaurants')
    .insert({
      name: place.name,
      slug: newSlug,
      address: place.formatted_address || '',
      city: cityFromAddr,
      state: stateFromAddr,
      google_place_id: place.place_id,
      google_rating: place.rating || null,
      google_review_count: place.user_ratings_total || null,
      lat: place.geometry?.location?.lat || null,
      lng: place.geometry?.location?.lng || null,
      is_approved: true,
    })
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Submit to IndexNow + Google Indexing API immediately
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'
  const pageUrl = `${base}/place/${newSlug}`

  fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'recentratings.com',
      key: 'b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5',
      keyLocation: `${base}/b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5.txt`,
      urlList: [pageUrl],
    }),
  }).catch(() => {})

  // Google Indexing API handled by server-side priority cron

  return NextResponse.json({ result: created, created: true })
}
