import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Yotpo Merchants — Show Your Reviews | RecentRatings',
  description: 'Yotpo merchants: show verified buyer reviews + Google ratings on one neutral indexed page. Bartact: 825 reviews at ★ 4.97. Plans from $29.99/mo.',
  keywords: [
    'Yotpo merchant reviews platform',
    'show Yotpo reviews on Google',
    'Yotpo review aggregator',
    'Yotpo reviews visibility',
    'verified buyer reviews third party',
    'Yotpo Google ratings combined',
  ],
  openGraph: {
    title: 'Yotpo Merchants: Your Verified Reviews Deserve More Visibility | RecentRatings',
    description:
      "You've collected hundreds of verified buyer reviews through Yotpo. Most customers never see them. RecentRatings puts them front and center — on a neutral, indexed, shareable page.",
    url: 'https://recentratings.com/for-yotpo-merchants',
    type: 'website',
  },
  alternates: { canonical: 'https://recentratings.com/for-yotpo-merchants' },
}

const FEATURES = [
  {
    icon: '⭐',
    title: 'Yotpo + Google in one place',
    desc: 'Your verified Yotpo reviews appear alongside your Google star rating on a single, neutral, indexed page — no more hiding half your social proof.',
  },
  {
    icon: '📅',
    title: 'Time-filtered scores that actually mean something',
    desc: 'See your rating for the last 90 days, last year, and all-time. Instantly spot trends. Prove you\'re improving — or catch problems early.',
  },
  {
    icon: '🔗',
    title: 'Embed widget for your site',
    desc: 'One line of code. Drop a live, auto-updating reviews widget into your product pages, homepage, or cart. No iframes, no ugly third-party badges.',
  },
  {
    icon: '🛡️',
    title: 'Fraud dispute for fake Google reviews',
    desc: 'Competitors leaving fake 1-stars? Flag suspicious reviews directly from your dashboard. We compile the evidence and escalate the dispute on your behalf.',
  },
]

const STATS = [
  { value: '812', label: 'Yotpo verified reviews' },
  { value: '★4.97', label: 'RecentRatings score' },
  { value: '4.8', label: 'Google all-time average' },
  { value: '4.9', label: 'Last 90 days on Google' },
]

const STEPS = [
  { n: '1', title: 'Paste your Yotpo app key', desc: 'Found in your Yotpo → Account Settings → Store Keys. Takes 10 seconds.' },
  { n: '2', title: 'We sync your reviews', desc: 'RecentRatings pulls your full Yotpo review history and matches it to your Google listing automatically.' },
  { n: '3', title: 'Your page goes live', desc: 'A clean, indexed page with your combined scores, verified badges, and embed widget — live within minutes.' },
]

const FAQS = [
  {
    q: 'Does RecentRatings replace my Yotpo widget on my site?',
    a: 'No — it complements it. Your Yotpo on-site widget stays. RecentRatings gives you a neutral third-party page that customers find via Google search, plus an additional embed widget if you want it.',
  },
  {
    q: 'Will my Yotpo reviews show up in Google search results?',
    a: 'Your RecentRatings page is crawled and indexed by Google. It includes structured review data (Schema.org markup) so your reviews have the best possible chance of appearing in rich results.',
  },
  {
    q: 'What if I use Yotpo Reviews + Yotpo SMS + other Yotpo products?',
    a: 'RecentRatings only connects to Yotpo Reviews (product and/or site reviews). Other Yotpo modules are not affected.',
  },
  {
    q: 'Can I also connect Judge.me, Stamped, or Okendo?',
    a: 'Yes. RecentRatings supports Yotpo, Judge.me, Stamped.io, and Okendo. If you migrate platforms later, your page keeps working.',
  },
  {
    q: 'How is $29.99/mo billed?',
    a: 'Monthly, cancel any time. No contracts, no annual lock-in required. An annual plan ($249/year) is also available — that\'s two months free.',
  },
]

export default function ForYotpoMerchantsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo-square.jpg" alt="RecentRatings" style={{ width: 32, height: 32, borderRadius: 6 }} />
          <span style={{ fontWeight: 900, fontSize: 17, color: '#1e40af' }}>RecentRatings</span>
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/for-businesses" style={{ fontSize: 14, color: '#6b7280', fontWeight: 600, textDecoration: 'none' }}>For Businesses</a>
          <a href="/for-businesses" style={{ background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '8px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)', padding: '80px 24px 72px', color: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 24, padding: '6px 18px', fontSize: 13, fontWeight: 700, marginBottom: 24, letterSpacing: 0.5 }}>
            <span style={{ background: '#f97316', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 900, color: '#fff' }}>YOTPO</span>
            MERCHANTS
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 54px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', color: '#fff', letterSpacing: '-1px' }}>
            Your Verified Reviews<br />Deserve More Visibility
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2.2vw, 20px)', color: '#bfdbfe', lineHeight: 1.7, margin: '0 0 12px', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            You've collected hundreds of verified buyer reviews through Yotpo. Most customers never see them.
            RecentRatings puts them front and center — on a neutral, indexed, shareable page.
          </p>
          <p style={{ fontSize: 14, color: '#93c5fd', margin: '0 0 40px' }}>
            Paste your Yotpo app key. Done in 30 seconds. $29.99/mo.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/for-businesses" style={{
              display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 900,
              padding: '16px 36px', borderRadius: 14, textDecoration: 'none', fontSize: 17,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              Connect Yotpo Now →
            </a>
            <a href="/place/bartact-temecula-ca" target="_blank" rel="noopener" style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.3)', fontWeight: 700,
              padding: '16px 28px', borderRadius: 14, textDecoration: 'none', fontSize: 15,
            }}>
              See Live Demo ↗
            </a>
          </div>
        </div>
      </section>

      {/* DEMO SOCIAL PROOF */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '32px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 20px' }}>
            Live Demo — Bartact (Temecula, CA)
          </p>
          <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 4 }}>Bartact</div>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>Jeep & truck accessories — Temecula, CA</div>
              <a href="/place/bartact-temecula-ca" target="_blank" rel="noopener" style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: 13, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                View Their Page →
              </a>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#1d4ed8', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', margin: '14px 0 0' }}>
            Bartact has 812 Yotpo reviews averaging ★4.97 — but most shoppers only saw their Google listing. Now they see the full picture.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#111827', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            Google doesn't know about your Yotpo reviews. Your customers don't either.
          </h2>
          <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8, margin: '0 0 16px' }}>
            Yotpo reviews live inside your Shopify store widget. They're great for on-site conversion — but they don't
            appear in Google search, they don't build your off-site reputation, and they disappear if a customer bounces
            before scrolling to the product page.
          </p>
          <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
            Meanwhile your Google rating is an all-time average that barely moves — even when you're crushing it lately.
            Shoppers searching <em>"[your brand] reviews"</em> see your Google page, not your 500 verified Yotpo reviews.
          </p>
        </div>
      </section>

      {/* SOLUTION — FEATURES */}
      <section style={{ padding: '0 24px 72px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>
              RecentRatings fixes all of that
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280' }}>One platform. Four things Yotpo can't do alone.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '24px 24px 22px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '64px 24px', background: '#eff6ff', borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 900, color: '#111827', textAlign: 'center', margin: '0 0 40px' }}>
            From Yotpo app key to live page in 30 seconds
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: '#1d4ed8', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 18, flexShrink: 0,
                }}>
                  {step.n}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>
            Simple pricing for Yotpo merchants
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 36px' }}>Everything you need. One flat rate.</p>

          <div style={{ background: '#f0f9ff', border: '2px solid #3b82f6', borderRadius: 24, padding: '36px 32px', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 18px', borderRadius: 20, whiteSpace: 'nowrap' }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1d4ed8', marginBottom: 6 }}>Growth Plan</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#111827', letterSpacing: '-2px' }}>$29.99</span>
              <span style={{ fontSize: 16, color: '#6b7280' }}>/mo</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Connect your Yotpo app key — auto-sync starts immediately',
                'Unlimited verified buyer reviews displayed',
                '✓ Verified Buyer badges on every review',
                'Yotpo + Google ratings on one indexed page',
                'Time-filtered scores (90d / 1yr / all-time)',
                'Embed widget for your website (one line of code)',
                'Fraud dispute: flag and escalate fake Google reviews',
                'Priority page indexing',
                'Cancel any time — no contracts',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#374151' }}>
                  <span style={{ color: '#1d4ed8', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="/for-businesses" style={{
              display: 'block', textAlign: 'center', background: '#1d4ed8', color: '#fff',
              fontWeight: 900, padding: '16px', borderRadius: 14, textDecoration: 'none', fontSize: 16,
              boxShadow: '0 4px 12px rgba(29,78,216,0.25)',
            }}>
              Connect Yotpo — Get Started →
            </a>
            <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', margin: '14px 0 0' }}>
              Or save with annual billing: $249/year (2 months free)
            </p>
          </div>

          <div style={{ marginTop: 20, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 16, padding: '20px 24px', textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#6b7280', marginBottom: 6 }}>Free Plan</div>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>
              Claim your page for free — Google & Yelp ratings shown, up to 25 reviews. Upgrade any time to connect Yotpo.
            </p>
            <a href="/for-businesses" style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>Claim free page →</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 72px', background: '#fff' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#111827', margin: '0 0 32px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ paddingBottom: 24, marginBottom: 24, borderBottom: i < FAQS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 }}>
            Stop hiding your best reviews
          </h2>
          <p style={{ fontSize: 16, color: '#bfdbfe', lineHeight: 1.7, margin: '0 0 36px' }}>
            Your Yotpo reviews are the proof. RecentRatings is the platform.
            Paste your app key and go live in 30 seconds.
          </p>
          <a href="/for-businesses" style={{
            display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 900,
            padding: '18px 44px', borderRadius: 16, textDecoration: 'none', fontSize: 18,
            boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
          }}>
            Connect Yotpo — $29.99/mo →
          </a>
          <p style={{ fontSize: 13, color: '#93c5fd', margin: '16px 0 0' }}>Cancel any time · No credit card for free plan</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px 24px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
          © 2026 RecentRatings ·{' '}
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a> ·{' '}
          <a href="/search" style={{ color: '#6b7280', textDecoration: 'none' }}>Search</a> ·{' '}
          <a href="/for-businesses" style={{ color: '#6b7280', textDecoration: 'none' }}>For Businesses</a> ·{' '}
          <a href="/about" style={{ color: '#6b7280', textDecoration: 'none' }}>About</a> ·{' '}
          <a href="/privacy" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</a>
        </p>
      </footer>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </div>
  )
}
