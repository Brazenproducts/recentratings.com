import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — RecentRatings',
  description: 'Terms governing use of RecentRatings.com — data sourcing, review display, business subscriptions, and acceptable use policies.',
  alternates: { canonical: 'https://recentratings.com/terms' },
}

export default function TermsPage() {
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
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 48px' }}>Effective date: August 2026</p>

        <Section title="1. Service Description">
          <p>
            RecentRatings.com (&quot;RecentRatings,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a review aggregation platform that collects and displays business ratings and reviews from third-party sources including Google, Yelp, Yotpo, Judge.me, Stamped, and other platforms. We display this information to help consumers make informed decisions and to help businesses showcase their verified buyer reviews in a neutral, third-party context.
          </p>
          <p>
            By accessing or using RecentRatings, you agree to these Terms of Service. If you do not agree, do not use the service.
          </p>
        </Section>

        <Section title="2. User Responsibilities">
          <p>When using RecentRatings, you agree to:</p>
          <ul>
            <li>Use the service only for lawful purposes.</li>
            <li>Not attempt to scrape, copy, or reproduce our aggregated data in bulk without written permission.</li>
            <li>Not attempt to manipulate, falsify, or misrepresent review data on the platform.</li>
            <li>Not submit false or misleading information during business signup.</li>
            <li>Not use the service to harass, defame, or harm any business or individual.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate access to RecentRatings for any user or business that violates these terms.
          </p>
        </Section>

        <Section title="3. No Guarantee of Review Accuracy">
          <p>
            RecentRatings aggregates review data from third-party platforms. We display this data as-is and do not independently verify the authenticity, accuracy, or completeness of any individual review. We make no warranty or representation that:
          </p>
          <ul>
            <li>Any review displayed on the platform is genuine or reflects an actual customer experience.</li>
            <li>Ratings are free from manipulation, error, or bias on the originating platform.</li>
            <li>Our aggregated ratings will match ratings shown directly on third-party platforms at any given time.</li>
          </ul>
          <p>
            RecentRatings provides a time-filtered view of available data as a convenience and should not be relied upon as the sole basis for any business or purchasing decision.
          </p>
        </Section>

        <Section title="4. Business Subscriber Terms">
          <p><strong>4.1 Eligibility.</strong> Business plans are available to verified business owners or authorized representatives. By signing up, you represent that you have authority to act on behalf of the business.</p>

          <p style={{ marginTop: 14 }}><strong>4.2 Payment.</strong> Paid plans are billed monthly or annually as selected at signup. All fees are in USD. Payment is processed by Stripe. You authorize RecentRatings to charge your payment method on a recurring basis until you cancel.</p>

          <p style={{ marginTop: 14 }}><strong>4.3 Cancellation.</strong> You may cancel your subscription at any time from your account dashboard or by contacting <a href="mailto:hello@recentratings.com" style={{ color: '#1e40af' }}>hello@recentratings.com</a>. Cancellations take effect at the end of the current billing period. No partial refunds are issued for unused time, except where required by law.</p>

          <p style={{ marginTop: 14 }}><strong>4.4 Plan Changes.</strong> You may upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades take effect at the next billing cycle.</p>

          <p style={{ marginTop: 14 }}><strong>4.5 Founding Member Rate.</strong> Founding Member pricing is locked at the rate in effect at signup for as long as the subscription remains active and in good standing. If a Founding Member subscription lapses, standard pricing applies upon reactivation.</p>
        </Section>

        <Section title="5. Fraud Dispute Feature">
          <p>
            Business subscribers on eligible plans may access the Fraud Dispute feature, which allows them to flag reviews they believe are fraudulent or fake for review by RecentRatings.
          </p>
          <p>
            <strong>By submitting a fraud dispute claim, the business takes full legal and factual responsibility for that claim.</strong> You represent and warrant that:
          </p>
          <ul>
            <li>The review you are disputing is, to the best of your knowledge, fraudulent, fabricated, or submitted by someone who is not a verified customer.</li>
            <li>You are not submitting disputes to suppress legitimate negative reviews from actual customers.</li>
            <li>Your dispute claim is made in good faith and is not intended to deceive or mislead RecentRatings or any third party.</li>
          </ul>
          <p>
            RecentRatings may investigate disputed reviews and, in its sole discretion, hide, flag, or restore reviews based on available evidence. We do not guarantee any particular outcome for a dispute. Misuse of the fraud dispute feature — including filing claims against legitimate reviews — may result in suspension or termination of your account.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content, design, and software comprising the RecentRatings platform is owned by RecentRatings or its licensors. You may not reproduce, distribute, or create derivative works from our platform without written permission.
          </p>
          <p>
            Review content aggregated from third-party platforms remains the property of the originating platform and/or the individual reviewer. RecentRatings does not claim ownership of third-party review content.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            RecentRatings is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components. Use of the service is at your own risk.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, RecentRatings and its affiliates, officers, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — the service. Our total liability for any claim shall not exceed the amount you paid us in the three months preceding the claim.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Riverside County, California.
          </p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>
            We may update these Terms from time to time. Material changes will be communicated to business subscribers via email. Continued use of the service after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these Terms? Contact us at{' '}
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
