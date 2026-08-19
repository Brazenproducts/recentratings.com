'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Business {
  id: string
  name: string
  domain: string
  email: string
  plan: string
  created_at: string
}

interface ReviewSource {
  id: string
  platform: string
  last_synced_at?: string
}

interface Review {
  id: string
  author_name?: string
  rating?: number
  text?: string
  time_published?: string
  source?: string
  disputed?: boolean
  disputed_at?: string
  dispute_reason?: string
}

interface Stats {
  reviewCount: number
  avgRating: number
  pageSlug?: string
  googlePlaceId?: string | null
}

const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free:   { label: 'Free',             color: '#6b7280', bg: '#f3f4f6' },
  growth: { label: 'Growth — $29/mo',  color: '#1d4ed8', bg: '#eff6ff' },
  pro:    { label: 'Pro — $99/mo',     color: '#7c3aed', bg: '#faf5ff' },
}

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null
  return <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

function SourceBadge({ source }: { source?: string }) {
  if (!source) return null
  if (source === 'yotpo' || source === 'judgeme')
    return <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', background: '#dcfce7', borderRadius: 6, padding: '2px 7px' }}>✓ Verified Buyer</span>
  return <span style={{ fontSize: 11, fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', borderRadius: 6, padding: '2px 7px' }}>Google</span>
}

function monthsAgo(ts?: string) {
  if (!ts) return ''
  const d = new Date(ts)
  const months = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 30))
  if (months < 1) return 'this month'
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}

// ── Flag Modal ──────────────────────────────────────────────────────────────
function FlagModal({ review, email, plan, disputedCount, onClose, onSuccess }: {
  review: Review
  email: string
  plan: string
  disputedCount: number
  onClose: () => void
  onSuccess: (reviewId: string) => void
}) {
  const [confirmed, setConfirmed] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const FREE_LIMIT = 3
  const atLimit = plan === 'free' && disputedCount >= FREE_LIMIT

  async function submit() {
    if (!confirmed) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/business/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review.id, email, action: 'flag', reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to flag review')
      onSuccess(review.id)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 520, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>Flag Review as Fraudulent</h2>

        {atLimit ? (
          <>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px', lineHeight: 1.6 }}>
              The Free plan allows up to {FREE_LIMIT} disputed reviews. You&apos;ve reached that limit.
            </p>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', margin: '0 0 8px' }}>Upgrade to Growth or Pro for unlimited flagging</p>
              <a href="/for-businesses#signup" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '8px 18px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
                Upgrade Now →
              </a>
            </div>
            <button onClick={onClose} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#6b7280' }}>Close</button>
          </>
        ) : (
          <>
            {/* Review preview */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{review.author_name || 'Anonymous'}</span>
                <Stars rating={review.rating} />
                <SourceBadge source={review.source} />
              </div>
              <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{review.text?.slice(0, 180)}{(review.text?.length ?? 0) > 180 ? '…' : ''}</p>
            </div>

            {/* Optional reason */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Reason (optional — for your records only)
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Reviewer never purchased from us, competitor account created same day as review..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Legal confirmation */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 20, padding: '14px', background: '#fef3c7', borderRadius: 12, border: '1px solid #fde68a' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0, width: 16, height: 16, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
                <strong>I confirm</strong> that I believe this review is fraudulent and was not submitted by a genuine customer of my business.
                I understand that RecentRatings does not verify this claim and I am <strong>solely responsible</strong> for this determination.
              </span>
            </label>

            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={submit} disabled={!confirmed || loading}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: confirmed ? '#dc2626' : '#fca5a5', color: '#fff', cursor: confirmed ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 800, transition: 'background 0.15s' }}>
                {loading ? 'Flagging...' : 'Confirm & Hide Review'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
function DashboardContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [lookupEmail, setLookupEmail] = useState('')
  const [business, setBusiness] = useState<Business | null>(null)
  const [sources, setSources] = useState<ReviewSource[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [disputedCount, setDisputedCount] = useState(0)
  const [plan, setPlan] = useState('free')
  const [tab, setTab] = useState<'overview' | 'reviews'>('overview')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [flagTarget, setFlagTarget] = useState<Review | null>(null)

  // On mount: check URL token first, then localStorage session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      // Validate server-side and load dashboard
      fetch(`/api/business/auth/token?token=${encodeURIComponent(urlToken)}`)
        .then(r => r.json())
        .then(d => {
          if (d.valid && d.email) {
            localStorage.setItem('rr_business_email', d.email)
            setLookupEmail(d.email)
            loadDashboard(d.email).then(() => {
              window.history.replaceState({}, '', '/dashboard')
            })
          }
        })
    } else {
      const savedEmail = localStorage.getItem('rr_business_email')
      if (savedEmail) {
        setLookupEmail(savedEmail)
        loadDashboard(savedEmail)
      }
    }
  }, [])

  async function loadDashboard(email: string) {
    setLoading(true)
    setError('')
    try {
      const [dashRes, reviewsRes] = await Promise.all([
        fetch(`/api/business/dashboard?email=${encodeURIComponent(email)}`),
        fetch(`/api/business/reviews?email=${encodeURIComponent(email)}`),
      ])
      const dashData = await dashRes.json()
      if (!dashRes.ok) throw new Error(dashData.error || 'Not found')
      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [], disputedCount: 0, plan: 'free' }
      setBusiness(dashData.business)
      setSources(dashData.sources || [])
      setStats(dashData.stats || null)
      setReviews(reviewsData.reviews || [])
      setDisputedCount(reviewsData.disputedCount || 0)
      setPlan(reviewsData.plan || dashData.business.plan)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      localStorage.removeItem('rr_business_email')
    } finally {
      setLoading(false)
    }
  }

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/business/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lookupEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleFlagSuccess(reviewId: string) {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, disputed: true, disputed_at: new Date().toISOString() } : r))
    setDisputedCount(c => c + 1)
    setFlagTarget(null)
  }

  async function handleUnflag(reviewId: string) {
    if (!business) return
    const res = await fetch('/api/business/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, email: business.email, action: 'unflag' }),
    })
    if (res.ok) {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, disputed: false, disputed_at: undefined } : r))
      setDisputedCount(c => Math.max(0, c - 1))
    }
  }

  const activeReviews = reviews.filter(r => !r.disputed)
  const disputedReviews = reviews.filter(r => r.disputed)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 18, color: '#1e40af', textDecoration: 'none' }}>RecentRatings</a>
        <span style={{ color: '#d1d5db' }}>›</span>
        <span style={{ fontWeight: 600, color: '#374151' }}>Business Dashboard</span>
      </nav>

      <div style={{ maxWidth: 780, margin: '40px auto', padding: '0 24px' }}>

        {/* Stripe success banner */}
        {sessionId && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 14, padding: 20, marginBottom: 28, display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🎉</span>
            <div>
              <div style={{ fontWeight: 800, color: '#166534', marginBottom: 4 }}>Payment successful!</div>
              <div style={{ fontSize: 14, color: '#166534' }}>Your plan is now active. Your page will be updated within minutes.</div>
            </div>
          </div>
        )}

        {!business ? (
          // ── EMAIL LOOKUP ──
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: 40, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            {sent ? (
              <>
                <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>📬</div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 8px', textAlign: 'center' }}>Check your email</h1>
                <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.7 }}>
                  We sent a login link to <strong>{lookupEmail}</strong>.<br />
                  Click it to access your dashboard. Link expires in 1 hour.
                </p>
                <button onClick={() => { setSent(false); setError('') }}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#6b7280' }}>
                  Use a different email
                </button>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>Business Dashboard</h1>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px' }}>Enter your business email and we&apos;ll send you a secure login link.</p>
                <form onSubmit={lookup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input type="email" required placeholder="you@yourbusiness.com"
                    value={lookupEmail} onChange={e => setLookupEmail(e.target.value)}
                    style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none' }} />
                  {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 14 }}>{error}</div>}
                  <button type="submit" disabled={loading}
                    style={{ background: '#1d4ed8', color: '#fff', fontWeight: 800, padding: 12, borderRadius: 12, border: 'none', fontSize: 15, cursor: 'pointer' }}>
                    {loading ? 'Sending...' : 'Send Login Link →'}
                  </button>
                </form>
                <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 20 }}>
                  Don&apos;t have an account?{' '}
                  <a href="/for-businesses" style={{ color: '#1d4ed8', fontWeight: 700 }}>Get started free →</a>
                </p>
              </>
            )}
          </div>

        ) : (
          // ── DASHBOARD ──
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>{business.name}</h1>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{business.domain} · {business.email}</div>
              </div>
              <div style={{ background: PLAN_LABELS[business.plan]?.bg || '#f3f4f6', color: PLAN_LABELS[business.plan]?.color || '#6b7280', fontWeight: 800, fontSize: 13, padding: '6px 14px', borderRadius: 20 }}>
                {PLAN_LABELS[business.plan]?.label || business.plan}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              {[
                { label: 'Live Reviews', value: stats ? Math.max(0, (stats.reviewCount || 0) - disputedCount).toString() : '…', icon: '⭐' },
                { label: 'Avg Rating', value: stats?.avgRating ? `★${stats.avgRating.toFixed(1)}` : '—', icon: '📊' },
                { label: 'Disputed', value: disputedCount.toString(), icon: '🚩', warn: disputedCount > 0 },
                { label: 'Page', value: stats?.pageSlug ? 'Live ✓' : 'Pending', icon: '🌐', link: stats?.pageSlug ? `/place/${stats.pageSlug}` : undefined },
              ].map(s => (
                <div key={s.label} style={{ background: s.warn ? '#fffbeb' : '#fff', borderRadius: 14, border: `1px solid ${s.warn ? '#fde68a' : '#e5e7eb'}`, padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', marginBottom: 2 }}>
                    {s.link ? <a href={s.link} target="_blank" style={{ color: '#1d4ed8', textDecoration: 'none' }}>{s.value}</a> : s.value}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tab nav */}
            <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 12, padding: 4 }}>
              {(['overview', 'reviews'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '8px 16px', borderRadius: 9, border: 'none', background: tab === t ? '#fff' : 'transparent', fontWeight: tab === t ? 800 : 600, fontSize: 14, color: tab === t ? '#111827' : '#6b7280', cursor: 'pointer', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', textTransform: 'capitalize' }}>
                  {t}{t === 'reviews' && reviews.length > 0 ? ` (${reviews.length})` : ''}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <>
                {/* Your page link */}
                {stats?.pageSlug && (
                  <div style={{ background: '#eff6ff', borderRadius: 14, border: '1px solid #bfdbfe', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your RecentRatings Page</div>
                      <a href={`/place/${stats.pageSlug}`} target="_blank"
                        style={{ fontSize: 15, color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                        recentratings.com/place/{stats.pageSlug} →
                      </a>
                    </div>
                    <a href={stats?.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${stats.googlePlaceId}` : '#'}
                      style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', textDecoration: 'none' }}>
                      Share Google review link →
                    </a>
                  </div>
                )}

                {/* Connected platforms */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Connected Platforms</h2>
                  {sources.length === 0 ? (
                    <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: '16px 0' }}>
                      No platforms connected.{' '}
                      <a href="mailto:hello@recentratings.com" style={{ color: '#1d4ed8', fontWeight: 700 }}>Contact us to connect yours →</a>
                    </div>
                  ) : sources.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e5e7eb', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', textTransform: 'capitalize' }}>{s.platform.replace(/_/g, '.')}</span>
                        {s.last_synced_at && <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 10 }}>synced {monthsAgo(s.last_synced_at)}</span>}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '3px 10px', borderRadius: 8 }}>Active ✓</span>
                    </div>
                  ))}
                </div>

                {/* Embed widget */}
                {stats?.pageSlug && business.plan !== 'free' && (
                  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Embed on your website</h2>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px' }}>One line of code. Shows your verified score everywhere you sell.</p>
                    <div style={{ marginBottom: 14 }}>
                      <iframe src={`https://recentratings.com/api/widget/${stats.pageSlug}?compact=1`} style={{ border: 'none', height: 44, width: '100%' }} title="RecentRatings badge preview" />
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: '#374151', wordBreak: 'break-all', marginBottom: 8 }}>
                      {`<iframe src="https://recentratings.com/api/widget/${stats.pageSlug}" style="border:none;height:120px;width:280px" title="Reviews"></iframe>`}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <a href={`https://recentratings.com/api/widget/${stats.pageSlug}`} target="_blank" style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>Full widget →</a>
                      <a href={`https://recentratings.com/api/widget/${stats.pageSlug}?compact=1`} target="_blank" style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>Compact badge →</a>
                      <a href={`https://recentratings.com/api/widget/${stats.pageSlug}?theme=dark`} target="_blank" style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>Dark mode →</a>
                    </div>
                  </div>
                )}

                {/* Upgrade CTA */}
                {business.plan === 'free' && (
                  <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', borderRadius: 16, padding: 24, color: '#fff', textAlign: 'center' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 900, margin: '0 0 6px', color: '#fff' }}>Unlock unlimited reviews, daily sync & unlimited fraud flagging</h3>
                    <p style={{ fontSize: 14, color: '#bfdbfe', margin: '0 0 16px' }}>Growth plan — $29/month</p>
                    <a href="/for-businesses#signup" style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 800, padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>Upgrade →</a>
                  </div>
                )}
              </>
            )}

            {/* ── REVIEWS TAB ── */}
            {tab === 'reviews' && (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>All Reviews</h2>
                  {plan === 'free' && (
                    <span style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>
                      {disputedCount}/{3} disputes used (Free)
                    </span>
                  )}
                </div>

                {/* Active reviews */}
                {activeReviews.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>
                      Visible on your page ({activeReviews.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {activeReviews.map((review, i) => (
                        <div key={review.id} style={{ padding: '14px 0', borderBottom: i < activeReviews.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{review.author_name || 'Anonymous'}</span>
                                <Stars rating={review.rating} />
                                <SourceBadge source={review.source} />
                                <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>{monthsAgo(review.time_published)}</span>
                              </div>
                              {review.text && (
                                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                                  {review.text}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => setFlagTarget(review)}
                              title="Flag as fraudulent"
                              style={{ flexShrink: 0, background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13, color: '#9ca3af', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              🚩 Flag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disputed reviews */}
                {disputedReviews.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>
                      Disputed — Hidden from public ({disputedReviews.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {disputedReviews.map((review, i) => (
                        <div key={review.id} style={{ padding: '14px 0', borderBottom: i < disputedReviews.length - 1 ? '1px solid #fef2f2' : 'none', opacity: 0.7 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 14, color: '#6b7280' }}>{review.author_name || 'Anonymous'}</span>
                                <Stars rating={review.rating} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fee2e2', borderRadius: 6, padding: '2px 7px' }}>Disputed</span>
                                <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>{monthsAgo(review.time_published)}</span>
                              </div>
                              {review.text && (
                                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>{review.text.slice(0, 120)}…</p>
                              )}
                              {review.dispute_reason && (
                                <p style={{ fontSize: 12, color: '#b45309', margin: '4px 0 0', fontStyle: 'italic' }}>Your note: {review.dispute_reason}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleUnflag(review.id)}
                              style={{ flexShrink: 0, background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
                              Restore
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reviews.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 14 }}>
                    No reviews found yet. Reviews sync daily.
                  </div>
                )}
              </div>
            )}

            <button onClick={() => { setBusiness(null); setReviews([]); setSources([]); setStats(null); setSent(false); localStorage.removeItem('rr_business_email') }}
              style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
              ← Switch account
            </button>
          </div>
        )}
      </div>

      {/* Flag modal */}
      {flagTarget && business && (
        <FlagModal
          review={flagTarget}
          email={business.email}
          plan={plan}
          disputedCount={disputedCount}
          onClose={() => setFlagTarget(null)}
          onSuccess={handleFlagSuccess}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
