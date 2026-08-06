import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import PlaceDetail from './PlaceDetail'

interface Props {
  params: Promise<{ slug: string }>
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function starLabel(score: number): string {
  if (score >= 4.5) return 'Excellent'
  if (score >= 4.0) return 'Very Good'
  if (score >= 3.5) return 'Good'
  if (score >= 3.0) return 'Average'
  return 'Below Average'
}

// Build LocalBusiness + AggregateRating JSON-LD schema
// Our unique angle: time-bucketed scores surfaced as separate ratingValue entries
function buildJsonLd(place: Record<string, unknown>, ratings: Record<string, unknown> | null) {
  const name = place.name as string
  const address = place.address as string
  const city = place.city as string
  const state = place.state as string
  const zip = (place.zip as string) || ''
  const slug = place.slug as string
  const phone = place.phone as string | undefined
  const website = place.website as string | undefined
  const lat = place.lat as number | undefined
  const lng = place.lng as number | undefined
  const photoUrl = place.google_photo_url as string | undefined

  // Best available score: prefer 90d (most recent), fall back to 365d, then alltime/google_rating
  const score90d = ratings?.google_rating_90d as number | undefined
  const score365d = ratings?.google_rating_365d as number | undefined
  const scoreAlltime = (ratings?.google_rating_alltime ?? place.google_rating) as number | undefined
  const count90d = ratings?.google_review_count_90d as number | undefined
  const count365d = ratings?.google_review_count_365d as number | undefined
  const countAlltime = (ratings?.google_review_count ?? place.google_review_count) as number | undefined

  // Primary AggregateRating: most recent data available
  const primaryScore = score90d ?? score365d ?? scoreAlltime
  const primaryCount = (score90d ? count90d : score365d ? count365d : countAlltime) ?? 1
  const primaryWindow = score90d ? 'last 90 days' : score365d ? 'last year' : 'all time'

  if (!primaryScore) return null

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      postalCode: zip,
      addressCountry: 'US',
    },
    url: `https://recentratings.com/place/${slug}`,
    // Primary AggregateRating — most recent time window available
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: primaryScore.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: primaryCount,
      // Human-readable label that makes our time-bucket angle clear in rich results
      description: `${primaryScore.toFixed(1)} stars (${primaryWindow}) — ${starLabel(primaryScore)}`,
    },
  }

  // Optional fields
  if (phone) schema.telephone = phone
  if (website) schema.sameAs = website
  if (photoUrl) schema.image = photoUrl
  if (lat && lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    }
  }

  // Build a Review node for each time window we have data for
  // This lets Google index our time-bucket differentiation
  const reviews: Record<string, unknown>[] = []

  if (score90d && count90d) {
    reviews.push({
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'RecentRatings' },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: score90d.toFixed(1),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: `Based on ${count90d} Google reviews in the last 90 days, ${name} averages ${score90d.toFixed(1)} stars — ${starLabel(score90d)}.`,
      datePublished: new Date().toISOString().split('T')[0],
      publisher: { '@type': 'Organization', name: 'RecentRatings', url: 'https://recentratings.com' },
    })
  }

  if (score365d && count365d) {
    reviews.push({
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'RecentRatings' },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: score365d.toFixed(1),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: `Based on ${count365d} Google reviews in the last 12 months, ${name} averages ${score365d.toFixed(1)} stars — ${starLabel(score365d)}.`,
      datePublished: new Date().toISOString().split('T')[0],
      publisher: { '@type': 'Organization', name: 'RecentRatings', url: 'https://recentratings.com' },
    })
  }

  if (scoreAlltime && countAlltime) {
    reviews.push({
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'RecentRatings' },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: scoreAlltime.toFixed(1),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: `Based on ${countAlltime.toLocaleString()} Google reviews all time, ${name} averages ${scoreAlltime.toFixed(1)} stars — ${starLabel(scoreAlltime)}.`,
      datePublished: new Date().toISOString().split('T')[0],
      publisher: { '@type': 'Organization', name: 'RecentRatings', url: 'https://recentratings.com' },
    })
  }

  if (reviews.length > 0) schema.review = reviews

  return schema
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: place } = await supabaseAdmin
    .from('restaurants')
    .select('name, city, state, google_rating, google_review_count')
    .eq('slug', slug)
    .single()

  if (!place) return { title: 'Place Not Found — RecentRatings' }

  const { data: ratings } = await supabaseAdmin
    .from('recent_ratings')
    .select('google_rating_90d, google_rating_365d, google_rating_alltime, google_review_count_90d')
    .eq('restaurant_slug', slug)
    .single()

  // Pick best available score for meta description
  const score90d = ratings?.google_rating_90d
  const score365d = ratings?.google_rating_365d
  const scoreAlltime = ratings?.google_rating_alltime ?? place.google_rating
  const count90d = ratings?.google_review_count_90d

  let descScore = ''
  if (score90d) {
    descScore = `★${score90d.toFixed(1)} in the last 90 days`
    if (count90d) descScore += ` (${count90d} reviews)`
    descScore += '. '
  } else if (score365d) {
    descScore = `★${score365d.toFixed(1)} over the last year. `
  } else if (scoreAlltime) {
    descScore = `★${scoreAlltime.toFixed(1)} all-time. `
  }

  // Title: keyword-first per SEO playbook
  const title = `${place.name} Ratings — ${place.city}, ${place.state} | RecentRatings`
  const description = `${descScore}See time-filtered ratings for ${place.name} in ${place.city}, ${place.state} — 90-day, 1-year, and all-time scores so you know how it's rated right now.`

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: `https://recentratings.com/place/${slug}`,
      siteName: 'RecentRatings',
      type: 'website',
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PlacePage({ params }: Props) {
  const { slug } = await params
  const { data: place } = await supabaseAdmin
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!place) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🤷</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Place not found</h1>
        <p className="text-gray-500 mb-6">We couldn&apos;t find that place. Try searching again.</p>
        <a href="/search" className="text-blue-600 font-semibold hover:underline">← Back to Search</a>
      </div>
    )
  }

  const { data: ratings } = await supabaseAdmin
    .from('recent_ratings')
    .select('*')
    .eq('restaurant_slug', slug)
    .single()

  const { data: reviews } = await supabaseAdmin
    .from('reviews_cache')
    .select('*')
    .eq('place_id', place.google_place_id)
    .order('time', { ascending: false })
    .limit(10)

  const jsonLd = buildJsonLd(place, ratings)

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PlaceDetail place={place} ratings={ratings} reviews={reviews || []} />
    </>
  )
}
