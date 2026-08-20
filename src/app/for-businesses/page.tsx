'use client'
import { useState } from 'react'

const FOUNDING_SPOTS_LEFT = 47 // update manually as spots fill

const PLANS = [
  {
    name: 'Founding Member',
    price: '$19',
    priceNote: '/mo forever',
    color: '#92400e',
    bg: '#fffbeb',
    border: '#f59e0b',
    badge: '🔥 Only 50 spots',
    urgent: true,
    features: [
      'Everything in Growth — locked in for life',
      'Price never increases',
      'Direct line to the founding team',
      `${FOUNDING_SPOTS_LEFT} spots remaining`,
    ],
    cta: 'Claim Founding Rate',
    planKey: 'founding',
  },
  {
    name: 'Free',
    price: '$0',
    priceNote: 'forever',
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#e5e7eb',
    features: [
      'Claim your RecentRatings page',
      'Google & Yelp aggregate ratings shown',
      'Google review funnel button',
      '3 fraud dispute flags',
      'Up to 25 verified reviews displayed',
    ],
    cta: 'Claim Free Page',
    planKey: 'free',
  },
  {
    name: 'Growth',
    price: '$29',
    priceNote: '/mo',
    annualPrice: '$249',
    annualNote: '/year — 2 months free',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#3b82f6',
    badge: 'Most Popular',
    features: [
      'Connect Yotpo, Judge.me, Stamped & more',
      'Unlimited verified buyer reviews',
      'Daily auto-sync',
      '✓ Verified Buyer badges',
      'Embed widget for your website',
      'Unlimited fraud dispute flags',
      'Priority page indexing',
    ],
    cta: 'Start Growth Plan',
    planKey: 'growth',
  },
  {
    name: 'Pro',
    price: '$99',
    priceNote: '/mo',
    annualPrice: '$990',
    annualNote: '/year — 2 months free',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#8b5cf6',
    features: [
      'Everything in Growth',
      'Multi-location support (up to 10)',
      'White-label widget (no RecentRatings branding)',
      'CSV review import',
      'API access',
      'Priority support',
    ],
    cta: 'Start Pro Plan',
    planKey: 'pro',
  },
]

const PLATFORMS = ['Yotpo', 'Judge.me', 'Stamped.io', 'Okendo', 'Trustpilot', 'CSV Upload', 'Other']

export default function ForBusinessesPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const [form, setForm] = useState({ businessName: '', website: '', email: '', platform: '', selectedPlan: 'growth' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/business/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 48, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#166534', margin: '0 0 12px' }}>You&apos;re in!</h1>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 24px' }}>
            We&apos;ll reach out within 24 hours to set up your page and connect your review platform.
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
            See RecentRatings →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo-square.jpg" alt="RecentRatings" style={{ width: 32, height: 32, borderRadius: 6 }} />
          <span style={{ fontWeight: 900, fontSize: 17, color: '#1e40af' }}>RecentRatings</span>
        </a>
        <a href="#signup" style={{ background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '8px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>Get Started</a>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 700, marginBottom: 20, letterSpacing: 0.5 }}>
            FOR BUSINESSES
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 20px', color: '#fff' }}>
            Your verified buyer reviews.<br />On a neutral third-party platform.
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: '#bfdbfe', lineHeight: 1.7, margin: '0 0 12px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Google has no verified buyer reviews. You do. Display them alongside Google ratings — and convert happy customers into Google stars with one tap.
          </p>
          <p style={{ fontSize: 14, color: '#93c5fd', margin: '0 0 36px' }}>Less than a tank of gas. No salesperson. Cancel anytime.</p>
          <a href="#signup" style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 900, padding: '16px 36px', borderRadius: 14, textDecoration: 'none', fontSize: 17, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            Claim Your Page — Free →
          </a>
        </div>
      </section>

      {/* FOUNDING MEMBER BANNER */}
      <section style={{ background: '#fffbeb', borderTop: '2px solid #f59e0b', borderBottom: '2px solid #f59e0b', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#92400e', fontWeight: 700, margin: 0 }}>
          🔥 Founding Member Rate: <strong>$19/mo for life</strong> — only {FOUNDING_SPOTS_LEFT} of 50 spots remaining.{' '}
          <a href="#signup" style={{ color: '#92400e', textDecoration: 'underline' }}>Lock it in →</a>
        </p>
      </section>

      {/* DEMO */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '28px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Live Demo</p>
        <p style={{ fontSize: 16, color: '#111827', fontWeight: 700, margin: '0 0 12px' }}>
          Bartact — 812 verified buyer reviews · ★4.97 · vs Google&apos;s 2 fake 1-stars they can&apos;t remove
        </p>
        <a href="/place/bartact-temecula-ca" target="_blank" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
          See Bartact&apos;s Page →
        </a>
      </section>

      {/* PRICING */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111827', textAlign: 'center', margin: '0 0 12px' }}>Simple, affordable pricing</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, margin: '0 0 28px' }}>Less than Yelp ads. More effective than anything else.</p>

          {/* Billing toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 12, padding: 4, gap: 4 }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: billing === b ? '#fff' : 'transparent', fontWeight: billing === b ? 800 : 600, fontSize: 14, color: billing === b ? '#111827' : '#6b7280', cursor: 'pointer', boxShadow: billing === b ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                  {b === 'monthly' ? 'Monthly' : 'Annual (save 2 months)'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.planKey} style={{ background: plan.bg, border: `2px solid ${plan.urgent && billing === 'monthly' ? plan.border : plan.border}`, borderRadius: 20, padding: 24, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: plan.urgent ? '#f59e0b' : plan.color, color: plan.urgent ? '#92400e' : '#fff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontSize: 15, fontWeight: 800, color: plan.color, marginBottom: 6 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: '#111827' }}>
                    {billing === 'annual' && plan.annualPrice ? plan.annualPrice : plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    {billing === 'annual' && plan.annualNote ? plan.annualNote : plan.priceNote}
                  </span>
                </div>
                {billing === 'monthly' && plan.annualPrice && (
                  <p style={{ fontSize: 12, color: plan.color, fontWeight: 600, margin: '0 0 12px' }}>
                    Or {plan.annualPrice}/year (2 months free)
                  </p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                      <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#signup" onClick={() => setForm(f => ({ ...f, selectedPlan: plan.planKey }))}
                  style={{ display: 'block', textAlign: 'center', background: plan.planKey === 'free' ? 'transparent' : plan.urgent ? '#f59e0b' : plan.color, color: plan.planKey === 'free' ? plan.color : plan.urgent ? '#92400e' : '#fff', border: `2px solid ${plan.color}`, fontWeight: 800, padding: '11px 20px', borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', textAlign: 'center', margin: '0 0 8px' }}>Claim your page</h2>
          <p style={{ fontSize: 15, color: '#bfdbfe', textAlign: 'center', margin: '0 0 36px' }}>Takes 2 minutes. We handle the setup.</p>

          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Plan selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {PLANS.map(p => (
                <button key={p.planKey} type="button" onClick={() => setForm(f => ({ ...f, selectedPlan: p.planKey }))}
                  style={{ padding: '8px 4px', borderRadius: 10, border: `2px solid ${form.selectedPlan === p.planKey ? p.color : '#e5e7eb'}`, background: form.selectedPlan === p.planKey ? p.bg : '#fff', fontWeight: 700, fontSize: 12, color: form.selectedPlan === p.planKey ? p.color : '#9ca3af', cursor: 'pointer', position: 'relative' }}>
                  {p.urgent && <span style={{ position: 'absolute', top: -7, right: 6, background: '#f59e0b', color: '#92400e', fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 10 }}>🔥</span>}
                  {p.name}
                  {p.planKey !== 'free' && <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>{p.price}{p.priceNote}</div>}
                </button>
              ))}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Business Name *</label>
              <input required value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                placeholder="e.g. Bartact" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Website URL *</label>
              <input required type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="https://yourbusiness.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Business Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@yourbusiness.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 5, marginBottom: 0 }}>
                Must match your business domain — e.g. <strong>you@bartact.com</strong> to claim bartact.com
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Review Platform</label>
              <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                <option value="">Select your platform (optional)</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 14 }}>{error}</div>}

            <button type="submit" disabled={submitting}
              style={{ background: form.selectedPlan === 'founding' ? '#f59e0b' : '#1d4ed8', color: form.selectedPlan === 'founding' ? '#92400e' : '#fff', fontWeight: 900, padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting...' : form.selectedPlan === 'founding' ? '🔥 Lock in Founding Rate →' : 'Claim My Page →'}
            </button>

            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
              No credit card required for Free plan · Cancel anytime
            </p>
          </form>
        </div>
      </section>

      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
          © 2026 RecentRatings · <a href="/" style={{ color: '#6b7280' }}>Home</a> · <a href="/search" style={{ color: '#6b7280' }}>Search</a>
        </p>
      </footer>
    </div>
  )
}
