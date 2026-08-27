import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Businesses — RecentRatings | Show Your Verified Reviews',
  description: 'Claim your RecentRatings page. Connect Yotpo or Judge.me — show verified buyer reviews alongside Google ratings. From $29.99/mo.',
  alternates: { canonical: 'https://recentratings.com/for-businesses' },
  openGraph: {
    title: 'RecentRatings for Businesses — Verified Reviews, Time-Filtered Ratings',
    description: 'Your Yotpo and Judge.me reviews deserve more visibility. RecentRatings puts them on a neutral indexed page — fraud dispute, embed widget included. $29.99/mo.',
    url: 'https://recentratings.com/for-businesses',
  }
}

export default function ForBusinessesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
