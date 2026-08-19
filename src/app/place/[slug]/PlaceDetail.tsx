'use client'

interface Place {
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
  hours?: Record<string, string>
  has_dine_in?: boolean
  has_takeout?: boolean
  has_drive_thru?: boolean
  has_outdoor_seating?: boolean
  restaurant_type?: string
  venue_type?: string
  tipping_policy?: string
}

interface Ratings {
  google_rating_alltime?: number
  google_rating_365d?: number
  google_rating_90d?: number
  google_review_count?: number
  google_review_count_90d?: number
  google_review_count_365d?: number
  yelp_rating_alltime?: number
  combined_score_90d?: number
  combined_score_365d?: number
  combined_score_alltime?: number
}

interface Review {
  id?: string
  author_name?: string
  rating?: number
  text?: string
  time_published?: string
  created_at?: string
  source?: string
}

interface NearbyPlace {
  name: string
  slug: string
  city: string
  state: string
  google_rating?: number
  google_rating_90d?: number
  cuisine_type?: string
}

interface Props {
  place: Place
  ratings: Ratings | null
  reviews: Review[]
  cityAvg90d?: number | null
  cityAvgAlltime?: number | null
  nearbyPlaces?: NearbyPlace[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function scoreLabel(score: number): string {
  if (score >= 4.7) return 'Exceptional'
  if (score >= 4.5) return 'Excellent'
  if (score >= 4.2) return 'Very Good'
  if (score >= 4.0) return 'Good'
  if (score >= 3.5) return 'Average'
  if (score >= 3.0) return 'Below Average'
  return 'Poor'
}

function trendLabel(score90d?: number, scoreAlltime?: number): { label: string; color: string; arrow: string } | null {
  if (!score90d || !scoreAlltime) return null
  const diff = score90d - scoreAlltime
  if (diff >= 0.3) return { label: `Trending up ${diff.toFixed(1)} pts above all-time average`, color: '#166534', arrow: '↑' }
  if (diff <= -0.3) return { label: `Trending down ${Math.abs(diff).toFixed(1)} pts below all-time average`, color: '#991b1b', arrow: '↓' }
  return { label: 'Consistent with all-time average', color: '#1e40af', arrow: '→' }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return iso }
}

function monthsAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 14) return `${days} days ago`
    if (days < 60) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`
  } catch { return '' }
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreCard({ label, score, reviewCount, highlight }: {
  label: string; score?: number; reviewCount?: number; highlight?: boolean
}) {
  const color = !score ? '#f9fafb' :
    score >= 4.5 ? '#f0fdf4' : score >= 4.0 ? '#eff6ff' :
    score >= 3.5 ? '#fefce8' : '#fef2f2'
  const border = !score ? '#e5e7eb' :
    score >= 4.5 ? '#bbf7d0' : score >= 4.0 ? '#bfdbfe' :
    score >= 3.5 ? '#fde68a' : '#fecaca'
  const textColor = !score ? '#9ca3af' :
    score >= 4.5 ? '#166534' : score >= 4.0 ? '#1e40af' :
    score >= 3.5 ? '#854d0e' : '#991b1b'

  return (
    <div style={{
      background: color, border: `2px solid ${border}`,
      borderRadius: 16, padding: '16px 12px', textAlign: 'center',
      outline: highlight ? '2px solid #60a5fa' : 'none',
      outlineOffset: 2,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      {score ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 900, color: textColor }}>★ {score.toFixed(1)}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: textColor, marginTop: 2 }}>{scoreLabel(score)}</div>
          {reviewCount !== undefined && (
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''}</div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 22, fontWeight: 900, color: '#d1d5db' }}>—</div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlaceDetail({ place, ratings, reviews, cityAvg90d, cityAvgAlltime, nearbyPlaces = [] }: Props) {
  const alltime = ratings?.google_rating_alltime ?? place.google_rating
  const score90d = ratings?.google_rating_90d
  const score365d = ratings?.google_rating_365d
  const count90d = ratings?.google_review_count_90d
  const count365d = ratings?.google_review_count_365d
  const countAll = ratings?.google_review_count ?? place.google_review_count
  const trend = trendLabel(score90d, alltime)
  const priceSymbol = place.google_price_level ? '$'.repeat(place.google_price_level) : null

  const vs90d = score90d && cityAvg90d
    ? score90d > cityAvg90d ? `${(score90d - cityAvg90d).toFixed(1)} points above` : score90d < cityAvg90d ? `${(cityAvg90d - score90d).toFixed(1)} points below` : 'exactly at'
    : null
  const vsAll = alltime && cityAvgAlltime
    ? alltime > cityAvgAlltime ? `${(alltime - cityAvgAlltime).toFixed(1)} points above` : alltime < cityAvgAlltime ? `${(cityAvgAlltime - alltime).toFixed(1)} points below` : 'exactly at'
    : null

  const hoursEntries = place.hours
    ? DAY_ORDER.filter(d => place.hours![d]).map(d => ({ day: DAY_LABELS[d], hours: place.hours![d] }))
    : []

  const features: string[] = []
  if (place.has_dine_in) features.push('Dine-in')
  if (place.has_takeout) features.push('Takeout')
  if (place.has_drive_thru) features.push('Drive-thru')
  if (place.has_outdoor_seating) features.push('Outdoor seating')

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px 48px' }}>

      {/* Back */}
      <a href="/search" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← Back to search</a>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20 }}>
        {place.google_photo_url && (
          <img src={place.google_photo_url} alt={`${place.name} — ${place.city}, ${place.state}`}
            style={{ width: '100%', height: 220, objectFit: 'cover', background: '#f3f4f6', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        )}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: 0 }}>{place.name}</h1>
              <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 14 }}>
                {place.address}, {place.city}, {place.state} {place.zip}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {place.cuisine_type && (
                  <span style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{place.cuisine_type}</span>
                )}
                {priceSymbol && (
                  <span style={{ fontSize: 12, background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{priceSymbol}</span>
                )}
                {features.map(f => (
                  <span key={f} style={{ fontSize: 12, background: '#eff6ff', color: '#1e40af', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{f}</span>
                ))}
              </div>
            </div>
            {alltime && (
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: alltime >= 4.5 ? '#166534' : alltime >= 4.0 ? '#1e40af' : '#854d0e' }}>★ {alltime.toFixed(1)}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{countAll?.toLocaleString()} reviews</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {place.phone && (
              <a href={`tel:${place.phone}`} style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>📞 {place.phone}</a>
            )}
            {place.website && (
              <a href={place.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>🌐 Website</a>
            )}
            {place.yelp_url && (
              <a href={place.yelp_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Yelp →</a>
            )}
            {place.lat && place.lng && (
              <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>📍 Directions</a>
            )}
          </div>
        </div>
      </div>

      {/* ── TIME-FILTERED RATINGS ─────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>Time-Filtered Ratings</h2>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>
          How {place.name} has been rated across different time windows — so you can see whether it&apos;s getting better, worse, or staying consistent.
        </p>

        {ratings ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
              <ScoreCard label="Last 90 Days" score={score90d} reviewCount={count90d} highlight />
              <ScoreCard label="Last Year" score={score365d} reviewCount={count365d} />
              <ScoreCard label="All Time" score={alltime} reviewCount={countAll} />
              {ratings.yelp_rating_alltime && (
                <ScoreCard label="Yelp All Time" score={ratings.yelp_rating_alltime} reviewCount={place.yelp_review_count} />
              )}
            </div>

            {trend && (
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: trend.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{trend.arrow}</span>
                <span>{place.name} is {trend.label}</span>
              </div>
            )}
          </>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
              <ScoreCard label="Google Rating" score={place.google_rating} reviewCount={place.google_review_count} highlight />
              {place.yelp_rating && <ScoreCard label="Yelp Rating" score={place.yelp_rating} reviewCount={place.yelp_review_count} />}
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#92400e' }}>
              ⏳ <strong>Time-filtered data coming soon</strong> — we&apos;re processing {place.name}&apos;s full review history to show 90-day, 1-year, and all-time breakdowns.
            </div>
          </div>
        )}
      </div>

      {/* ── WHAT THESE SCORES MEAN ────────────────────────────────────────── */}
      {ratings && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 16px' }}>What These Scores Mean</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {score90d && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e40af', margin: '0 0 6px' }}>Last 90 Days: ★ {score90d.toFixed(1)} — {scoreLabel(score90d)}</h3>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                  Based on {count90d?.toLocaleString() ?? 'recent'} Google reviews submitted in the last 90 days,
                  {' '}{place.name} is currently averaging {score90d.toFixed(1)} out of 5 stars.
                  {vs90d && cityAvg90d && ` This is ${vs90d} the ${place.city} city average of ★${cityAvg90d.toFixed(1)} for the same period.`}
                  {' '}The 90-day score is the most accurate signal of what a current visit is likely to be like —
                  it reflects recent staffing, management, and quality more than any longer window.
                </p>
              </div>
            )}

            {score365d && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#374151', margin: '0 0 6px' }}>Last Year: ★ {score365d.toFixed(1)} — {scoreLabel(score365d)}</h3>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                  Across {count365d?.toLocaleString() ?? 'all'} reviews over the past 12 months,
                  {' '}{place.name} holds a {score365d.toFixed(1)}-star average.
                  {score90d && score365d && Math.abs(score90d - score365d) >= 0.2 && (
                    score90d > score365d
                      ? ` The recent 90-day score of ★${score90d.toFixed(1)} is higher than the 1-year average, suggesting the experience has improved recently.`
                      : ` The recent 90-day score of ★${score90d.toFixed(1)} is lower than the 1-year average — worth keeping in mind for a current visit.`
                  )}
                  {' '}A full year of reviews smooths out seasonal swings and gives a broader picture of consistency.
                </p>
              </div>
            )}

            {alltime && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#374151', margin: '0 0 6px' }}>All Time: ★ {alltime.toFixed(1)} — {scoreLabel(alltime)}</h3>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                  {place.name}&apos;s all-time Google rating of {alltime.toFixed(1)} stars is based on
                  {' '}{countAll?.toLocaleString() ?? 'all'} total reviews since the business opened.
                  {vsAll && cityAvgAlltime && ` This is ${vsAll} the ${place.city} city average of ★${cityAvgAlltime.toFixed(1)} across all tracked restaurants.`}
                  {' '}While the all-time score provides historical context, it can reflect conditions from years ago.
                  RecentRatings recommends weighting the 90-day score more heavily when deciding whether to visit.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RECENT REVIEWS ────────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 16px' }}>Customer Reviews</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {reviews.map((review, i) => {
              const isYotpo = review.source === 'yotpo' || review.source === 'judgeme'
              const isGoogle = !isYotpo
              return (
              <div key={review.id || i} style={{ borderBottom: i < reviews.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: i < reviews.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{review.author_name || 'Anonymous'}</span>
                  {review.rating && (
                    <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  )}
                  {isYotpo && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', background: '#dcfce7', borderRadius: 6, padding: '2px 7px', letterSpacing: 0.3 }}>✓ Verified Buyer</span>
                  )}
                  {isGoogle && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', borderRadius: 6, padding: '2px 7px' }}>Google</span>
                  )}
                  {review.time_published && (
                    <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>{monthsAgo(review.time_published)}</span>
                  )}
                </div>
                {review.text && (
                  <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>{review.text}</p>
                )}
              </div>
            )})}
          </div>
        </div>
      )}

      {/* ── HOURS ─────────────────────────────────────────────────────────── */}
      {hoursEntries.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 16px' }}>Hours of Operation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {hoursEntries.map(({ day, hours }) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                <span style={{ color: '#374151', fontWeight: 600 }}>{day}</span>
                <span style={{ color: '#6b7280' }}>{hours}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '12px 0 0' }}>Hours may vary. Call ahead or check Google Maps to confirm.</p>
        </div>
      )}

      {/* ── HOW WE CALCULATE RATINGS ──────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>How RecentRatings Calculates Scores</h2>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, margin: '0 0 12px' }}>
          Unlike Google, Yelp, and TripAdvisor — which show a single all-time average — RecentRatings splits every place&apos;s review history
          into three separate time windows: the last 90 days, the last year, and all time. Each window is calculated independently
          using the actual timestamps of submitted Google reviews.
        </p>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, margin: '0 0 12px' }}>
          This matters because restaurants change. Ownership changes. Chefs leave. Renovations happen. A place that was a 3.8 five years ago
          might be a 4.8 today — but that history drags the all-time average down and makes it look worse than it actually is right now.
          Conversely, a formerly great spot with a 4.7 all-time score might have dropped to a 3.9 in the last 90 days.
          RecentRatings surfaces both truths at the same time.
        </p>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, margin: 0 }}>
          All review data is sourced from Google. RecentRatings does not write, edit, or moderate reviews.
          We only organize the timestamps and present the data in a more useful format.
        </p>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 20px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {score90d && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
                Is {place.name} good right now?
              </h3>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                Based on the most recent {count90d ?? 'available'} Google reviews from the last 90 days,
                {' '}{place.name} is rated ★{score90d.toFixed(1)} — which is {scoreLabel(score90d).toLowerCase()}.
                {vs90d && cityAvg90d ? ` That puts it ${vs90d} the ${place.city} average of ★${cityAvg90d.toFixed(1)}.` : ''}
              </p>
            </div>
          )}

          {alltime && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
                What is {place.name}&apos;s overall Google rating?
              </h3>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                {place.name} has an all-time Google rating of ★{alltime.toFixed(1)} based on {countAll?.toLocaleString() ?? 'many'} total reviews.
                {' '}This is the cumulative average across all reviews ever submitted.
              </p>
            </div>
          )}

          {score90d && score365d && Math.abs(score90d - score365d) >= 0.1 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
                Is {place.name} getting better or worse?
              </h3>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                {score90d > score365d
                  ? `${place.name} appears to be improving. The 90-day score of ★${score90d.toFixed(1)} is higher than the 1-year average of ★${score365d.toFixed(1)}, suggesting recent experiences have been better than the longer-term trend.`
                  : score90d < score365d
                  ? `${place.name}'s recent scores are slightly lower than its 1-year average. The last 90 days show ★${score90d.toFixed(1)} versus ★${score365d.toFixed(1)} for the past year. This could reflect a temporary dip or an ongoing trend — check the individual reviews for more context.`
                  : `${place.name} has been very consistent. The 90-day score of ★${score90d.toFixed(1)} closely matches its 1-year average of ★${score365d.toFixed(1)}.`
                }
              </p>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
              Where is {place.name} located?
            </h3>
            <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
              {place.name} is located at {place.address}, {place.city}, {place.state} {place.zip ?? ''}.
              {place.phone ? ` You can reach them by phone at ${place.phone}.` : ''}
              {place.lat && place.lng ? ' Use the directions link above to get turn-by-turn navigation.' : ''}
            </p>
          </div>

          {hoursEntries.length > 0 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
                What are {place.name}&apos;s hours?
              </h3>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                {place.name}&apos;s listed hours are:{' '}
                {hoursEntries.map(({ day, hours }) => `${day}: ${hours}`).join(', ')}.
                {' '}Hours may vary on holidays. Always call ahead or check Google Maps to confirm current hours before visiting.
              </p>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
              How does RecentRatings differ from Google or Yelp?
            </h3>
            <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>
              Google and Yelp show a single all-time average that can be years old. RecentRatings breaks that history into
              three time windows — 90 days, 1 year, and all time — so you can see whether a place is currently good or just has
              a strong legacy score. This makes a meaningful difference when a restaurant has changed ownership, management, or quality recently.
            </p>
          </div>

        </div>
      </div>

      {/* ── NEARBY PLACES ─────────────────────────────────────────────────── */}
      {nearbyPlaces.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>
            More {place.cuisine_type || 'Restaurants'} in {place.city}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px' }}>
            Other highly-rated places in {place.city}, {place.state} — sorted by recent score.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {nearbyPlaces.map(p => (
              <a key={p.slug} href={`/place/${p.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9fafb', borderRadius: 12, textDecoration: 'none', border: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{p.cuisine_type || 'Restaurant'} · {p.city}, {p.state}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {p.google_rating_90d && (
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>★ {p.google_rating_90d.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>90d</span></div>
                  )}
                  {p.google_rating && (
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>★ {p.google_rating.toFixed(1)} all time</div>
                  )}
                </div>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href={`/search?q=${encodeURIComponent(place.city)}`} style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              View all restaurants in {place.city} →
            </a>
          </div>
        </div>
      )}

      {/* ── LEAVE A REVIEW CTA ──────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', borderRadius: 18, padding: 28, textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px', color: '#fff' }}>Have you visited {place.name}?</h2>
        <p style={{ fontSize: 14, color: '#bfdbfe', margin: '0 0 20px', lineHeight: 1.6 }}>
          Your honest review helps others make great decisions — and helps {place.name} earn the recognition they deserve.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {place.google_place_id && (
            <a
              href={`https://search.google.com/local/writereview?placeid=${place.google_place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1e40af', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              ⭐ Write a Google Review
            </a>
          )}
          {place.yelp_url && (
            <a
              href={place.yelp_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#d32323', color: '#fff', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              🍽 Write a Yelp Review
            </a>
          )}
          {!place.google_place_id && !place.yelp_url && (
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + place.city + ' ' + place.state)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1e40af', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              ⭐ Find on Google Maps
            </a>
          )}
        </div>
      </div>

      {/* ── ABOUT RECENTRATINGS ───────────────────────────────────────────── */}
      <div style={{ background: '#eff6ff', borderRadius: 18, border: '1px solid #bfdbfe', padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: '#1e40af', margin: '0 0 10px' }}>About RecentRatings</h2>
        <p style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.7, margin: 0 }}>
          RecentRatings tracks restaurant ratings across three time windows — last 90 days, last year, and all time —
          so you always know whether a place is good <em>right now</em>, not just historically.
          We cover restaurants across the United States.
          {' '}<a href="/search" style={{ color: '#1d4ed8', fontWeight: 700 }}>Search restaurants near you →</a>
        </p>
      </div>

    </div>
  )
}
