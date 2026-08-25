import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Returns null if env vars not configured (build time)
// Returns real client at runtime (Vercel has the vars)
function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function createAnonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Singleton instances
let _admin: SupabaseClient | null | undefined = undefined
let _anon: SupabaseClient | null | undefined = undefined

function getAdmin() {
  if (_admin === undefined) _admin = createAdminClient()
  return _admin
}

function getAnon() {
  if (_anon === undefined) _anon = createAnonClient()
  return _anon
}

// Null-safe Proxy — returns no-op functions when client unavailable (build time)
// At runtime on Vercel, the real client is used
const noopQuery = {
  select: () => noopQuery,
  eq: () => noopQuery,
  neq: () => noopQuery,
  ilike: () => noopQuery,
  in: () => noopQuery,
  not: () => noopQuery,
  or: () => noopQuery,
  order: () => noopQuery,
  limit: () => noopQuery,
  single: () => Promise.resolve({ data: null, error: null, count: null }),
  maybeSingle: () => Promise.resolve({ data: null, error: null, count: null }),
  then: (resolve: (v: unknown) => void) => Promise.resolve({ data: null, error: null, count: null }).then(resolve),
}

function makeProxy(getter: () => SupabaseClient | null): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_t, prop) {
      const client = getter()
      if (!client) {
        // Build time fallback — return no-op query builders
        if (prop === 'from') return () => noopQuery
        if (prop === 'auth') return { getSession: () => Promise.resolve({ data: { session: null } }) }
        return () => Promise.resolve({ data: null, error: null })
      }
      const val = (client as unknown as Record<string, unknown>)[prop as string]
      return typeof val === 'function' ? val.bind(client) : val
    }
  })
}

export const supabaseAdmin = makeProxy(getAdmin)
export const supabase = makeProxy(getAnon)

export type TimeBucket = '30d' | '90d' | '180d' | '365d' | 'alltime'

export interface Place {
  id: string; name: string; slug: string; address: string; city: string; state: string
  zip?: string; cuisine_type?: string; phone?: string; website?: string; google_place_id?: string
  lat?: number; lng?: number; google_rating?: number; google_review_count?: number
  google_photo_url?: string; google_price_level?: number; yelp_rating?: number
  yelp_review_count?: number; yelp_url?: string; is_featured?: boolean
}

export interface RecentRating {
  id: string; restaurant_slug: string; restaurant_name: string; city: string; state: string
  google_place_id?: string; google_rating_alltime?: number; google_rating_365d?: number
  google_rating_90d?: number; google_review_count?: number; google_review_count_90d?: number
  google_review_count_365d?: number; yelp_rating_alltime?: number; yelp_review_count?: number
  combined_score_90d?: number; combined_score_365d?: number; combined_score_alltime?: number
  fetched_at?: string
}
