import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — RecentRatings',
  description: 'Privacy Policy for RecentRatings.com',
}

export default function PrivacyPage() {
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

      {/* CONTENT */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 48px' }}>Effective date: August 2026</p>

        <Section title="Overview">
          <p>
            RecentRatings.com (&quot;RecentRatings,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and protect information when you use our website and services.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p><strong>From visitors:</strong></p>
          <ul>
            <li>Pages viewed, search queries entered on our site, and general usage data (via basic analytics).</li>
            <li>No account is required to browse ratings or search for businesses.</li>
          </ul>
          <p style={{ marginTop: 16 }}><strong>From business subscribers:</strong></p>
          <ul>
            <li>Business name, business website URL, and business email address provided during signup.</li>
            <li>Review platform information you optionally provide (e.g., Yotpo, Judge.me, Stamped).</li>
            <li>Payment information processed securely by Stripe — we do not store card numbers.</li>
          </ul>
          <p style={{ marginTop: 16 }}><strong>Review data:</strong></p>
          <ul>
            <li>We aggregate publicly available review data from platforms such as Google, Yelp, Yotpo, Judge.me, and Stamped. This data is sourced from those platforms and displayed on RecentRatings pages.</li>
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <ul>
            <li>To display aggregated review ratings for businesses on our platform.</li>
            <li>To operate and improve the RecentRatings service.</li>
            <li>To communicate with business subscribers about their accounts, billing, and platform updates.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To detect fraud, abuse, or violations of our Terms of Service.</li>
          </ul>
        </Section>

        <Section title="We Do Not Sell Your Data">
          <p>
            We do not sell, rent, or share your personal information with third parties for their marketing purposes. Period.
          </p>
          <p>
            We may share data with trusted service providers (such as Stripe for payments, and analytics providers) solely to operate the service. These providers are bound by confidentiality obligations and may not use your data for their own purposes.
          </p>
        </Section>

        <Section title="Cookies & Analytics">
          <p>
            We use cookies and similar technologies for basic site analytics — understanding which pages are visited and how people use the site. We do not use advertising cookies or tracking pixels for ad targeting.
          </p>
          <p>
            You may disable cookies in your browser settings. Doing so will not prevent you from using RecentRatings, though some functionality may be affected.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            We retain business account information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us at the address below.
          </p>
          <p>
            Publicly sourced review data (from Google, Yelp, etc.) is retained as part of our rating database and is not considered personal data.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            If you are a business subscriber, you have the right to access, correct, or delete your account information. To exercise these rights, contact us at <a href="mailto:hello@recentratings.com" style={{ color: '#1e40af' }}>hello@recentratings.com</a>.
          </p>
          <p>
            Visitors from California may have additional rights under the California Consumer Privacy Act (CCPA). We do not sell personal data, so the opt-out right does not apply, but you may contact us with any questions.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use industry-standard measures to protect your information, including encrypted connections (HTTPS) and secure payment processing through Stripe. No system is 100% secure, but we take reasonable precautions to safeguard your data.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of RecentRatings after changes are posted constitutes acceptance of the revised policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Reach us at{' '}
            <a href="mailto:hello@recentratings.com" style={{ color: '#1e40af', fontWeight: 600 }}>hello@recentratings.com</a>.
          </p>
        </Section>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e40af', margin: '0 0 14px', paddingBottom: 8, borderBottom: '2px solid #dbeafe' }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  )
}
