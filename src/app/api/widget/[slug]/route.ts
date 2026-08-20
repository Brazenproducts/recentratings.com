import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Returns embeddable widget HTML — cached 1 hour
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const theme = req.nextUrl.searchParams.get('theme') || 'light'
  const compact = req.nextUrl.searchParams.get('compact') === '1'

  // Fetch place + stats
  const [{ data: place }, { data: ratings }] = await Promise.all([
    supabaseAdmin.from('restaurants').select('name,city,state,google_place_id').eq('slug', slug).maybeSingle(),
    supabaseAdmin.from('recent_ratings').select('google_rating_alltime,google_review_count').eq('restaurant_slug', slug).maybeSingle(),
  ])

  if (!place) {
    return new NextResponse('Not found', { status: 404 })
  }

  // Get yotpo stats
  let combinedTotal = ratings?.google_review_count || 0
  let combinedAvg = ratings?.google_rating_alltime || 0

  if (place.google_place_id) {
    const { data: allReviews } = await supabaseAdmin
      .from('reviews_cache')
      .select('rating')
      .eq('google_place_id', place.google_place_id)
      .not('rating', 'is', null)
    if (allReviews && allReviews.length > 0) {
      combinedTotal = allReviews.length
      combinedAvg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    }
  }

  const avgDisplay = Number.isInteger(combinedAvg)
    ? combinedAvg.toFixed(1)
    : parseFloat(combinedAvg.toFixed(1)) !== parseFloat(combinedAvg.toFixed(2))
      ? combinedAvg.toFixed(2)
      : combinedAvg.toFixed(1)

  const isDark = theme === 'dark'
  const bg = isDark ? '#1e293b' : '#ffffff'
  const border = isDark ? '#334155' : '#e2e8f0'
  const textPrimary = isDark ? '#f1f5f9' : '#111827'
  const textSecondary = isDark ? '#94a3b8' : '#6b7280'
  const green = isDark ? '#4ade80' : '#166534'
  const greenBg = isDark ? '#14532d' : '#f0fdf4'
  const pageUrl = `https://recentratings.com/place/${slug}`

  const stars = '★'.repeat(Math.round(combinedAvg)) + '☆'.repeat(5 - Math.round(combinedAvg))

  const html = compact
    ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
        body{background:transparent}
        a{text-decoration:none;display:inline-flex;align-items:center;gap:8px;background:${bg};border:1px solid ${border};border-radius:10px;padding:8px 14px;cursor:pointer}
        .stars{color:#f59e0b;font-size:14px}
        .score{font-size:15px;font-weight:900;color:${green}}
        .label{font-size:12px;color:${textSecondary}}
        .badge{font-size:10px;font-weight:700;color:${green};background:${greenBg};border-radius:4px;padding:2px 5px}
      </style></head><body>
      <a href="${pageUrl}" target="_blank" rel="noopener">
        <span class="stars">${stars}</span>
        <span class="score">${avgDisplay}</span>
        <span class="label">${combinedTotal.toLocaleString()} reviews</span>
        <span class="badge">RecentRatings</span>
      </a>
    </body></html>`
    : `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
        body{background:transparent}
        .widget{background:${bg};border:1px solid ${border};border-radius:14px;padding:16px 20px;display:inline-block;max-width:280px;width:100%}
        .top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .name{font-size:13px;font-weight:700;color:${textPrimary}}
        .badge{font-size:10px;font-weight:800;color:${green};background:${greenBg};border-radius:6px;padding:3px 8px}
        .score-row{display:flex;align-items:baseline;gap:6px;margin-bottom:4px}
        .score{font-size:32px;font-weight:900;color:${green};line-height:1}
        .stars{color:#f59e0b;font-size:16px}
        .count{font-size:12px;color:${textSecondary}}
        .verified{font-size:11px;font-weight:600;color:${green};margin-bottom:10px}
        .cta{display:block;text-align:center;font-size:12px;font-weight:700;color:${isDark ? '#60a5fa' : '#1d4ed8'};text-decoration:none;padding:7px;border:1px solid ${isDark ? '#1d4ed8' : '#bfdbfe'};border-radius:8px;background:${isDark ? '#1e3a5f' : '#eff6ff'}}
        .powered{text-align:center;font-size:10px;color:${textSecondary};margin-top:8px}
      </style></head><body>
      <div class="widget">
        <div class="top">
          <span class="name">${place.name}</span>
          <span class="badge">✓ Verified</span>
        </div>
        <div class="score-row">
          <span class="score">${avgDisplay}</span>
          <span class="stars">${stars}</span>
        </div>
        <div class="count">${combinedTotal.toLocaleString()} customer reviews</div>
        <div class="verified" style="margin-top:4px">All from verified buyers</div>
        <a class="cta" href="${pageUrl}" target="_blank" rel="noopener">Read all reviews →</a>
        <div class="powered">Powered by <a href="https://recentratings.com" target="_blank" style="color:${isDark ? '#60a5fa' : '#1d4ed8'};font-weight:700">RecentRatings</a></div>
      </div>
    </body></html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'ALLOWALL',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
