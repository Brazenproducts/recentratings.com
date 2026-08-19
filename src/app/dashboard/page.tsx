'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Business {
  id: string
  name: string
  domain: string
  email: string
  plan: string
  stripe_customer_id?: string
  created_at: string
}

interface ReviewSource {
  id: string
  platform: string
  api_key?: string
  last_synced_at?: string
}

interface Stats {
  reviewCount: number
  avgRating: number
  pageSlug?: string
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [business, setBusiness] = useState<Business | null>(null)
  const [sources, setSources] = useState<ReviewSource[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-show success message after Stripe checkout
  const sessionId = searchParams.get('session_id')

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/business/dashboard?email=${encodeURIComponent(lookupEmail)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Not found')
      setBusiness(data.business)
      setSources(data.sources || [])
      setStats(data.stats || null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    free: { label: 'Free', color: '#6b7280', bg: '#f3f4f6' },
    growth: { label: 'Growth — $29/mo', color: '#1d4ed8', bg: '#eff6ff' },
    pro: { label: 'Pro — $99/mo', color: '#7c3aed', bg: '#faf5ff' },
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 18, color: '#1e40af', textDecoration: 'none' }}>RecentRatings</a>
        <span style={{ color: '#d1d5db' }}>›</span>
        <span style={{ fontWeight: 600, color: '#374151' }}>Business Dashboard</span>
      </nav>

      <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px' }}>

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
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: 40, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>Business Dashboard</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px' }}>Enter your business email to access your dashboard.</p>
            <form onSubmit={lookup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="email" required placeholder="your@business.com"
                value={lookupEmail} onChange={e => setLookupEmail(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none' }}
              />
              {error && <div style={{ color: '#dc2626', fontSize: 14 }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ background: '#1d4ed8', color: '#fff', fontWeight: 800, padding: '12px', borderRadius: 12, border: 'none', fontSize: 15, cursor: 'pointer' }}>
                {loading ? 'Looking up...' : 'Access Dashboard →'}
              </button>
            </form>
            <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 20 }}>
              Don&apos;t have an account? <a href="/for-businesses" style={{ color: '#1d4ed8', fontWeight: 700 }}>Get started free →</a>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Business header */}
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>{business.name}</h1>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>{business.domain} · {business.email}</div>
                </div>
                <div style={{ background: PLAN_LABELS[business.plan]?.bg || '#f3f4f6', color: PLAN_LABELS[business.plan]?.color || '#6b7280', fontWeight: 800, fontSize: 13, padding: '6px 14px', borderRadius: 20 }}>
                  {PLAN_LABELS[business.plan]?.label || business.plan}
                </div>
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Total Reviews', value: stats.reviewCount.toLocaleString(), icon: '⭐' },
                  { label: 'Average Rating', value: stats.avgRating ? `★${stats.avgRating.toFixed(1)}` : '—', icon: '📊' },
                  { label: 'Page Status', value: stats.pageSlug ? 'Live ✓' : 'Pending', icon: '🌐' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 2 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Your RecentRatings page */}
            {stats?.pageSlug && (
              <div style={{ background: '#eff6ff', borderRadius: 16, border: '1px solid #bfdbfe', padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>Your RecentRatings page</div>
                <a href={`/place/${stats.pageSlug}`} target="_blank"
                  style={{ fontSize: 15, color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                  recentratings.com/place/{stats.pageSlug} →
                </a>
              </div>
            )}

            {/* Connected platforms */}
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Connected Platforms</h2>
              {sources.length === 0 ? (
                <div style={{ fontSize: 14, color: '#9ca3af', padding: '20px 0', textAlign: 'center' }}>
                  No platforms connected yet.{' '}
                  <a href="mailto:hello@recentratings.com" style={{ color: '#1d4ed8', fontWeight: 700 }}>Contact us to connect yours →</a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sources.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', textTransform: 'capitalize' }}>{s.platform.replace(/_/g, '.')}</div>
                        {s.last_synced_at && <div style={{ fontSize: 12, color: '#9ca3af' }}>Last synced: {new Date(s.last_synced_at).toLocaleDateString()}</div>}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: 8 }}>Connected ✓</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade CTA for free plan */}
            {business.plan === 'free' && (
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', borderRadius: 20, padding: 28, color: '#fff', textAlign: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px', color: '#fff' }}>Unlock unlimited reviews & daily sync</h3>
                <p style={{ fontSize: 14, color: '#bfdbfe', margin: '0 0 20px' }}>Upgrade to Growth for $29/month</p>
                <a href="/for-businesses#signup"
                  style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 800, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
                  Upgrade Now →
                </a>
              </div>
            )}

            <button onClick={() => { setBusiness(null); setSources([]); setStats(null) }}
              style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
              ← Switch account
            </button>
          </div>
        )}
      </div>
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
