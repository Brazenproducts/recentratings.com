import { NextRequest, NextResponse } from 'next/server'
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

    // Check for existing signup
    const { data: existing } = await supabaseAdmin
      .from('businesses')
      .select('id, plan')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // Create business record
    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .insert({
        name: businessName,
        domain,
        email: email.toLowerCase(),
        plan: selectedPlan || 'free',
      })
      .select()
      .single()

    if (error) {
      console.error('Business insert error:', error)
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
    }

    // If they have a review platform, create a source record
    if (platform && platform !== 'CSV Upload' && platform !== 'Other') {
      await supabaseAdmin
        .from('business_review_sources')
        .insert({
          business_id: business.id,
          platform: platform.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          api_key: null, // Collected separately in dashboard
        })
    }

    // TODO: If paid plan, kick off Stripe checkout here
    // For now, just return success — we follow up manually
    return NextResponse.json({ success: true, businessId: business.id, plan: business.plan })

  } catch (err: unknown) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
