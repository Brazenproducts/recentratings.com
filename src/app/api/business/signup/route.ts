import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { businessName, website, email, platform, selectedPlan } = await req.json()

    if (!businessName || !website || !email) {
      return NextResponse.json({ error: 'businessName, website, and email are required' }, { status: 400 })
    }

    // Normalize domain from URL
    let domain = website
    try {
      domain = new URL(website).hostname.replace(/^www\./, '')
    } catch { /* keep as-is */ }

    // SECURITY: Email domain must match business website domain.
    // Claiming bartact.com requires a @bartact.com email.
    // This prevents anyone from fraudulently claiming another company's page.
    const emailDomain = email.toLowerCase().split('@')[1] || ''
    if (emailDomain !== domain) {
      return NextResponse.json({
        error: `To claim ${domain}, you must sign up with a @${domain} email address. This confirms you work for this business. Personal email addresses (Gmail, Yahoo, etc.) are not accepted for business claims.`,
        domainMismatch: true,
        expectedDomain: domain,
      }, { status: 403 })
    }

    // Check for existing account
    const { data: existing } = await supabaseAdmin
      .from('businesses')
      .select('id, plan, verified')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        error: existing.verified
          ? 'An account with this email already exists. Go to /dashboard to access it.'
          : 'An account with this email is pending verification. Check your email inbox.',
      }, { status: 409 })
    }

    // Create business record
    // verified=true for now (domain match is sufficient initial gate)
    // TODO: set verified=false and send magic link once email provider (Resend) is configured
    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .insert({
        name: businessName,
        domain,
        email: email.toLowerCase(),
        plan: selectedPlan || 'free',
        verified: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Business insert error:', error)
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
    }

    // Create review source record if platform provided
    if (platform && platform !== 'CSV Upload' && platform !== 'Other') {
      await supabaseAdmin
        .from('business_review_sources')
        .insert({
          business_id: business.id,
          platform: platform.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          api_key: null,
        })
    }

    // Submit to IndexNow + Google Indexing API immediately on signup
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('slug')
      .ilike('website', `%${domain}%`)
      .maybeSingle()
    if (restaurant?.slug) {
      const pageUrl = `${baseUrl}/place/${restaurant.slug}`

      // IndexNow — Bing, Yandex, etc.
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'recentratings.com',
          key: 'b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5',
          keyLocation: `${baseUrl}/b4f7e2a1c3d5e6f7a8b9c0d1e2f3a4b5.txt`,
          urlList: [pageUrl],
        }),
      }).catch(() => {})

      // Google Indexing API handled by server-side daily cron (priority queue)
    }

    return NextResponse.json({ success: true, businessId: business.id, plan: business.plan })

  } catch (err: unknown) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
