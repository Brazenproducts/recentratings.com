import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RecentRatings.com — See How Places Are Rated Right Now',
  description: 'Time-filtered ratings for restaurants, businesses and more. See how places are rated in the last 30 days, 6 months, or 1 year — not just an all-time average.',
  openGraph: {
    title: 'RecentRatings.com',
    description: 'See how places are actually rated right now — not years ago.',
    url: 'https://recentratings.com',
    siteName: 'RecentRatings',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-blue-600 tracking-tight">Recent</span>
              <span className="text-2xl font-black text-gray-800 tracking-tight">Ratings</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full ml-1">BETA</span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
              <a href="/search" className="hover:text-blue-600 transition-colors">Search</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RecentRatings.com — Ratings that actually mean something.</p>
          <p className="mt-1 text-xs text-gray-400">Data sourced from Google Places · Updated daily · 115,000+ places</p>
        </footer>
      </body>
    </html>
  )
}
