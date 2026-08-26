import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// ISR: cache sitemap for 12 hours at Vercel edge — prevents 60s timeout on every crawl
export const revalidate = 43200

const BASE_URL = 'https://recentratings.com'

export async function GET() {
  const urls: string[] = []
  
  // Static pages
  urls.push(
    `<url><loc>${BASE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${BASE_URL}/search</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
  )

  // Fetch all place slugs with google_rating in batches
  const BATCH = 1000
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabaseAdmin
      .from('restaurants')
      .select('slug')
      .not('google_rating', 'is', null)
      .not('slug', 'is', null)
      .range(offset, offset + BATCH - 1)
      .order('slug')

    if (error || !data || data.length === 0) { hasMore = false; break }

    for (const row of data) {
      if (row.slug) {
        urls.push(`<url><loc>${BASE_URL}/place/${row.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
      }
    }

    offset += BATCH
    if (data.length < BATCH) hasMore = false
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
