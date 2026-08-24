import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 3600 // Cache at CDN edge, rebuild every hour
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ city: string }>
}

function parseCitySlug(slug: string): { cityName: string; state: string; displayCity: string; displayState: string } {
  // e.g. "temecula-ca" -> "Temecula", "CA"
  const parts = slug.split('-')
  const state = parts[parts.length - 1].toUpperCase()
  const cityParts = parts.slice(0, -1)
  const cityName = cityParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
  return { cityName, state, displayCity: cityName, displayState: state }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const { displayCity, displayState } = parseCitySlug(city)
  const title = `Best ${displayCity}, ${displayState} Reviews & Ratings | RecentRatings`
  const desc = `See the top-rated restaurants in ${displayCity}, ${displayState} ranked by recent Google reviews. Scores updated weekly — see what's actually good right now, not years ago.`
  return {
    title: title.substring(0, 65),
    description: desc.substring(0, 160),
    openGraph: { title, description: desc, url: `https://recentratings.com/rankings/${city}` },
    alternates: { canonical: `https://recentratings.com/rankings/${city}` },
  }
}

export default async function RankingsPage({ params }: PageProps) {
  const { city } = await params
  const { cityName, state, displayCity, displayState } = parseCitySlug(city)

  // Query recent_ratings by city (46k rows, fast) then enrich from restaurants
  const { data: recentData } = await supabaseAdmin
    .from('recent_ratings')
    .select('restaurant_slug,restaurant_name,google_rating_90d,google_review_count_90d,google_rating_365d,google_review_count_365d,google_rating_alltime,google_review_count')
    .ilike('city', `%${cityName}%`)
    .ilike('state', `%${state}%`)
    .not('google_rating_alltime', 'is', null)
    .order('google_rating_90d', { ascending: false, nullsFirst: false })
    .limit(50)

  // Don't 404 — show empty state if no data for this city
  if (!recentData) notFound()

  // Enrich with restaurant details
  const slugs = recentData.map((r: Record<string, unknown>) => r.restaurant_slug as string)
  const { data: restData } = await supabaseAdmin
    .from('restaurants')
    .select('slug,address,cuisine_type,google_rating,google_review_count,is_certified')
    .in('slug', slugs)
  const restMap = new Map((restData || []).map((r: Record<string, unknown>) => [r.slug, r]))

  const places = recentData.map((r: Record<string, unknown>) => {
    const rest = (restMap.get(r.restaurant_slug as string) || {}) as Record<string, unknown>
    return { ...rest, ...r, name: r.restaurant_name, slug: r.restaurant_slug }
  })

  // Already sorted by 90d score
  type RankedPlace = Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = (places as any[]).slice(0, 25).map((p: any) => ({
    ...p,
    recent: { score_90d: p.google_rating_90d, count_90d: p.google_review_count_90d, score_365d: p.google_rating_365d, score_alltime: p.google_rating_alltime },
  }))

  if (!enriched.length) notFound()
  const topPlace = enriched[0]
  const avgRating = (enriched.reduce((s: number, p) => s + ((p.recent?.score_90d as number) || (p.recent?.score_alltime as number) || 0), 0) / enriched.length).toFixed(1)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best restaurant in ${displayCity}, ${displayState}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Based on recent Google reviews, ${(topPlace?.name as string)} is currently the top-rated restaurant in ${displayCity} with a ${(topPlace?.recent?.score_90d as number)?.toFixed(1) || (topPlace?.recent?.score_alltime as number)?.toFixed(1)} rating in the last 90 days.`,
        },
      },
      {
        '@type': 'Question',
        name: `How does RecentRatings rank restaurants in ${displayCity}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `RecentRatings ranks restaurants by their recent review scores — specifically their rating over the last 90 days. This shows you what's actually good right now, not just places coasting on old reviews from years ago.`,
        },
      },
      {
        '@type': 'Question',
        name: `How many restaurants are ranked in ${displayCity}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `RecentRatings tracks ${places.length}+ restaurants in ${displayCity}, ${displayState} with verified Google review data. This list shows the top 25 by recent rating.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            <a href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>RecentRatings</a> › {displayCity}, {displayState}
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#111827', margin: '0 0 12px', lineHeight: 1.2 }}>
            Best Restaurants in {displayCity}, {displayState}
          </h1>
          <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.6, maxWidth: 680 }}>
            Ranked by recent Google reviews — so you see what's actually good right now, not what was good years ago.
            The top restaurants in {displayCity} are ranked by their rating in the last 90 days.
            Average recent rating across the top {enriched.length} places: ★{avgRating}.
          </p>
        </div>

        {/* Rankings list */}
        <div style={{ marginBottom: 48 }}>
          {enriched.map((place, i) => {
            const score90d = place.recent?.score_90d
            const count90d = place.recent?.count_90d || 0
            const scoreAlltime = (place.recent?.score_alltime as number) || (place.recent?.score_90d as number) || 0
            return (
              <a
                key={place.slug as string}
                href={`/place/${place.slug}`}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
                  marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.15s',
                }}>
                  {/* Rank */}
                  <div style={{ fontSize: 22, fontWeight: 900, color: i < 3 ? '#2563eb' : '#9ca3af', minWidth: 36, textAlign: 'center' }}>
                    #{i + 1}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 2 }}>
                      {(place.name as string)}
                      {(place.is_certified as boolean) && <span style={{ marginLeft: 8, fontSize: 11, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>✓ Featured</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      {place.cuisine_type && <span>{place.cuisine_type} · </span>}
                      {place.address}
                    </div>
                  </div>
                  {/* Score */}
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    {score90d ? (
                      <>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#111827' }}>★{score90d.toFixed(1)}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{count90d} reviews · 90 days</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#111827' }}>★{scoreAlltime?.toFixed(1)}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>{((place.recent as Record<string,unknown>)?.count_alltime as number)?.toLocaleString()} reviews · all time</div>
                      </>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* About this list */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28, marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
            How We Rank Restaurants in {displayCity}
          </h2>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 12 }}>
            Most restaurant rankings use all-time averages — which means a place that was great in 2018 but has gone downhill
            still looks good on paper. RecentRatings ranks {displayCity} restaurants by their score in the <strong>last 90 days</strong>,
            giving you a real-time picture of where to eat today.
          </p>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
            Scores are calculated from verified Google reviews. Every place also shows its 1-year and all-time average
            so you can see whether a restaurant is trending up, holding steady, or declining. Click any restaurant to see
            its full rating breakdown across all time windows.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 20 }}>
            Frequently Asked Questions
          </h2>
          {faqSchema.mainEntity.map((qa, i) => (
            <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < faqSchema.mainEntity.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{qa.name}</h3>
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{qa.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>

        {/* Search CTA */}
        <div style={{ textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 28 }}>
          <p style={{ fontSize: 15, color: '#1d4ed8', fontWeight: 700, marginBottom: 8 }}>
            Looking for a specific place in {displayCity}?
          </p>
          <a href={`/search?city=${encodeURIComponent(cityName)}`} style={{
            display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700,
            fontSize: 14, padding: '10px 24px', borderRadius: 8, textDecoration: 'none',
          }}>
            Search all {displayCity} restaurants →
          </a>
        </div>
      </div>
    </>
  )
}
