import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RecentRatings vs Yelp — Stop Paying for Ads That Don\'t Fix Your Reviews',
  description:
    'Yelp charges $300–600/mo for ads. RecentRatings charges $29.99/mo and actually shows your verified buyer reviews — not ads that come with strings attached.',
  openGraph: {
    title: 'RecentRatings vs Yelp — Stop Paying for Ads That Don\'t Fix Your Reviews',
    description:
      'Yelp charges $300–600/mo for ads. RecentRatings charges $29.99/mo and actually shows your verified buyer reviews.',
    url: 'https://recentratings.com/vs/yelp',
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
      name: 'Why should I use RecentRatings instead of Yelp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yelp charges $300–600/mo in ads, yet you still can\'t control who reviews you — anyone can leave a review on Yelp, verified buyer or not. RecentRatings is $29.99/mo and shows only verified buyer reviews from platforms like Yotpo, Judge.me, and Stamped. You get credibility without the ad spend.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does RecentRatings protect against fake reviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. RecentRatings only displays verified buyer reviews — reviews confirmed by your existing Yotpo, Judge.me, or Stamped data. We also include a fraud dispute system so you can flag and hide suspicious reviews. Yelp has no such system; any account can review your business.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I still appear on Yelp if I use RecentRatings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. RecentRatings is a separate platform that complements your Yelp presence. Many businesses use both — RecentRatings to showcase verified buyer reviews, and Yelp for local discovery. The difference is you control your narrative on RecentRatings without paying for ads.',
      },
    },
  ],
}

const rows: { feature: string; us: string; them: string; usGood?: boolean; themGood?: boolean }[] = [
  {
    feature: 'Monthly price',
    us: '$29.99/mo',
    them: '$300–600/mo in ads',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Verified buyer reviews',
    us: '✅ Confirmed purchase required',
    them: '❌ Anyone can review on Yelp',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Fake review protection',
    us: '✅ Fraud dispute system',
    them: '❌ No control over reviewers',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Advertiser conflict of interest',
    us: '✅ None — no pay-to-play',
    them: '❌ Paying businesses get preferential treatment',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Time-filtered ratings',
    us: '✅ Last 30 days, 6 months, 1 year',
    them: '❌ All-time average only',
    usGood: true,
    themGood: false,
  },
  {
    feature: 'Your data, your reviews',
    us: '✅ Your reviews stay yours',
    them: '❌ Yelp owns everything on their platform',
    usGood: true,
    themGood: false,
  },
]

export default function VsYelpPage() {
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
            RECENTRATINGS VS YELP
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
            Yelp: $400/mo in ads.
            <br />
            <span style={{ color: '#93c5fd' }}>Still can&apos;t remove fake reviews.</span>
            <br />
            <span style={{ color: '#bfdbfe', fontSize: 'clamp(20px, 3vw, 36px)' }}>
              There&apos;s a better way.
            </span>
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
            RecentRatings shows only verified buyer reviews — people who actually bought from you.
            No fake reviews. No ad budget required. Just $29.99/mo.
          </p>
          <p style={{ fontSize: 14, color: '#93c5fd', margin: '0 0 36px' }}>
            Cancel anytime. Your reviews stay yours.
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
            RecentRatings vs Yelp — by the numbers
          </h2>
          <p
            style={{
              fontSize: 15,
              color: '#6b7280',
              textAlign: 'center',
              margin: '0 0 40px',
            }}
          >
            Same goal (build trust), very different approach.
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
                    Yelp
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

      {/* WHY BUSINESSES ARE LEAVING YELP */}
      <section
        style={{
          background: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          padding: '72px 24px',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(22px, 3vw, 34px)',
              fontWeight: 900,
              color: '#111827',
              margin: '0 0 12px',
            }}
          >
            Why businesses are leaving Yelp
          </h2>
          <p
            style={{
              fontSize: 15,
              color: '#6b7280',
              margin: '0 0 40px',
              lineHeight: 1.6,
            }}
          >
            The ad spend never ends — and it doesn&apos;t solve the fake review problem.
          </p>
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
                title: 'Ad bills that never stop',
                body: 'Yelp ads average $300–600/mo for most small businesses. Stop paying and your visibility collapses. There\'s no building equity — just renting attention.',
              },
              {
                icon: '👻',
                title: 'Fake reviews with no recourse',
                body: 'Yelp allows any account to review you. Competitors, disgruntled strangers, bots. Yelp\'s moderation is inconsistent and you have no dispute mechanism.',
              },
              {
                icon: '🎯',
                title: 'Pay-to-play algorithm',
                body: 'Businesses that pay for ads get featured placement. Non-advertisers get suppressed — even when their ratings are better. That\'s not a review platform, it\'s a protection racket.',
              },
              {
                icon: '🧊',
                title: 'Stale all-time averages',
                body: 'That 3.8-star average includes reviews from a decade ago. RecentRatings shows how you\'re rated right now — last 30 days, 6 months, or 1 year.',
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#fff',
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
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SWITCH CTA */}
      <section
        style={{
          background: '#eff6ff',
          border: '2px solid #bfdbfe',
          borderRadius: 24,
          margin: '72px 24px',
          maxWidth: 820,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '48px 36px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
        <h2
          style={{
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: 900,
            color: '#1e40af',
            margin: '0 0 16px',
          }}
        >
          Own your review story — stop renting it from Yelp
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
          Connect your existing Yotpo, Judge.me, or Stamped account. We pull in your verified
          buyer reviews automatically and build you a neutral, credible profile you actually own.
        </p>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 32px' }}>
          Takes 5 minutes. No credit card required to start.
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
          Get Started for $29.99/mo →
        </a>
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
            Stop paying Yelp for ads that don&apos;t work.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: '#bfdbfe',
              margin: '0 0 36px',
              lineHeight: 1.7,
            }}
          >
            Get verified buyer reviews on a platform you control — for less than a tank of gas.
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
