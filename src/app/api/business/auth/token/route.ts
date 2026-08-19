import { NextRequest, NextResponse } from 'next/server'
import { createHmac, randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

const SECRET = process.env.BUSINESS_AUTH_SECRET!

export function signToken(email: string): string {
  const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  const payload = Buffer.from(JSON.stringify({ email, expires })).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyToken(token: string): string | null {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const expected = createHmac('sha256', SECRET).update(payload).digest('base64url')
    if (sig !== expected) return null
    const { email, expires } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (Date.now() > expires) return null
    return email
  } catch { return null }
}

// POST — generate a token for an email (used by magic-link send flow)
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (!business) return NextResponse.json({ error: 'No account found' }, { status: 404 })

  const token = signToken(email.toLowerCase())
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://recentratings.com'}/dashboard?token=${token}`
  return NextResponse.json({ token, url })
}

// GET — validate a token (called by dashboard on load)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  const email = verifyToken(token)
  if (!email) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

  return NextResponse.json({ email, valid: true })
}
