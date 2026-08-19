import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    // Verify this email has a business account before sending anything
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id, name, verified')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (!business) {
      return NextResponse.json({
        error: 'No business account found for that email. Sign up at /for-businesses first.',
        notFound: true,
      }, { status: 404 })
    }

    // Send magic link via Supabase Auth
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'
    const { error } = await supabaseAnon.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: `${baseUrl}/dashboard/verify`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('Magic link error:', error)
      return NextResponse.json({ error: 'Failed to send login link. Try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
