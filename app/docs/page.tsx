import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Code,
  Key,
  Database,
  Filter,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Copy,
} from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/properties",
    description: "Get a list of properties with optional filters",
    auth: true,
    params: [
      { name: "location", type: "string", description: "Filter by location (e.g., 'jakarta', 'bandung')" },
      { name: "mode", type: "string", description: "'jual' for sale, 'sewa' for rent" },
      { name: "min_price", type: "number", description: "Minimum price in IDR" },
      { name: "max_price", type: "number", description: "Maximum price in IDR" },
      { name: "bedrooms", type: "number", description: "Number of bedrooms" },
      { name: "limit", type: "number", description: "Number of results (max 100, default 20)" },
      { name: "offset", type: "number", description: "Pagination offset" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/locations",
    description: "Get list of available locations",
    auth: false,
    params: [
      { name: "region", type: "string", description: "Filter by region (e.g., 'Jakarta', 'Banten')" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/analytics",
    description: "Get market analytics and statistics (Pro/Enterprise only)",
    auth: true,
    params: [],
  },
];

const responseExample = `{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Rumah Mewah di Menteng",
        "url": "https://olx.co.id/item/...",
        "price": "Rp 15.000.000.000",
        "price_numeric": 15000000000,
        "bedrooms": 5,
        "bathrooms": 4,
        "building_area": 500,
        "location": "Jakarta Pusat",
        "posting_date": "15/01/2026",
        "image_url": "https://...",
        "mode": "jual",
        "created_at": "2026-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 1234,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  },
  "meta": {
    "requests_remaining": 49,
    "tier": "free"
  }
}`;

const errorCodes = [
  { code: 200, status: "OK", description: "Request successful" },
  { code: 400, status: "Bad Request", description: "Invalid parameters" },
  { code: 401, status: "Unauthorized", description: "Missing or invalid API key" },
  { code: 403, status: "Forbidden", description: "Insufficient permissions (tier upgrade required)" },
  { code: 429, status: "Too Many Requests", description: "Rate limit exceeded" },
  { code: 500, status: "Server Error", description: "Internal server error" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-semibold">PropData</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="btn btn-ghost text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link href="/dashboard" className="btn btn-primary text-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <a href="#getting-started" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                Getting Started
              </a>
              <a href="#authentication" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                Authentication
              </a>
              <a href="#endpoints" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                API Endpoints
              </a>
              <a href="#response-format" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                Response Format
              </a>
              <a href="#error-codes" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                Error Codes
              </a>
              <a href="#rate-limits" className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--muted)]">
                Rate Limits
              </a>
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">API Documentation</h1>
            <p className="mb-12 text-lg text-[var(--muted-foreground)]">
              Complete guide to using the PropData API
            </p>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16">
              <h2 className="mb-4 text-2xl font-bold">Getting Started</h2>
              <p className="mb-4 text-[var(--muted-foreground)]">
                The PropData API provides access to Indonesian property listing data. 
                Follow these steps to get started:
              </p>
              <ol className="mb-6 list-decimal space-y-2 pl-6 text-[var(--muted-foreground)]">
                <li>Create an account at <Link href="/register" className="text-[var(--accent)] hover:underline">propdata.vercel.app/register</Link></li>
                <li>Get your API key from the dashboard</li>
                <li>Include the API key in your request headers</li>
                <li>Start making API requests</li>
              </ol>

              <div className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <Code className="h-4 w-4" />
                  <span className="text-sm font-medium">Quick Example</span>
                </div>
                <pre className="overflow-x-auto p-4 text-sm">
                  <code className="font-mono text-[var(--muted-foreground)]">{`curl -X GET "https://propdata.vercel.app/api/v1/properties?location=jakarta&limit=10" \\
  -H "X-API-Key: YOUR_API_KEY"`}</code>
                </pre>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16">
              <h2 className="mb-4 text-2xl font-bold flex items-center gap-2">
                <Key className="h-6 w-6" />
                Authentication
              </h2>
              <p className="mb-4 text-[var(--muted-foreground)]">
                All API requests require authentication using an API key. Include your API key 
                in the request header:
              </p>
              <div className="card p-4">
                <code className="font-mono text-sm">X-API-Key: your_api_key_here</code>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
                <p className="text-sm text-yellow-600">
                  Keep your API key secure. Never expose it in client-side code or public repositories.
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints" className="mb-16">
              <h2 className="mb-4 text-2xl font-bold flex items-center gap-2">
                <Database className="h-6 w-6" />
                API Endpoints
              </h2>

              <div className="space-y-8">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.path} className="card overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                      {endpoint.auth && (
                        <span className="ml-auto flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Key className="h-3 w-3" />
                          Auth required
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="mb-4 text-[var(--muted-foreground)]">{endpoint.description}</p>
                      
                      {endpoint.params.length > 0 && (
                        <>
                          <h4 className="mb-2 font-semibold flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Parameters
                          </h4>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.params.map((param) => (
                                <tr key={param.name}>
                                  <td><code className="text-sm">{param.name}</code></td>
                                  <td><span className="badge badge-secondary">{param.type}</span></td>
                                  <td className="text-[var(--muted-foreground)]">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Response Format */}
            <section id="response-format" className="mb-16">
              <h2 className="mb-4 text-2xl font-bold">Response Format</h2>
              <p className="mb-4 text-[var(--muted-foreground)]">
                All responses are returned in JSON format with the following structure:
              </p>
              <div className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                  <span className="text-sm font-medium">Example Response</span>
                </div>
                <pre className="overflow-x-auto p-4 text-sm">
                  <code className="font-mono text-[var(--muted-foreground)]">{responseExample}</code>
                </pre>
              </div>
            </section>

            {/* Error Codes */}
            <section id="error-codes" className="mb-16">
              <h2 className="mb-4 text-2xl font-bold">Error Codes</h2>
              <div className="card overflow-hidden">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((error) => (
                      <tr key={error.code}>
                        <td>
                          <span className={`badge ${error.code === 200 ? 'badge-success' : 'badge-secondary'}`}>
                            {error.code}
                          </span>
                        </td>
                        <td className="font-medium">{error.status}</td>
                        <td className="text-[var(--muted-foreground)]">{error.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="mb-16">
              <h2 className="mb-4 text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Rate Limits
              </h2>
              <p className="mb-4 text-[var(--muted-foreground)]">
                API requests are limited based on your subscription tier:
              </p>
              <div className="card overflow-hidden">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Requests/Month</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-secondary">Free</span></td>
                      <td>50</td>
                      <td>Rp 0</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-secondary">Basic</span></td>
                      <td>500</td>
                      <td>Rp 99k/month</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-accent">Pro</span></td>
                      <td>2,000</td>
                      <td>Rp 299k/month</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-primary">Enterprise</span></td>
                      <td>Unlimited</td>
                      <td>Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                Rate limits reset at the beginning of each calendar month. 
                The <code className="rounded bg-[var(--muted)] px-1">meta.requests_remaining</code> field 
                in API responses shows your remaining quota.
              </p>
            </section>

            {/* Need Help */}
            <div className="card bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent p-8 text-center">
              <h3 className="mb-2 text-xl font-bold">Need Help?</h3>
              <p className="mb-4 text-[var(--muted-foreground)]">
                Contact our support team for assistance with the API
              </p>
              <a href="mailto:support@propdata.id" className="btn btn-accent">
                Contact Support
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
