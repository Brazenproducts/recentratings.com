import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { signToken } from '../token/route'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id, name')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (!business) {
      return NextResponse.json({
        error: 'No business account found for that email. Sign up at /for-businesses first.',
        notFound: true,
      }, { status: 404 })
    }

    const token = signToken(email.toLowerCase())
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'
    const loginUrl = `${base}/dashboard?token=${token}`

    // TODO: Send loginUrl via email (Resend) once configured
    // For now: return it in response so we can share directly
    console.log(`Login link for ${email}: ${loginUrl}`)

    return NextResponse.json({ success: true, loginUrl })

  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
