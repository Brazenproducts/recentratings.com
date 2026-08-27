import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RecentRatings vs Trustpilot — The Smarter Alternative',
  description: 'RecentRatings vs Trustpilot: verified reviews at 90% less cost. $29.99/mo vs $299/mo. We surface your existing Yotpo reviews — no new workflow.',
  alternates: { canonical: 'https://recentratings.com/vs/trustpilot' },
  openGraph: {
    title: 'RecentRatings vs Trustpilot — The Smarter Alternative',
    description:
      'Same verified reviews at 90% less cost. $29.99/mo vs $299/mo.',
    url: 'https://recentratings.com/vs/trustpilot',
    siteName: 'RecentRatings',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is RecentRatings different from Trustpilot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'RecentRatings costs $29.99/mo vs Trustpilot\'s $299–$319/mo. More importantly, RecentRatings connects to reviews you already have on Yotpo, Judge.me, Stamped, and other platforms — no new review invites required. Trustpilot requires you to invite 100–300 customers per month to build a profile that disappears the moment you cancel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch from Trustpilot to RecentRatings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. If you already use Yotpo, Judge.me, or Stamped, you can switch in about 5 minutes. Paste your API key, we sync your existing verified buyer reviews automatically. Your reviews already exist — you just need a better place to show them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does RecentRatings lock me into an annual contract?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'No. RecentRatings is cancel-anytime. Trustpilot typically requires an annual contract, and your profile degrades in visibility if you cancel. With RecentRatings your reviews stay yours — we never hold them hostage.',
      },
    },
  ],
}

const rows: { feature: string; us: string; them: string; usGood?: boolean; themGood?: boolean }[] = [
  { feature: 'Monthly price', us: '$29.99/mo', them: '$299–$319/mo', usGood: true, themGood: false },
  {
    feature: 'Review sources',
    us: 'Yotpo, Judge.me, Stamped, Google, Yelp',
    them: 'Trustpilot only',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Review invites required',
    us: '✅ No — use reviews you already have',
    them: '❌ Yes, 100–300 invites/mo',
    usGood: true,
    themGood: false,
  },
  { feature: 'Time-filtered ratings', us: '✅ Yes', them: '❌ No', usGood: true, themGood: false },
  { feature: 'Verified Buyer badge', us: '✅ Yes', them: '✅ Yes', usGood: true, themGood: true },
  {
    feature: 'Cancel anytime',
    us: '✅ Yes — no contract',
    them: '❌ Annual contract required',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Walled garden',
    us: '✅ No — your reviews stay yours',
    them: '❌ Profile degrades if you cancel',
    usGood: true,
    themGood: false,
  },
]

export default function VsTrustpilotPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
          padding: '72px 24px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
              letterSpacing: 0.5,
            }}
          >
            RECENTRATINGS VS TRUSTPILOT
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 20px',
              color: '#fff',
            }}
          >
            Trustpilot charges $299/mo.
            <br />
            <span style={{ color: '#93c5fd' }}>We charge $29.99.</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 19px)',
              color: '#bfdbfe',
              lineHeight: 1.7,
              margin: '0 0 12px',
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Same verified buyer reviews. 90% less cost. No invites required — we use the reviews you
            already have on Yotpo, Judge.me, and Stamped.
          </p>
          <p style={{ fontSize: 14, color: '#93c5fd', margin: '0 0 36px' }}>
            No annual contract. Cancel anytime.
          </p>
          <a
            href="/for-businesses"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#1e40af',
              fontWeight: 900,
              padding: '16px 36px',
              borderRadius: 14,
              textDecoration: 'none',
              fontSize: 17,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            Get Started — $29.99/mo →
          </a>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(22px, 3vw, 34px)',
              fontWeight: 900,
              color: '#111827',
              textAlign: 'center',
              margin: '0 0 8px',
            }}
          >
            Side-by-side comparison
          </h2>
          <p
            style={{
              fontSize: 15,
              color: '#6b7280',
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            See exactly why 9 in 10 businesses switching from Trustpilot don&apos;t look back.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      background: '#f9fafb',
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#6b7280',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      background: '#eff6ff',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#1e40af',
                      borderBottom: '2px solid #3b82f6',
                    }}
                  >
                    ⭐ RecentRatings
                  </th>
                  <th
                    style={{
                      background: '#f9fafb',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    Trustpilot
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td
                      style={{
                        padding: '14px 20px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        fontSize: 14,
                        fontWeight: 700,
                        color: row.usGood ? '#166534' : '#991b1b',
                        textAlign: 'center',
                        borderBottom: '1px solid #e5e7eb',
                        background: i % 2 === 0 ? '#f0fdf4' : '#dcfce7',
                      }}
                    >
                      {row.us}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: row.themGood ? '#166534' : '#9ca3af',
                        textAlign: 'center',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {row.them}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SWITCH SECTION */}
      <section
        style={{
          background: '#eff6ff',
          border: '2px solid #bfdbfe',
          borderRadius: 24,
          margin: '0 24px 72px',
          maxWidth: 820,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '48px 36px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
        <h2
          style={{
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: 900,
            color: '#1e40af',
            margin: '0 0 16px',
          }}
        >
          Already using Trustpilot? Switch in 5 minutes.
        </h2>
        <p
          style={{
            fontSize: 16,
            color: '#374151',
            lineHeight: 1.7,
            margin: '0 0 12px',
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Paste your Yotpo, Judge.me, or Stamped API key — we sync all your existing verified buyer
          reviews automatically. No new invites. No migration headaches.
        </p>
        <p
          style={{
            fontSize: 14,
            color: '#6b7280',
            margin: '0 0 32px',
          }}
        >
          Your reviews already exist. You just need a better place to show them.
        </p>
        <a
          href="/for-businesses"
          style={{
            display: 'inline-block',
            background: '#1d4ed8',
            color: '#fff',
            fontWeight: 900,
            padding: '14px 32px',
            borderRadius: 12,
            textDecoration: 'none',
            fontSize: 16,
          }}
        >
          Start Free — Switch from Trustpilot →
        </a>
      </section>

      {/* WHY NOT TRUSTPILOT */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 30px)',
              fontWeight: 900,
              color: '#111827',
              margin: '0 0 32px',
            }}
          >
            Why businesses leave Trustpilot
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {[
              {
                icon: '💸',
                title: 'The price shock',
                body: 'Trustpilot&apos;s cheapest paid plan starts at $299/mo. That&apos;s $3,588/year before you&apos;ve seen a single extra review.',
              },
              {
                icon: '🔒',
                title: 'Walled-garden trap',
                body: 'Cancel Trustpilot and your profile&apos;s search visibility drops. You&apos;ve been building their platform, not yours.',
              },
              {
                icon: '📬',
                title: 'Invite treadmill',
                body: 'Trustpilot requires 100–300 invite emails per month to maintain momentum. We use reviews you already collected.',
              },
              {
                icon: '🧊',
                title: 'No time filtering',
                body: 'A 4.2-star rating from five years ago looks the same as a 4.9 rating from last month. RecentRatings shows recency.',
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#f9fafb',
                  borderRadius: 16,
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#111827',
                    margin: '0 0 8px',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: card.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          background: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          padding: '72px 24px',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 900,
              color: '#111827',
              margin: '0 0 40px',
              textAlign: 'center',
            }}
          >
            Frequently asked questions
          </h2>
          {faqSchema.mainEntity.map((faq) => (
            <div
              key={faq.name}
              style={{
                marginBottom: 28,
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: 28,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: '#111827',
                  margin: '0 0 10px',
                }}
              >
                {faq.name}
              </h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                {faq.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
          padding: '72px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(22px, 3vw, 36px)',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 16px',
            }}
          >
            Stop paying $299/mo for Trustpilot.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: '#bfdbfe',
              margin: '0 0 36px',
              lineHeight: 1.7,
            }}
          >
            Get the same verified buyer credibility at 90% less cost. Cancel anytime.
          </p>
          <a
            href="/for-businesses"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#1e40af',
              fontWeight: 900,
              padding: '16px 36px',
              borderRadius: 14,
              textDecoration: 'none',
              fontSize: 17,
            }}
          >
            Switch to RecentRatings — $29.99/mo →
          </a>
          <p style={{ fontSize: 13, color: '#93c5fd', marginTop: 16 }}>
            No credit card required to start · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
