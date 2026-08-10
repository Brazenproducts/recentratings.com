import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 3600 // regenerate every hour

const BASE_URL = 'https://recentratings.com'
const BATCH_SIZE = 1000

export default async function sitemap() {
  // Fetch all slugs with google_rating (renderable pages)
  const allUrls: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = []

  // Static pages
  allUrls.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  )

  // Fetch place slugs in batches
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabaseAdmin
      .from('restaurants')
      .select('slug, updated_at')
      .not('google_rating', 'is', null)
      .not('slug', 'is', null)
      .range(offset, offset + BATCH_SIZE - 1)

    if (error || !data || data.length === 0) {
      hasMore = false
      break
    }

    for (const row of data) {
      if (row.slug) {
        allUrls.push({
          url: `${BASE_URL}/place/${row.slug}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }

    offset += BATCH_SIZE
    if (data.length < BATCH_SIZE) hasMore = false
  }

  return allUrls
}
