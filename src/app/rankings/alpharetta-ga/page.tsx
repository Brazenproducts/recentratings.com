import { Metadata } from 'next'
import places from '@/data/alpharetta-ga.json'

export const metadata: Metadata = {
  title: 'Best Alpharetta, GA Reviews & Ratings | RecentRatings',
  description: 'Restaurants and businesses in Alpharetta, GA — reviews and ratings powered by RecentRatings. See verified buyer reviews and time-filtered scores.',
  openGraph: {
    title: 'Best Alpharetta, GA Reviews & Ratings | RecentRatings',
    description: 'Restaurants and businesses in Alpharetta, GA — verified reviews and time-filtered ratings.',
    url: 'https://recentratings.com/rankings/alpharetta-ga',
  }
}

export default function AlpharettaPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 8 }}>
          <a href="/rankings" style={{ color: '#2563eb', textDecoration: 'none' }}>Rankings</a> › Georgia
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          Alpharetta, GA — Reviews & Ratings
        </h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          {places.length}+ restaurants and businesses in Alpharetta, Georgia — rated and reviewed on RecentRatings.
          Ratings update daily from Google, Yelp, and verified buyer platforms.
        </p>
      </div>

      {/* Business CTA banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Own a business in Alpharetta?</div>
          <div style={{ fontSize: 13, color: '#bfdbfe' }}>Claim your page, connect your reviews, and dispute fake ratings.</div>
        </div>
        <a href="/for-businesses" style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 800, padding: '10px 22px', borderRadius: 10, textDecoration: 'none', fontSize: 14, whiteSpace: 'nowrap' }}>
          Claim Your Page →
        </a>
      </div>

      {/* Place list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {places.map((place, i) => (
          <a
            key={place.slug}
            href={`/place/${place.slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', textDecoration: 'none', transition: 'box-shadow 0.15s' }}
          >
            {/* Rank */}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: i < 3 ? '#1e40af' : '#f3f4f6', color: i < 3 ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
              {i + 1}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{place.name}</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                {place.category} · {place.address}
              </div>
            </div>

            {/* Ratings incoming */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', background: '#f9fafb', borderRadius: 8, padding: '4px 10px', border: '1px solid #e5e7eb' }}>
                Rating syncing...
              </div>
            </div>

            <div style={{ color: '#d1d5db', fontSize: 18 }}>›</div>
          </a>
        ))}
      </div>

      {/* Methodology */}
      <div style={{ marginTop: 40, padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>How RecentRatings works</h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
          RecentRatings aggregates reviews from Google, Yelp, and verified buyer platforms (Yotpo, Judge.me, Stamped)
          into a single, time-filtered score. Unlike Google&apos;s all-time average, we show how a business is rated
          <em> right now</em> — last 90 days, last year, and all-time. Ratings for Alpharetta, GA are syncing now.{' '}
          <a href="/for-businesses" style={{ color: '#2563eb', fontWeight: 600 }}>Business owners: claim your page →</a>
        </p>
      </div>

      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What are the best restaurants in Alpharetta, GA?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: `RecentRatings tracks ${places.length}+ restaurants in Alpharetta, GA. Ratings sync daily from Google, Yelp, and verified buyer platforms.`,
              },
            },
            {
              '@type': 'Question',
              name: 'How does RecentRatings rank businesses in Alpharetta?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'RecentRatings uses time-filtered ratings — showing scores for the last 90 days, last year, and all-time — so you can see how a business is performing right now, not just historically.',
              },
            },
          ],
        })}}
      />
    </div>
  )
}
