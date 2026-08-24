import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseServiceKey

// Server-side client (API routes) — uses service key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Client-side safe (uses anon key or service key for now)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
