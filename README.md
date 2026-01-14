# PropData - Indonesia Property Data API

Professional API platform for Indonesian property listing data.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Scraper**: Python + Selenium (GitHub Actions)
- **Deployment**: Vercel (free tier)

## Features

- REST API for property data access
- User dashboard with API key management
- Authentication with API keys
- Rate limiting per subscription tier
- Data explorer to browse properties
- Admin panel for owner management
- Scheduled scraping (daily via GitHub Actions)
- Analytics endpoint (Pro/Enterprise tier)

## Quick Start

### 1. Setup Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project credentials

### 2. Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Create Owner Account

1. Register via the app at `/register`
2. Go to Supabase SQL Editor and run `supabase/setup-owner.sql`
3. Login and access Admin Panel

### 5. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel dashboard.

Add these environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## API Documentation

### Authentication

Include your API key in the request header:

```
X-API-Key: olx_your_api_key_here
```

### Endpoints

#### GET /api/v1/properties

Get property listings with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| location | string | Filter by location (e.g., "jakarta") |
| mode | string | "jual" (sale) or "sewa" (rent) |
| min_price | number | Minimum price in IDR |
| max_price | number | Maximum price in IDR |
| bedrooms | number | Number of bedrooms |
| limit | number | Results per page (max 100, default 20) |
| offset | number | Pagination offset |

**Example:**
```bash
curl -X GET "https://propdata.vercel.app/api/v1/properties?location=jakarta&mode=jual&limit=10" \
  -H "X-API-Key: olx_xxxxx"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "total": 1234,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  },
  "meta": {
    "requests_remaining": 49,
    "tier": "free"
  }
}
```

#### GET /api/v1/locations

Get list of available locations.

#### GET /api/v1/analytics

Get market statistics (Pro/Enterprise only).

## Pricing Tiers

| Tier | Requests/Month | Price |
|------|----------------|-------|
| Free | 50 | Rp 0 |
| Basic | 500 | Rp 99,000 |
| Pro | 2,000 | Rp 299,000 |
| Enterprise | Unlimited | Custom |

## GitHub Actions Setup (Scraper)

To enable automated daily scraping:

1. **Add Repository Secrets:**
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` - Supabase service role key (from Settings > API)

2. **Enable GitHub Actions:**
   The workflow at `.github/workflows/scrape.yml` runs daily at 2 AM UTC.

3. **Manual Trigger:**
   You can also trigger manually from Actions tab > "Run Scraper" > "Run workflow"

## Project Structure

```
olx/
├── app/
│   ├── api/v1/
│   │   ├── properties/route.ts    # Properties API
│   │   ├── locations/route.ts     # Locations API
│   │   └── analytics/route.ts     # Analytics API
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── api-keys/page.tsx     # API key management
│   │   ├── explorer/page.tsx     # Data explorer
│   │   └── settings/page.tsx     # User settings
│   ├── admin/page.tsx            # Admin panel (owner only)
│   ├── docs/page.tsx             # API documentation
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration page
│   └── page.tsx                  # Landing page
├── lib/
│   ├── supabase.ts               # Supabase client & types
│   └── utils.ts                  # Utility functions
├── supabase/
│   ├── schema.sql                # Database schema
│   └── setup-owner.sql           # Owner account setup
├── scripts/
│   └── scrape_job.py             # Python scraper for GitHub Actions
└── .github/workflows/
    └── scrape.yml                # GitHub Actions workflow
```

## Owner Account

**Email:** amarathuridhaa@gmail.com  
**Password:** Amar130803@

After first login, run `supabase/setup-owner.sql` to activate owner privileges.

## Support

For questions or support, contact: support@propdata.id

## License

MIT License - See LICENSE file for details.

