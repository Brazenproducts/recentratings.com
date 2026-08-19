'use client'
import { useState } from 'react'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    priceNote: 'forever',
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#e5e7eb',
    features: [
      'Claim your RecentRatings page',
      '1 review platform connected',
      'Up to 50 reviews displayed',
      'Google review funnel button',
      'Basic time-filtered ratings',
    ],
    cta: 'Get Started Free',
    planKey: 'free',
  },
  {
    name: 'Growth',
    price: '$29',
    priceNote: '/month',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#3b82f6',
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'Unlimited reviews displayed',
      'Daily auto-sync',
      'Verified Buyer badges',
      'Embed widget for your site',
      'Priority page indexing',
    ],
    cta: 'Start Growth Plan',
    planKey: 'growth',
  },
  {
    name: 'Pro',
    price: '$99',
    priceNote: '/month',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#8b5cf6',
    features: [
      'Everything in Growth',
      'Multi-location support',
      'CSV review import',
      'White-label embed widget',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Start Pro Plan',
    planKey: 'pro',
  },
]

const PLATFORMS = ['Yotpo', 'Judge.me', 'Stamped.io', 'Okendo', 'Trustpilot', 'CSV Upload', 'Other']

export default function ForBusinessesPage() {
  const [form, setForm] = useState({
    businessName: '',
    website: '',
    email: '',
    platform: '',
    selectedPlan: 'growth',
  })
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
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#166534', margin: '0 0 12px' }}>You're on the list!</h1>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 24px' }}>
            We'll be in touch within 24 hours to set up your RecentRatings profile and connect your review platform.
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
            Back to RecentRatings →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 18, color: '#1e40af', textDecoration: 'none' }}>RecentRatings</a>
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
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: '#bfdbfe', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Google has no verified buyer reviews. You do. Display them alongside Google ratings with time-filtered scores — and convert happy customers into Google stars with one tap.
          </p>
          <a href="#signup" style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 900, padding: '16px 36px', borderRadius: 14, textDecoration: 'none', fontSize: 17, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            Claim Your Page — Free →
          </a>
        </div>
      </section>

      {/* DEMO CALLOUT */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Live Example</p>
        <p style={{ fontSize: 16, color: '#111827', fontWeight: 700, margin: '0 0 12px' }}>
          Bartact — Temecula&apos;s premier Jeep accessories brand — is already live with 31 reviews.
        </p>
        <a href="/place/bartact-temecula-ca" target="_blank" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
          View Bartact&apos;s Page →
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111827', textAlign: 'center', margin: '0 0 48px' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {[
            { step: '1', icon: '🏪', title: 'Claim your page', desc: 'Tell us your business name, website, and review platform. We build your RecentRatings profile.' },
            { step: '2', icon: '⭐', title: 'Connect your reviews', desc: 'Paste your Yotpo, Judge.me, or Stamped app key. We pull every verified buyer review automatically.' },
            { step: '3', icon: '📈', title: 'Watch Google ratings rise', desc: 'Your RecentRatings page includes a one-tap "Write a Google Review" button. Happy customers convert.' },
          ].map(item => (
            <div key={item.step} style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ width: 28, height: 28, background: '#1d4ed8', color: '#fff', borderRadius: '50%', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{item.step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY RECENTRATINGS */}
      <section style={{ background: '#f8fafc', padding: '64px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111827', textAlign: 'center', margin: '0 0 12px' }}>The problem with Google reviews</h2>
          <p style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', margin: '0 0 48px', lineHeight: 1.7 }}>
            Anyone can leave a Google review. Competitors, ex-employees, bots. Google can&apos;t verify if the reviewer ever bought anything.
            Your Yotpo reviews can. We put them side by side — and let people decide who to trust.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { label: 'Verified buyer badge', us: '✓ On every review', them: '✗ Not available' },
              { label: 'Time-filtered scores', us: '✓ 90d / 1yr / all-time', them: '✗ All-time only' },
              { label: 'Google review funnel', us: '✓ Built-in CTA button', them: '✗ No outbound CTA' },
              { label: 'Fake review protection', us: '✓ Verified purchase only', them: '✗ Anyone can post' },
            ].map(row => (
              <div key={row.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>{row.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: '#166534', fontWeight: 700, minWidth: 16 }}>RR</span>
                    <span style={{ color: '#166534' }}>{row.us}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: '#6b7280', fontWeight: 700, minWidth: 16 }}>G</span>
                    <span style={{ color: '#9ca3af' }}>{row.them}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111827', textAlign: 'center', margin: '0 0 48px' }}>Simple pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {PLANS.map(plan => (
              <div key={plan.planKey} style={{ background: plan.bg, border: `2px solid ${plan.border}`, borderRadius: 20, padding: 28, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontSize: 16, fontWeight: 800, color: plan.color, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#111827' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>{plan.priceNote}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#374151' }}>
                      <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#signup" onClick={() => setForm(f => ({ ...f, selectedPlan: plan.planKey }))}
                  style={{ display: 'block', textAlign: 'center', background: plan.planKey === 'free' ? 'transparent' : plan.color, color: plan.planKey === 'free' ? plan.color : '#fff', border: `2px solid ${plan.color}`, fontWeight: 800, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNUP FORM */}
      <section id="signup" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', textAlign: 'center', margin: '0 0 8px' }}>Claim your page</h2>
          <p style={{ fontSize: 15, color: '#bfdbfe', textAlign: 'center', margin: '0 0 36px' }}>Takes 2 minutes. We handle the setup.</p>

          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Plan selector */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
              {PLANS.map(p => (
                <button key={p.planKey} type="button"
                  onClick={() => setForm(f => ({ ...f, selectedPlan: p.planKey }))}
                  style={{ flex: 1, padding: '8px 4px', borderRadius: 10, border: `2px solid ${form.selectedPlan === p.planKey ? p.color : '#e5e7eb'}`, background: form.selectedPlan === p.planKey ? p.bg : '#fff', fontWeight: 700, fontSize: 13, color: form.selectedPlan === p.planKey ? p.color : '#9ca3af', cursor: 'pointer' }}>
                  {p.name}
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
                Must match your business domain — e.g. <strong>you@bartact.com</strong> to claim bartact.com.
                This is how we verify you represent this business.
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
              style={{ background: '#1d4ed8', color: '#fff', fontWeight: 900, padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting...' : 'Claim My Page →'}
            </button>

            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
              No credit card required for the Free plan. Cancel anytime.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
          © 2026 RecentRatings · <a href="/" style={{ color: '#6b7280' }}>Home</a> · <a href="/search" style={{ color: '#6b7280' }}>Search</a>
        </p>
      </footer>
    </div>
  )
}
