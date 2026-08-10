// Google Indexing API for recentratings.com
const { google } = require('/home/ubuntu/.openclaw/workspace/node_modules/googleapis');
const fs = require('fs');

const SITE_CONFIG = require('/home/ubuntu/.openclaw/workspace/skipatip/scripts/data-pipeline/config.js');
const SUPABASE_URL = SITE_CONFIG.SUPABASE_URL;
const SUPABASE_KEY = SITE_CONFIG.SUPABASE_SERVICE_KEY;

async function run() {
  const auth = new google.auth.GoogleAuth({
    keyFile: '/home/ubuntu/.openclaw/workspace/.gcp-service-account.json',
    scopes: ['https://www.googleapis.com/auth/indexing']
  });
  const client = await auth.getClient();
  const indexing = google.indexing({ version: 'v3', auth: client });

  // Fetch top slugs with recent_ratings data (highest priority pages)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/recent_ratings?select=restaurant_slug&limit=199`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const rows = await res.json();
  const urls = rows.map(r => `https://recentratings.com/place/${r.restaurant_slug}`);
  
  console.log(`Submitting ${urls.length} URLs to Google Indexing API...`);
  
  let ok = 0, fail = 0;
  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' }
      });
      ok++;
      if (ok % 20 === 0) console.log(`  ${ok}/${urls.length} submitted`);
      await new Promise(r => setTimeout(r, 100)); // rate limit
    } catch(e) {
      fail++;
      if (fail === 1) console.log('  First failure:', e.message.substring(0, 120));
    }
  }
  
  // Also submit homepage and sitemap page
  for (const url of ['https://recentratings.com/', 'https://recentratings.com/search']) {
    try {
      await indexing.urlNotifications.publish({ requestBody: { url, type: 'URL_UPDATED' } });
      console.log('  Static:', url);
    } catch(e) {}
  }
  
  console.log(`\nDone. ✅ ${ok} submitted, ❌ ${fail} failed`);
  
  // Save state
  fs.writeFileSync('/home/ubuntu/.openclaw/workspace/sites/indexing-credentials/recentratings/indexing-state.json',
    JSON.stringify({ lastRun: new Date().toISOString(), submitted: ok, failed: fail }, null, 2));
}

run().catch(e => console.error('Fatal:', e.message));
