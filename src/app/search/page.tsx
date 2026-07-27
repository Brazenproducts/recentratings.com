'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating * 2) / 2
  return (
    <span className="text-amber-400 font-bold">
      {'★'.repeat(Math.floor(stars))}{'½'.includes(String(stars % 1)) ? '½' : ''}
      <span className="text-gray-300">{'★'.repeat(5 - Math.ceil(stars))}</span>
    </span>
  )
}

function RatingBadge({ value, label }: { value?: number; label: string }) {
  if (!value) return null
  const color = value >= 4.5 ? 'bg-green-100 text-green-800' : value >= 4.0 ? 'bg-blue-100 text-blue-800' : value >= 3.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      ★ {value.toFixed(1)} <span className="font-normal opacity-70">{label}</span>
    </span>
  )
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <a
      href={`/place/${place.slug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-4 flex gap-4 group"
    >
      {place.google_photo_url ? (
        <img
          src={place.google_photo_url}
          alt={place.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 text-2xl">
          🍽️
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{place.name}</h3>
        <p className="text-sm text-gray-500 truncate">{place.address}, {place.city}, {place.state}</p>
        {place.cuisine_type && (
          <p className="text-xs text-gray-400 mt-0.5">{place.cuisine_type}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {place.google_rating && (
            <RatingBadge value={place.google_rating} label={`Google · ${(place.google_review_count || 0).toLocaleString()} reviews`} />
          )}
          {place.yelp_rating && (
            <RatingBadge value={place.yelp_rating} label="Yelp" />
          )}
        </div>
      </div>
      <div className="flex-shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors self-center text-lg">→</div>
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
    if (initQ || initCity) {
      doSearch(initQ, initCity, 1)
    }
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-6">Search Places</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          placeholder="Restaurant name..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="sm:w-40 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="text-center py-12 text-gray-400">Searching...</div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">{total.toLocaleString()} results</p>
          <div className="flex flex-col gap-3">
            {results.map(place => <PlaceCard key={place.id} place={place} />)}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <button
                  onClick={() => doSearch(q, city, page - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
                >
                  ← Prev
                </button>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pages}</span>
              {page < pages && (
                <button
                  onClick={() => doSearch(q, city, page + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {!loading && results.length === 0 && (q || city) && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>No results found. Try a different name or city.</p>
        </div>
      )}

      {!loading && !q && !city && (
        <div className="text-center py-12 text-gray-300">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="text-gray-400">Enter a restaurant name or city to search 115,000+ places.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-400">Loading...</div>}>
      <SearchPageInner />
    </Suspense>
  )
}
