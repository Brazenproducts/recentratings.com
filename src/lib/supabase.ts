import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization — prevents build-time crashes when env vars aren't available
// Vercel has these at runtime; local builds don't always have them
let _supabaseAdmin: SupabaseClient | null = null
let _supabase: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Supabase env vars not configured')
    _supabaseAdmin = createClient(url, key)
  }
  return _supabaseAdmin
}

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Supabase env vars not configured')
    _supabase = createClient(url, key)
  }
  return _supabase
}

// Backward-compatible exports — these are still module-level but won't crash
// because we use a Proxy that defers initialization until first access
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient]
  }
})

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient]
  }
})

export type TimeBucket = '30d' | '90d' | '180d' | '365d' | 'alltime'

export interface Place {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  zip?: string
  cuisine_type?: string
  phone?: string
  website?: string
  google_place_id?: string
  lat?: number
  lng?: number
  google_rating?: number
  google_review_count?: number
  google_photo_url?: string
  google_price_level?: number
  yelp_rating?: number
  yelp_review_count?: number
  yelp_url?: string
  is_featured?: boolean
}

export interface RecentRating {
  id: string
  restaurant_slug: string
  restaurant_name: string
  city: string
  state: string
  google_place_id?: string
  google_rating_alltime?: number
  google_rating_365d?: number
  google_rating_90d?: number
  google_review_count?: number
  google_review_count_90d?: number
  google_review_count_365d?: number
  yelp_rating_alltime?: number
  yelp_review_count?: number
  combined_score_90d?: number
  combined_score_365d?: number
  combined_score_alltime?: number
  fetched_at?: string
}
