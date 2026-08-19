# Billing Setup — RecentRatings

## 1. Supabase — Run this SQL in the SQL Editor

Go to: https://supabase.com/dashboard/project/zqmepfdghljknyojfsmq/sql

### Dispute columns on reviews_cache (add first — needed for flag/hide feature)

```sql
ALTER TABLE reviews_cache ADD COLUMN IF NOT EXISTS disputed boolean DEFAULT false;
ALTER TABLE reviews_cache ADD COLUMN IF NOT EXISTS disputed_at timestamptz;
ALTER TABLE reviews_cache ADD COLUMN IF NOT EXISTS disputed_by text;
ALTER TABLE reviews_cache ADD COLUMN IF NOT EXISTS dispute_reason text;

CREATE INDEX IF NOT EXISTS reviews_cache_disputed_idx ON reviews_cache(disputed);
```

### Business tables (for subscription + dashboard)

---

## 1. Supabase — Run this SQL in the SQL Editor (ORIGINAL)

Go to: https://supabase.com/dashboard/project/zqmepfdghljknyojfsmq/sql

```sql
-- Businesses table (one row per signed-up business)
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text NOT NULL,                -- business website domain (e.g. bartact.com)
  email text NOT NULL UNIQUE,          -- must match domain (e.g. @bartact.com)
  plan text NOT NULL DEFAULT 'free',   -- 'free' | 'growth' | 'pro'
  verified boolean NOT NULL DEFAULT false, -- true once email/domain verified
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now()
);

-- Review sources (platforms connected per business)
CREATE TABLE IF NOT EXISTS business_review_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform text NOT NULL,            -- 'yotpo' | 'judgeme' | 'stamped' | 'csv'
  api_key text,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS businesses_email_idx ON businesses(email);
CREATE INDEX IF NOT EXISTS business_review_sources_business_idx ON business_review_sources(business_id);
```

## 2. Stripe — Create Products + Prices

Go to: https://dashboard.stripe.com/products

Create two products:

**Product 1: RecentRatings Growth**
- Price: $29.00 USD / month (recurring)
- Copy the Price ID (starts with `price_...`)

**Product 2: RecentRatings Pro**
- Price: $99.00 USD / month (recurring)
- Copy the Price ID

## 3. Vercel — Add Environment Variables

Go to: https://vercel.com/skip-at-ip/recentratings/settings/environment-variables

Add:
```
STRIPE_SECRET_KEY=sk_live_...        (from Stripe Dashboard → Developers → API Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...      (from Stripe → Webhooks, after adding webhook endpoint)
STRIPE_PRICE_GROWTH=price_...        (from step 2 above)
STRIPE_PRICE_PRO=price_...           (from step 2 above)
NEXT_PUBLIC_BASE_URL=https://recentratings.com
```

## 4. Stripe Webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://recentratings.com/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` above.

## 5. Bartact as First Business

Once tables are created, run:
```sql
INSERT INTO businesses (name, domain, email, plan)
VALUES ('Bartact', 'bartact.com', 'mitch@bartact.com', 'growth');

-- Then get the business id and insert the source:
INSERT INTO business_review_sources (business_id, platform, api_key, last_synced_at)
VALUES ('<bartact-business-id>', 'yotpo', 'JT8p4aJ5LZo8BqCie5b1vLV6wpdRAxCamvSui0vQ', now());
```

## Pages Built
- `/for-businesses` — landing page with pricing + signup form
- `/dashboard` — business dashboard (email lookup)
- `/api/business/signup` — handles signup form POST
- `/api/business/dashboard` — dashboard data GET
- `/api/stripe/checkout` — creates Stripe checkout session
- `/api/stripe/webhook` — handles Stripe events (plan changes, cancellations)
