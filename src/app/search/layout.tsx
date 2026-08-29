import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Restaurant Ratings & Reviews — RecentRatings',
  description: 'Search 400,000+ restaurants and businesses. See time-filtered ratings — last 6 months, last year, and all-time — powered by verified reviews.',
  alternates: { canonical: 'https://recentratings.com/search' },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
