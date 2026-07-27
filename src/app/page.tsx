'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city) params.set('city', city)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Ratings that actually mean something.
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl mb-8 max-w-xl mx-auto">
            See how a place is rated in the <strong className="text-white">last 30 days</strong>, not just their all-time average from 2018.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-xl max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Restaurant name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            <input
              type="text"
              placeholder="City (optional)"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="sm:w-44 px-4 py-3 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-base whitespace-nowrap"
            >
              Search →
            </button>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-center text-gray-800 mb-10">Why time-filtered ratings?</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              emoji: '📉',
              title: 'Restaurants coast on old reviews',
              desc: 'A place can have a 4.5★ all-time rating while quietly going downhill for the past year. Nobody notices.',
            },
            {
              emoji: '📈',
              title: 'New places get buried',
              desc: 'A great new restaurant with 50 recent 5★ reviews gets buried under a mediocre competitor with 2,000 old ones.',
            },
            {
              emoji: '🎯',
              title: 'Recent = relevant',
              desc: 'Management changes, chefs leave, quality dips. What happened last month matters more than what happened in 2019.',
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Time buckets explanation */}
      <section className="bg-white border-t border-b border-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-800 mb-3">Four time windows. One real picture.</h2>
          <p className="text-gray-500 mb-8">Every place shows ratings for all four time periods — so you can see if they're trending up, down, or staying steady.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Last 30 Days', 'Last 6 Months', 'Last Year', 'All Time'].map(label => (
              <span key={label} className="bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-full text-sm border border-blue-100">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-gray-800 mb-3">115,000+ places and growing daily.</h2>
        <p className="text-gray-500 mb-6">Search for any restaurant and see how it's actually doing right now.</p>
        <a
          href="/search"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg"
        >
          Start Searching →
        </a>
      </section>
    </div>
  )
}
