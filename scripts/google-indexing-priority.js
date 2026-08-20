/**
 * GOOGLE INDEXING API — PRIORITY QUEUE
 * Submits pages to Google for immediate crawling in priority order:
 *   1. New subscribers (signed up in last 24h)
 *   2. Certified / featured businesses
 *   3. Pages with most reviews
 *   4. Recently updated pages
 *
 * Quota: 200 URLs/day (shared GCP project).
 * Run via crontab at 6:01am UTC (after daily sync):
 *   1 6 * * * cd /home/ubuntu/.openclaw/workspace/sites/recentratings.com && node scripts/google-indexing-priority.js >> /tmp/google-indexing.log 2>&1
 */
require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/skipatip/.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleAuth } = require('google-auth-library')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = proces…_KEY
const BASE_URL = 'https://recentratings.com'
const DAILY_QUOTA = 199
const KEY_FILE = '/home/ubuntu/.openclaw/workspace/.gcp-service-account.json'

const sb = createClient(SUPABASE_URL, SERVICE_KEY)

async function getGoogleClient() {
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ['https://www.googleapis.com/auth/indexing'] })
  return auth.getClient()
}

async function submitUrl(client, url) {
  try {
    await client.request({
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      data: { url, type: 'URL_UPDATED' },
    })
    return true
  } catch (err) {
    const msg = err?.response?.data?.error?.message || err.message || ''
    if (msg.includes('Quota')) { console.log('  ⚠️  Quota exhausted'); return null }
    console.log(`  ❌ ${url.split('/').pop()} — ${msg.slice(0, 60)}`)
    return false
  }
}

async function getPriorityUrls(limit) {
  const urls = []

  // 1. New subscribers (signed up in last 48h) — highest priority
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  const { data: newBiz } = await sb
    .from('businesses')
    .select('domain')
    .gte('created_at', cutoff)
    .limit(20)
  if (newBiz) {
    for (const b of newBiz) {
      const { data: r } = await sb.from('restaurants').select('slug').ilike('website', `%${b.domain}%`).maybeSingle()
      if (r?.slug) urls.push({ url: `${BASE_URL}/place/${r.slug}`, reason: 'new subscriber' })
    }
  }

  // 2. Certified / featured businesses
  const { data: certified } = await sb
    .from('restaurants')
    .select('slug')
    .or('is_certified.eq.true,is_featured.eq.true')
    .not('slug', 'is', null)
    .not('google_rating', 'is', null)
    .limit(20)
  if (certified) certified.forEach(r => urls.push({ url: `${BASE_URL}/place/${r.slug}`, reason: 'certified' }))

  // 3. Pages with most Yotpo verified reviews
  const { data: topReviewed } = await sb
    .from('restaurants')
    .select('slug')
    .not('slug', 'is', null)
    .not('google_review_count', 'is', null)
    .order('google_review_count', { ascending: false })
    .limit(limit - urls.length)
  if (topReviewed) topReviewed.forEach(r => urls.push({ url: `${BASE_URL}/place/${r.slug}`, reason: 'high review count' }))

  // Deduplicate
  const seen = new Set()
  return urls.filter(u => { if (seen.has(u.url)) return false; seen.add(u.url); return true }).slice(0, limit)
}

async function main() {
  console.log(`\n📡 Google Indexing API — Priority Queue — ${new Date().toISOString()}`)

  let client
  try {
    client = await getGoogleClient()
  } catch (err) {
    console.error('❌ Google auth failed:', err.message)
    process.exit(1)
  }

  const urls = await getPriorityUrls(DAILY_QUOTA)
  console.log(`Submitting ${urls.length} URLs in priority order\n`)

  let submitted = 0, failed = 0

  for (const { url, reason } of urls) {
    process.stdout.write(`  [${reason}] ${url.split('/').pop().slice(0, 40).padEnd(40)} `)
    const result = await submitUrl(client, url)
    if (result === null) break // quota exhausted
    if (result) { submitted++; process.stdout.write('✅\n') }
    else { failed++; }
    await new Promise(r => setTimeout(r, 200)) // 5/sec rate limit
  }

  console.log(`\n✅ Submitted: ${submitted} | ❌ Failed: ${failed}`)
  console.log('Quota resets at midnight Pacific.')
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
