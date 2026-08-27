import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About RecentRatings — Why We Exist',
  description: 'RecentRatings shows time-filtered ratings from Google, Yotpo, and verified platforms. See how places are rated recently — not just an all-time average.',
  alternates: { canonical: 'https://recentratings.com/about' },
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo-square.jpg" alt="RecentRatings" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 900, fontSize: 17, color: '#1e40af' }}>RecentRatings</span>
        </a>
        <div style={{ display: 'flex', gap: 20, fontSize: 14, fontWeight: 600 }}>
          <a href="/" style={{ color: '#4b5563', textDecoration: 'none' }}>Home</a>
          <a href="/search" style={{ color: '#4b5563', textDecoration: 'none' }}>Search</a>
          <a href="/for-businesses" style={{ color: '#4b5563', textDecoration: 'none' }}>For Businesses</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <img
            src="/logo-square.jpg"
            alt="RecentRatings"
            style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', marginBottom: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
          />
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 20px', color: '#fff' }}>
            About RecentRatings
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: '#bfdbfe', lineHeight: 1.7, margin: '0 auto', maxWidth: 580 }}>
            A neutral, third-party platform that shows you how businesses are actually rated right now — not just all-time averages from years ago.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* What we are */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: '0 0 16px' }}>What is RecentRatings?</h2>
          <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' }}>
            RecentRatings is a <strong>neutral third-party review aggregation platform</strong>. We pull ratings and reviews from across the web — Google, Yelp, Yotpo, Judge.me, Stamped, and more — and surface them in one place with a critical twist: <strong>time-filtered ratings</strong>.
          </p>
          <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: 0 }}>
            Instead of showing you a single all-time average, we show you how a business is rated in the <strong>last 90 days</strong>, the <strong>last year</strong>, and <strong>all-time</strong>. That&apos;s the difference between a business that used to be great and one that&apos;s great right now.
          </p>
        </div>

        {/* Why we exist */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: '0 0 16px' }}>Why we exist</h2>

          <div style={{ display: 'grid', gap: 20, marginBottom: 24 }}>
            <Card
              icon="⚠️"
              title="Fake reviews are everywhere"
              body="Platforms like Google are flooded with fraudulent one-star attacks and paid five-star reviews. Businesses have virtually no recourse. A handful of fake reviews can tank an otherwise excellent reputation."
            />
            <Card
              icon="🔒"
              title="Verified buyer reviews are buried"
              body="Thousands of businesses have collected hundreds of genuine, verified buyer reviews through Yotpo, Judge.me, Stamped, and similar platforms. Google doesn't show them. Nobody does. They're sitting invisible while fake reviews show up on page one."
            />
            <Card
              icon="📅"
              title="All-time averages lie"
              body="A restaurant that was great in 2019 but fell off a cliff after a management change might still carry a 4.2★ all-time rating. You'd never know. Time-filtered ratings tell a more honest story."
            />
          </div>

          <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: 0 }}>
            We built RecentRatings to fix all three problems at once — giving consumers better signal and giving honest businesses a fighting chance.
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: '0 0 20px' }}>What makes us different</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <Feature
              icon="📊"
              title="Time-filtered ratings"
              body="See ratings from the last 90 days, last year, or all-time. Know if a business is getting better or worse right now."
            />
            <Feature
              icon="✅"
              title="Verified buyer reviews"
              body="We surface verified purchase reviews from Yotpo, Judge.me, Stamped, and more — reviews Google never shows."
            />
            <Feature
              icon="🌐"
              title="Multi-platform aggregation"
              body="Google, Yelp, Yotpo, Judge.me, Stamped — all in one neutral place. No platform bias. Just data."
            />
            <Feature
              icon="🛡️"
              title="Fraud dispute system"
              body="Business subscribers can flag suspected fake reviews for investigation. Transparent, accountable, and fair."
            />
          </div>
        </div>

        {/* Who we are */}
        <div style={{ marginBottom: 56, background: '#f0f9ff', borderRadius: 20, padding: '36px 32px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '0 0 14px' }}>Who we are</h2>
          <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: '0 0 12px' }}>
            RecentRatings is headquartered in <strong>Temecula, California</strong> and was founded in <strong>2026</strong>.
          </p>
          <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, margin: 0 }}>
            We&apos;re an independent company with no ties to Google, Yelp, or any other review platform. We don&apos;t accept paid placements. We don&apos;t sell ads. Our goal is simple: give people accurate, timely, unbiased information about businesses — and give honest businesses a platform they deserve.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>Ready to explore?</h2>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 28px' }}>Search any business to see their time-filtered ratings, or get your business on the platform.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/search" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 800, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontSize: 16 }}>
              Search Businesses →
            </a>
            <a href="/for-businesses" style={{ display: 'inline-block', background: '#fff', color: '#1e40af', fontWeight: 800, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontSize: 16, border: '2px solid #1e40af' }}>
              For Businesses →
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '28px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 6px' }}>
          © {new Date().getFullYear()} RecentRatings.com — Ratings that actually mean something.
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
          <a href="/" style={{ color: '#6b7280', textDecoration: 'none', marginRight: 16 }}>Home</a>
          <a href="/search" style={{ color: '#6b7280', textDecoration: 'none', marginRight: 16 }}>Search</a>
          <a href="/for-businesses" style={{ color: '#6b7280', textDecoration: 'none', marginRight: 16 }}>For Businesses</a>
          <a href="/privacy" style={{ color: '#6b7280', textDecoration: 'none', marginRight: 16 }}>Privacy</a>
          <a href="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</a>
        </p>
      </footer>
    </div>
  )
}

function Card({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '20px 22px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#111827', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.65 }}>{body}</div>
      </div>
    </div>
  )
}

function Feature({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '22px 20px' }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 15, color: '#111827', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.65 }}>{body}</div>
    </div>
  )
}
