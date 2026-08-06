#!/usr/bin/env node
/**
 * RecentRatings IndexNow Submission Script
 * 
 * Submits place pages to Bing/Yandex/others via IndexNow in one call.
 * Run after any batch of new/updated place pages.
 * 
 * IndexNow key: b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5
 * Key file:     https://recentratings.com/b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5.txt
 * Max per call: 10,000 URLs
 * 
 * Usage:
 *   node scripts/indexnow-submit.js                    # submit batch of recent/updated places
 *   node scripts/indexnow-submit.js --all              # submit ALL place slugs (paginated)
 *   node scripts/indexnow-submit.js --limit 500        # submit first N slugs
 */

const https = require('https')

const INDEXNOW_KEY = 'b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5'
const HOST = 'recentratings.com'
const BASE_URL = 'https://recentratings.com'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

const SUPABASE_URL = 'https://zqmepfdghljknyojfsmq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbWVwZmRnaGxqa255b2pmc21xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUzNjgyNCwiZXhwIjoyMDk0MTEyODI0fQ.jtzXSN0ze19VLmVzzx6Vb7-heEW15jPMHVxZ7RisiCc'

const args = process.argv.slice(2)
const submitAll = args.includes('--all')
const limitArg = args.find(a => a.startsWith('--limit=') || a === '--limit')
const limit = limitArg
  ? (limitArg.includes('=') ? parseInt(limitArg.split('=')[1]) : parseInt(args[args.indexOf('--limit') + 1]))
  : (submitAll ? 10000 : 500)

async function supabaseFetch(path, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${await res.text()}`)
  return res.json()
}

async function submitToIndexNow(urls) {
  const body = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  })

  const url = new URL(INDEXNOW_ENDPOINT)
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = ''
      res.on('data', d => { data += d })
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  console.log(`\n🔍 RecentRatings IndexNow Submission`)
  console.log(`   Mode: ${submitAll ? 'ALL slugs' : `first ${limit} slugs`}`)
  console.log(`   Key:  ${INDEXNOW_KEY}\n`)

  // Fetch slugs with recent_ratings data first (these pages have the richest content)
  // Then fall back to all restaurants
  let slugs = []

  if (submitAll || limit > 500) {
    // Paginate through all slugs
    console.log('📦 Fetching all place slugs from Supabase...')
    let page = 0
    const pageSize = 1000
    while (slugs.length < limit) {
      const rows = await supabaseFetch('restaurants', {
        select: 'slug',
        order: 'google_review_count.desc',
        limit: Math.min(pageSize, limit - slugs.length),
        offset: page * pageSize,
      })
      if (!rows.length) break
      slugs.push(...rows.map(r => r.slug))
      page++
      if (rows.length < pageSize) break
    }
  } else {
    // Default: fetch slugs that have time-bucketed data (most SEO-ready pages)
    console.log('📦 Fetching slugs with time-bucketed ratings...')
    const ratedRows = await supabaseFetch('recent_ratings', {
      select: 'restaurant_slug',
      limit: Math.min(limit, 10000),
      order: 'fetched_at.desc.nullslast',
    })
    slugs = ratedRows.map(r => r.restaurant_slug)
    console.log(`   Found ${slugs.length} slugs with ratings data`)

    // If we have room, top up with high-review-count places
    if (slugs.length < limit) {
      const slugSet = new Set(slugs)
      const topRows = await supabaseFetch('restaurants', {
        select: 'slug',
        order: 'google_review_count.desc',
        limit: limit - slugs.length,
      })
      for (const r of topRows) {
        if (!slugSet.has(r.slug)) slugs.push(r.slug)
      }
      console.log(`   Topped up to ${slugs.length} total slugs`)
    }
  }

  if (slugs.length === 0) {
    console.error('❌ No slugs found. Check Supabase connection.')
    process.exit(1)
  }

  // Build URLs
  const urls = slugs.map(slug => `${BASE_URL}/place/${slug}`)
  // Always include static pages
  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/search`,
  ]
  const allUrls = [...new Set([...staticUrls, ...urls])].slice(0, 10000)

  console.log(`\n📮 Submitting ${allUrls.length} URLs to IndexNow...`)

  // IndexNow supports up to 10,000 per call — but let's batch at 2,000 to be safe
  const BATCH_SIZE = 2000
  let totalSubmitted = 0
  let failed = 0

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(allUrls.length / BATCH_SIZE)
    process.stdout.write(`   Batch ${batchNum}/${totalBatches} (${batch.length} URLs)... `)

    const result = await submitToIndexNow(batch)
    
    // IndexNow status codes:
    // 200 = OK, all submitted
    // 202 = Accepted (queued)
    // 400 = Bad request
    // 403 = Forbidden (key mismatch)
    // 422 = Unprocessable (URLs don't match host)
    // 429 = Too many requests
    if (result.status === 200 || result.status === 202) {
      totalSubmitted += batch.length
      console.log(`✅ ${result.status}`)
    } else {
      failed += batch.length
      console.log(`❌ ${result.status}: ${result.body}`)
    }

    // Small delay between batches
    if (i + BATCH_SIZE < allUrls.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  console.log(`\n✅ IndexNow submission complete`)
  console.log(`   Submitted: ${totalSubmitted} URLs`)
  if (failed > 0) console.log(`   Failed:    ${failed} URLs`)
  console.log(`\n💡 Bing + Yandex + others will pick these up within 24h`)
  console.log(`   For Google: set up GCP service account + Indexing API (separate step)\n`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
