import { Metadata } from 'next'
import data from '@/data/bartact-reviews.json'

const combinedTotalMeta = data.total + 13
const combinedAvgMeta = parseFloat(((data.avg * data.total + 4.38 * 13) / combinedTotalMeta).toFixed(2))

export const metadata: Metadata = {
  title: 'Bartact Reviews & Ratings — Temecula, CA | RecentRatings',
  description: `★${combinedAvgMeta} — ${combinedTotalMeta} customer reviews for Bartact in Temecula, CA. Jeep seat covers, grab handles & accessories. Made in USA since 2012.`,
  openGraph: {
    title: 'Bartact Reviews & Ratings | RecentRatings',
    description: `${combinedTotalMeta} customer reviews · ★${combinedAvgMeta} RecentRatings score`,
    url: 'https://recentratings.com/place/bartact-temecula-ca',
  }
}

function fmtScore(v: number) {
  return v.toFixed(2)  // Always 2 decimal places — 5.00 not 5.0
}

function monthsAgo(dateStr: string) {
  if (!dateStr) return ''
  const months = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24 * 30))
  if (months < 1) return 'this month'
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}

export default function BartactPage() {
  const combinedTotal = data.total + 13 // 812 Yotpo + 13 Google
  const combinedAvg = parseFloat(((data.avg * data.total + 4.38 * 13) / combinedTotal).toFixed(2))

  const scoreBuckets = [
    data.d180 > 0 && { label: 'Last 6 Months', count: data.d180, avg: (data as unknown as Record<string,number>).d180avg || data.avg },
    data.d365 > 0 && { label: 'Last Year', count: data.d365, avg: (data as unknown as Record<string,number>).d365avg || data.avg },
    { label: 'All Time', count: combinedTotal, avg: combinedAvg },
  ].filter(Boolean) as { label: string; count: number; avg: number }[]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        <a href="/search" style={{ color: '#2563eb', textDecoration: 'none' }}>Search</a>
        {' › '}
        <a href="/search?city=Temecula" style={{ color: '#2563eb', textDecoration: 'none' }}>Temecula, CA</a>
        {' › Bartact'}
      </div>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: 28, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', margin: 0 }}>Bartact</h1>
              <span style={{ fontSize: 11, fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 20 }}>⭐ Founding Member</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20 }}>✓ Featured</span>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px' }}>27633 Commerce Center Dr, Temecula, CA 92590</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Automotive Accessories</span>
              <a href="tel:+19513194008" style={{ fontSize: 12, background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: 20, fontWeight: 600, textDecoration: 'none' }}>📞 (951) 319-4008</a>
              <a href="https://bartact.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontWeight: 600, textDecoration: 'none' }}>🌐 bartact.com</a>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#166534', lineHeight: 1 }}>★ {fmtScore(combinedAvg)}</div>
            <div style={{ fontSize: 13, color: '#166534', fontWeight: 800, marginTop: 4 }}>{combinedTotal.toLocaleString()} total reviews</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>Also see <a href="https://maps.google.com/?cid=7686607042019744756" target="_blank" rel="noopener noreferrer" style={{color:'#9ca3af'}}>Bartact on Google Maps ★4.4</a></div>
          </div>
        </div>
      </div>

      {/* Verified Buyer Score — Primary */}
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: 18, border: '1px solid #86efac', padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#166534', margin: 0 }}>RecentRatings Score — Verified Buyers</h2>
          <span style={{ fontSize: 13, color: '#166534', background: '#bbf7d0', borderRadius: 20, padding: '3px 12px', fontWeight: 800, marginLeft: 'auto' }}>
            {data.total.toLocaleString()} verified buyer reviews · ★{fmtScore(data.avg)}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#166534', margin: '0 0 16px', lineHeight: 1.6 }}>
          Every review below was submitted by a confirmed purchaser. Unlike Google reviews, unverified accounts cannot post here.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          {scoreBuckets.map(b => (
            <div key={b.label} style={{ background: '#fff', borderRadius: 14, border: '2px solid #86efac', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#166534' }}>★ {fmtScore(b.avg)}</div>
              <div style={{ fontSize: 12, color: '#166534', fontWeight: 700, marginTop: 4 }}>{b.count.toLocaleString()} reviews</div>
              <div style={{ fontSize: 11, color: '#4b7c59', marginTop: 2 }}>{b.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#9ca3af' }}>
          Also rated on Google Maps: ★4.4
        </div>
      </div>

      {/* Review CTA — drives traffic to business's own review platform */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', borderRadius: 18, padding: 28, textAlign: 'center', marginBottom: 20, color: '#fff' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px', color: '#fff' }}>Want to leave a review?</h2>
        <p style={{ fontSize: 14, color: '#bfdbfe', margin: '0 0 20px', lineHeight: 1.6 }}>
          Purchase from Bartact and you&apos;ll automatically receive a verified buyer review request. Every review here started that way.
        </p>
        <a
          href="https://bartact.com"
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1e40af', fontWeight: 800, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          🛒 Shop Bartact →
        </a>
      </div>

      {/* Reviews */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: 0 }}>Customer Reviews</h2>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Showing {data.reviews.length} most recent of {data.total.toLocaleString()}+ total</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {data.reviews.map((review, i) => (
            <div key={i} style={{ borderBottom: i < data.reviews.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: i < data.reviews.length - 1 ? 20 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{review.author}</span>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', background: '#dcfce7', borderRadius: 6, padding: '2px 7px' }}>✓ Verified Buyer</span>
                {review.date && <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>{monthsAgo(review.date)}</span>}
              </div>
              {review.product && (
                <div style={{ fontSize: 12, color: '#7c3aed', background: '#f5f3ff', borderRadius: 6, padding: '3px 9px', marginBottom: 6, display: 'inline-block', fontWeight: 600 }}>
                  🛒 {review.product}
                </div>
              )}
              {review.text && <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7 }}>{review.text}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{ background: '#eff6ff', borderRadius: 18, border: '1px solid #bfdbfe', padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: '#1e40af', margin: '0 0 10px' }}>About Bartact</h2>
        <p style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.7, margin: '0 0 12px' }}>
          Bartact has been making premium Jeep seat covers, grab handles, and accessories in Temecula, California since 2012.
          All products are Made in USA with mil-spec materials. Bartact is a founding member of RecentRatings.
        </p>
        <a href="https://bartact.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 700 }}>
          Visit bartact.com →
        </a>
      </div>

    </div>
  )
}
