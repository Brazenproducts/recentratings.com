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
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)',
        color: '#fff',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
            Ratings that actually<br />mean something.
          </h1>
          <p style={{ fontSize: 18, color: '#bfdbfe', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            See how a place is rated in the <strong style={{ color: '#fff' }}>last 30 days</strong>, not just their all-time average from 2018.
          </p>

          <form onSubmit={handleSearch} style={{
            background: '#fff',
            borderRadius: 16,
            padding: 12,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            maxWidth: 640,
            margin: '0 auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <input
              type="text"
              placeholder="Restaurant or place name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: 200,
                padding: '12px 16px',
                fontSize: 15,
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                outline: 'none',
                color: '#111827',
              }}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{
                width: 140,
                padding: '12px 16px',
                fontSize: 15,
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                outline: 'none',
                color: '#111827',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Search →
            </button>
          </form>
        </div>
      </section>

      {/* Why section */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 48 }}>
          Why time-filtered ratings?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { emoji: '📉', title: 'Restaurants coast on old reviews', desc: 'A place can have a 4.5★ all-time rating while quietly going downhill for the past year. Nobody notices.' },
            { emoji: '📈', title: 'New places get buried', desc: 'A great new restaurant with 50 recent 5★ reviews gets buried under a mediocre competitor with 2,000 old ones.' },
            { emoji: '🎯', title: 'Recent = relevant', desc: 'Management changes, chefs leave, quality dips. What happened last month matters more than what happened in 2019.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Time buckets */}
      <section style={{ background: '#fff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', marginBottom: 12 }}>Multiple time windows. One real picture.</h2>
          <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 28 }}>
            Every place shows ratings across multiple time periods — so you can see if they&apos;re trending up, down, or holding steady.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Last 30 Days', 'Last 6 Months', 'Last Year', 'All Time'].map(label => (
              <span key={label} style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 600,
                padding: '8px 20px',
                borderRadius: 100,
                fontSize: 14,
                border: '1px solid #bfdbfe',
              }}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', padding: '64px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#93c5fd', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>For Businesses</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>Your verified buyer reviews deserve to be seen.</h2>
          <p style={{ fontSize: 15, color: '#bfdbfe', marginBottom: 12, lineHeight: 1.7 }}>
            Fake Google reviews hurt real businesses. Your Yotpo, Judge.me, and Stamped reviews from actual customers sit hidden on your own site. We change that.
          </p>
          <p style={{ fontSize: 14, color: '#93c5fd', marginBottom: 32 }}>Used by Bartact — 812 verified buyer reviews · ★4.97 — see how verified reviews change the story.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/place/bartact-temecula-ca" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>See Live Demo →</a>
            <a href="/for-businesses" style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 800, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none' }}>Get Started Free →</a>
          </div>
        </div>
      </section>

      {/* Consumer CTA */}
      <section style={{ textAlign: 'center', padding: '64px 20px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', marginBottom: 12 }}>400,000+ places and growing daily.</h2>
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 28 }}>Search for any restaurant or business and see how it&apos;s actually rated right now — not years ago.</p>
        <a href="/search" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 12, textDecoration: 'none' }}>
          Start Searching →
        </a>
      </section>
    </div>
  )
}
