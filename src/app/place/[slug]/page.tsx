import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import PlaceDetail from './PlaceDetail'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: place } = await supabaseAdmin
    .from('restaurants')
    .select('name, city, state, google_rating')
    .eq('slug', params.slug)
    .single()

  if (!place) return { title: 'Place Not Found — RecentRatings' }

  return {
    title: `${place.name} — ${place.city}, ${place.state} | RecentRatings`,
    description: `See time-filtered ratings for ${place.name} in ${place.city}, ${place.state}. How is it rated in the last 30 days, 6 months, and 1 year?`,
  }
}

export default async function PlacePage({ params }: Props) {
  const { data: place } = await supabaseAdmin
    .from('restaurants')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!place) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🤷</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Place not found</h1>
        <p className="text-gray-500 mb-6">We couldn&apos;t find that place. Try searching again.</p>
        <a href="/search" className="text-blue-600 font-semibold hover:underline">← Back to Search</a>
      </div>
    )
  }

  const { data: ratings } = await supabaseAdmin
    .from('recent_ratings')
    .select('*')
    .eq('restaurant_slug', params.slug)
    .single()

  const { data: reviews } = await supabaseAdmin
    .from('reviews_cache')
    .select('*')
    .eq('place_id', place.google_place_id)
    .order('time', { ascending: false })
    .limit(10)

  return <PlaceDetail place={place} ratings={ratings} reviews={reviews || []} />
}
