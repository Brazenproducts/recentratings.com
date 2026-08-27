import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'RecentRatings.com — See How Places Are Rated Right Now',
  description: 'Time-filtered ratings for 400,000+ places. See verified buyer reviews and recent Google scores — last 6 months, 1 year, or all-time. Free to search.',
  alternates: { canonical: 'https://recentratings.com' },
}

export default function HomePage() {
  return <HomeClient />
}
