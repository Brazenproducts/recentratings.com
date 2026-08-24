import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RecentRatings.com — See How Places Are Rated Right Now',
  description: 'Time-filtered ratings for restaurants and more. See how places are rated in the last 30 days, 6 months, or 1 year — not just an all-time average.',
  verification: {
    google: 'X09oouSeKXhbeJFBI9D55WiSW3qiAcGaKAE0bFzQ2Ns',
  },
  openGraph: {
    title: 'RecentRatings.com',
    description: 'See how places are actually rated right now — not years ago.',
    url: 'https://recentratings.com',
    siteName: 'RecentRatings',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/logo-square.jpg" alt="RecentRatings" style={{ width: 36, height: 36, borderRadius: 8, display: 'block', objectFit: 'cover' }} />
              <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb', letterSpacing: '-0.5px' }}>Recent</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>Ratings</span>
              <span style={{ fontSize: 11, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, padding: '2px 8px', borderRadius: 20, marginLeft: 4 }}>BETA</span>
            </a>
            <nav style={{ display: 'flex', gap: 24, fontSize: 14, fontWeight: 600, color: '#4b5563' }}>
              <a href="/" style={{ color: '#4b5563', textDecoration: 'none' }}>Home</a>
              <a href="/search" style={{ color: '#4b5563', textDecoration: 'none' }}>Search</a>
              <a href="/for-businesses" style={{ color: '#4b5563', textDecoration: 'none' }}>For Businesses</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer style={{ marginTop: 64, borderTop: '1px solid #e5e7eb', background: '#fff', padding: '32px 20px', textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
          <p>© {new Date().getFullYear()} RecentRatings.com — Ratings that actually mean something.</p>
          <p style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>Data sourced from Google Places, Yelp, and verified platforms · Updated daily · 400,000+ places</p>
          <p style={{ marginTop: 10, fontSize: 12, color: '#9ca3af' }}>
            <a href="/about" style={{ color: '#9ca3af', textDecoration: 'none', marginRight: 14 }}>About</a>
            <a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', marginRight: 14 }}>Privacy Policy</a>
            <a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
          </p>
        </footer>
      </body>
    </html>
  )
}
