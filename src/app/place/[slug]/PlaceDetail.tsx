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
  time?: number
  created_at?: string
}

interface Props {
  place: Place
  ratings: Ratings | null
  reviews: Review[]
}

function ScoreCard({ label, score, reviewCount, highlight }: {
  label: string
  score?: number
  reviewCount?: number
  highlight?: boolean
}) {
  const color = !score ? 'bg-gray-50 border-gray-100' :
    score >= 4.5 ? 'bg-green-50 border-green-200' :
    score >= 4.0 ? 'bg-blue-50 border-blue-200' :
    score >= 3.5 ? 'bg-yellow-50 border-yellow-200' :
    'bg-red-50 border-red-200'

  const textColor = !score ? 'text-gray-400' :
    score >= 4.5 ? 'text-green-700' :
    score >= 4.0 ? 'text-blue-700' :
    score >= 3.5 ? 'text-yellow-700' :
    'text-red-700'

  return (
    <div className={`rounded-2xl border-2 p-4 text-center ${color} ${highlight ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      {score ? (
        <>
          <div className={`text-3xl font-black ${textColor}`}>★ {score.toFixed(1)}</div>
          {reviewCount !== undefined && (
            <div className="text-xs text-gray-400 mt-1">{reviewCount.toLocaleString()} reviews</div>
          )}
        </>
      ) : (
        <div className="text-2xl font-black text-gray-300">—</div>
      )}
    </div>
  )
}

function PriceLevel({ level }: { level?: number }) {
  if (!level) return null
  return <span className="text-green-600 font-semibold">{'$'.repeat(level)}{'<span class="opacity-30">$</span>'.repeat(4 - level)}</span>
}

export default function PlaceDetail({ place, ratings, reviews }: Props) {
  const timeAgo = (ts: number) => {
    const diff = Date.now() / 1000 - ts
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} days ago`
    if (diff < 86400 * 60) return `${Math.floor(diff / (86400 * 7))} weeks ago`
    if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} months ago`
    return `${Math.floor(diff / (86400 * 365))} years ago`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <a href="/search" className="text-sm text-gray-400 hover:text-blue-600 transition-colors mb-6 inline-block">← Back to search</a>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {place.google_photo_url && (
          <img
            src={place.google_photo_url}
            alt={place.name}
            className="w-full h-48 object-cover bg-gray-100"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{place.name}</h1>
              <p className="text-gray-500 mt-1">{place.address}, {place.city}, {place.state} {place.zip}</p>
              {place.cuisine_type && <p className="text-sm text-gray-400 mt-0.5">{place.cuisine_type}</p>}
            </div>
            {place.google_price_level && (
              <div className="text-lg font-bold text-green-600">{'$'.repeat(place.google_price_level)}</div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {place.phone && (
              <a href={`tel:${place.phone}`} className="text-sm text-blue-600 hover:underline font-medium">📞 {place.phone}</a>
            )}
            {place.website && (
              <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-medium">🌐 Website</a>
            )}
            {place.yelp_url && (
              <a href={place.yelp_url} target="_blank" rel="noopener noreferrer" className="text-sm text-red-500 hover:underline font-medium">Yelp →</a>
            )}
          </div>
        </div>
      </div>

      {/* Time-Filtered Ratings — THE MAIN THING */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-black text-gray-800 mb-1">Time-Filtered Ratings</h2>
        <p className="text-sm text-gray-400 mb-5">How this place has been rated across different time windows.</p>

        {ratings ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ScoreCard
              label="Last 90 Days"
              score={ratings.google_rating_90d}
              reviewCount={ratings.google_review_count_90d}
              highlight
            />
            <ScoreCard
              label="Last Year"
              score={ratings.google_rating_365d}
              reviewCount={ratings.google_review_count_365d}
            />
            <ScoreCard
              label="All Time"
              score={ratings.google_rating_alltime || place.google_rating}
              reviewCount={ratings.google_review_count || place.google_review_count}
            />
            {ratings.yelp_rating_alltime && (
              <ScoreCard
                label="Yelp All Time"
                score={ratings.yelp_rating_alltime}
                reviewCount={place.yelp_review_count}
              />
            )}
          </div>
        ) : (
          <div>
            {/* Show what we have from the base table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <ScoreCard
                label="Google Rating"
                score={place.google_rating}
                reviewCount={place.google_review_count}
                highlight
              />
              {place.yelp_rating && (
                <ScoreCard
                  label="Yelp Rating"
                  score={place.yelp_rating}
                  reviewCount={place.yelp_review_count}
                />
              )}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>⏳ Time-filtered data coming soon</strong> — we&apos;re processing {place.name}&apos;s review history to show 30-day, 90-day, and 1-year ratings. Check back soon.
            </div>
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-4">Recent Reviews</h2>
          <div className="flex flex-col gap-4">
            {reviews.map((review, i) => (
              <div key={review.id || i} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-700">{review.author_name || 'Anonymous'}</span>
                  {review.rating && (
                    <span className="text-amber-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  )}
                  {review.time && (
                    <span className="text-xs text-gray-400 ml-auto">{timeAgo(review.time)}</span>
                  )}
                </div>
                {review.text && (
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{review.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map link */}
      {place.lat && place.lng && (
        <div className="text-center">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            📍 View on Google Maps →
          </a>
        </div>
      )}
    </div>
  )
}
