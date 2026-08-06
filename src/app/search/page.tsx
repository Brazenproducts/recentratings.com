'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Place {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  google_rating?: number
  google_review_count?: number
  google_photo_url?: string
  google_price_level?: number
  yelp_rating?: number
  yelp_review_count?: number
  cuisine_type?: string
  // Certified/featured status
  is_certified?: boolean
  is_featured?: boolean
  is_founding_member?: boolean
  preferred_timeframe?: '90d' | '365d' | 'alltime' | null
  // Time-bucketed scores from recent_ratings
  google_rating_90d?: number
  google_rating_365d?: number
  google_rating_alltime?: number
  google_review_count_90d?: number
  google_review_count_365d?: number
  yelp_rating_alltime?: number
}

function RatingPill({ value, label }: { value: number; label: string }) {
  const bg = value >= 4.5 ? '#dcfce7' : value >= 4.0 ? '#dbeafe' : value >= 3.5 ? '#fef9c3' : '#fee2e2'
  const color = value >= 4.5 ? '#166534' : value >= 4.0 ? '#1e40af' : value >= 3.5 ? '#854d0e' : '#991b1b'
  return (
    <span style={{ background: bg, color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      ★ {value.toFixed(1)} <span style={{ fontWeight: 400, opacity: 0.7 }}>{label}</span>
    </span>
  )
}

function PlaceCard({ place }: { place: Place }) {
  const isCertified = !!(place.is_certified || place.is_featured)
  const isFounder = !!place.is_founding_member

  // For certified places: show their preferred timeframe score prominently first
  const preferredScore = place.preferred_timeframe === '90d' ? place.google_rating_90d
    : place.preferred_timeframe === '365d' ? place.google_rating_365d
    : place.preferred_timeframe === 'alltime' ? (place.google_rating_alltime || place.google_rating)
    : null
  const preferredLabel = place.preferred_timeframe === '90d' ? `last 90 days · ${place.google_review_count_90d ?? ''}`
    : place.preferred_timeframe === '365d' ? `last year · ${place.google_review_count_365d ?? ''}`
    : place.preferred_timeframe === 'alltime' ? `all time · ${place.google_review_count?.toLocaleString() ?? ''}`
    : null

  return (
    <a href={`/place/${place.slug}`} style={{
      display: 'flex',
      gap: 16,
      background: isCertified ? '#f0f7ff' : '#fff',
      borderRadius: 14,
      border: isCertified ? '1.5px solid #93c5fd' : '1px solid #e5e7eb',
      padding: 16,
      textDecoration: 'none',
      color: 'inherit',
      transition: 'box-shadow 0.15s',
      boxShadow: isCertified ? '0 2px 8px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)')}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = isCertified ? '0 2px 8px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)')}
    >
      <div style={{
        width: 72, height: 72, borderRadius: 10, flexShrink: 0,
        background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, overflow: 'hidden',
      }}>
        {place.google_photo_url
          ? <img src={place.google_photo_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          : '🍽️'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</div>
          {isFounder && (
            <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>⭐ Founding</span>
          )}
          {isCertified && !isFounder && (
            <span style={{ fontSize: 11, fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>✓ Featured</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {place.address}, {place.city}, {place.state}
          {place.cuisine_type && ` · ${place.cuisine_type}`}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {/* Certified: preferred timeframe score shown first and prominently */}
          {isCertified && preferredScore && preferredLabel && (
            <RatingPill value={preferredScore} label={`★ ${preferredLabel.trim().replace(/·\s*$/, '')}`} />
          )}
          {/* Recent ratings — our differentiator (skip preferred timeframe to avoid dupe) */}
          {place.google_rating_90d && place.preferred_timeframe !== '90d' && (
            <RatingPill value={place.google_rating_90d} label={`90d${place.google_review_count_90d ? ` · ${place.google_review_count_90d}` : ''}`} />
          )}
          {place.google_rating_365d && place.preferred_timeframe !== '365d' && (
            <RatingPill value={place.google_rating_365d} label={`1yr${place.google_review_count_365d ? ` · ${place.google_review_count_365d}` : ''}`} />
          )}
          {(place.google_rating_alltime || place.google_rating) && place.preferred_timeframe !== 'alltime' && (
            <RatingPill
              value={(place.google_rating_alltime || place.google_rating)!}
              label={`all time${place.google_review_count ? ` · ${place.google_review_count.toLocaleString()}` : ''}`}
            />
          )}
          {(place.yelp_rating_alltime || place.yelp_rating) && (
            <RatingPill value={(place.yelp_rating_alltime || place.yelp_rating)!} label="Yelp" />
          )}
        </div>
      </div>
      <div style={{ color: '#d1d5db', alignSelf: 'center', fontSize: 18 }}>›</div>
    </a>
  )
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [results, setResults] = useState<Place[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (query: string, cityVal: string, pg: number) => {
    if (!query && !cityVal) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (cityVal) params.set('city', cityVal)
      params.set('page', String(pg))
      params.set('limit', '20')
      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setResults(data.results || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
      setPage(pg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initQ = searchParams.get('q') || ''
    const initCity = searchParams.get('city') || ''
    if (initQ || initCity) doSearch(initQ, initCity, 1)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    router.push(`/search?${params}`)
    doSearch(q, city, 1)
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 24 }}>Search Places</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Restaurant name..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '12px 16px', fontSize: 15, border: '1px solid #d1d5db', borderRadius: 10, outline: 'none', background: '#fff' }}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{ width: 140, padding: '12px 16px', fontSize: 15, border: '1px solid #d1d5db', borderRadius: 10, outline: 'none', background: '#fff' }}
        />
        <button type="submit" style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {loading && <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>Searching...</div>}

      {!loading && results.length > 0 && (
        <>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{total.toLocaleString()} results</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map(place => <PlaceCard key={place.id} place={place} />)}
          </div>
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 32 }}>
              {page > 1 && <button onClick={() => doSearch(q, city, page - 1)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}>← Prev</button>}
              <span style={{ fontSize: 14, color: '#6b7280' }}>Page {page} of {pages}</span>
              {page < pages && <button onClick={() => doSearch(q, city, page + 1)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}>Next →</button>}
            </div>
          )}
        </>
      )}

      {!loading && results.length === 0 && (q || city) && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p>No results. Try a different name or city.</p>
        </div>
      )}

      {!loading && !q && !city && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🍽️</div>
          <p>Enter a restaurant name or city to search 115,000+ places.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>}>
      <SearchPageInner />
    </Suspense>
  )
}
