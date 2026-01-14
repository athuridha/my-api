import Link from "next/link";
import {
  Database,
  Zap,
  Shield,
  BarChart3,
  Code,
  ArrowRight,
  Check,
  Building2,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Comprehensive Data",
    description:
      "Access thousands of property listings with detailed information including price, location, specifications, and images.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Our data is refreshed daily to ensure you always have access to the latest property listings and market information.",
  },
  {
    icon: Shield,
    title: "Reliable API",
    description:
      "99.9% uptime guarantee with robust infrastructure designed to handle high-volume requests seamlessly.",
  },
  {
    icon: BarChart3,
    title: "Market Analytics",
    description:
      "Get insights on price trends, popular locations, and market movements to make data-driven decisions.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "Rp 0",
    period: "forever",
    description: "Perfect for testing and small projects",
    features: [
      "50 API requests/month",
      "Basic property data",
      "Community support",
      "API documentation",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Basic",
    price: "Rp 99k",
    period: "/month",
    description: "For growing businesses and developers",
    features: [
      "500 API requests/month",
      "Full property data",
      "Email support",
      "Data export (CSV/JSON)",
      "Historical data access",
    ],
    cta: "Subscribe",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Rp 299k",
    period: "/month",
    description: "For professional teams and agencies",
    features: [
      "2,000 API requests/month",
      "Full property data",
      "Priority support",
      "Advanced analytics",
      "Webhook notifications",
      "Custom data filters",
    ],
    cta: "Subscribe",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with specific needs",
    features: [
      "Unlimited API requests",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment",
      "White-label solution",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const codeExample = `// Example API Request
const response = await fetch(
  'https://propdata.vercel.app/api/v1/properties',
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
// Returns: { properties: [...], total: 1234 }`;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-semibold">PropData</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Documentation
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost text-sm">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary text-sm">
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              <span>Now serving 10,000+ properties daily</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Indonesia Property Data
              <span className="block text-[var(--accent)]">API Platform</span>
            </h1>
            <p className="mb-10 text-lg text-[var(--muted-foreground)] sm:text-xl">
              Access comprehensive property listing data from major Indonesian
              platforms. Build powerful real estate applications with our
              reliable, well-documented API.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register" className="btn btn-accent px-8 py-3">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#docs" className="btn btn-secondary px-8 py-3">
                <Code className="h-4 w-4" />
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-b border-[var(--border)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to build
            </h2>
            <p className="text-lg text-[var(--muted-foreground)]">
              Our API provides all the tools and data you need to create
              powerful property applications.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-[var(--accent)]/10 p-3">
                  <feature.icon className="h-6 w-6 text-[var(--accent)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section id="docs" className="border-b border-[var(--border)] bg-[var(--muted)]/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, powerful API
              </h2>
              <p className="mb-6 text-lg text-[var(--muted-foreground)]">
                Get started in minutes with our intuitive REST API. Full
                documentation and code examples in multiple languages.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-[var(--success)]" />
                  RESTful API with JSON responses
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-[var(--success)]" />
                  SDKs for JavaScript, Python, PHP
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-[var(--success)]" />
                  Comprehensive documentation
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-[var(--success)]" />
                  Interactive API playground
                </li>
              </ul>
            </div>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-[var(--destructive)]/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-[var(--success)]/50" />
                <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                  example.js
                </span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code className="font-mono text-[var(--muted-foreground)]">
                  {codeExample}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-b border-[var(--border)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[var(--muted-foreground)]">
              Choose the plan that fits your needs. Upgrade or downgrade
              anytime.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-6 ${
                  plan.highlighted ? "ring-2 ring-[var(--accent)]" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-block rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-[var(--muted-foreground)]">{plan.period}</span>
                </div>
                <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                  {plan.description}
                </p>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[var(--success)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn w-full ${
                    plan.highlighted ? "btn-accent" : "btn-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--muted-foreground)]">
              Join thousands of developers and businesses using PropData API to
              power their property applications.
            </p>
            <Link href="/register" className="btn btn-accent px-8 py-3">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--accent)]" />
              <span className="font-semibold">PropData</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
              <a href="#" className="hover:text-[var(--foreground)]">
                Terms
              </a>
              <a href="#" className="hover:text-[var(--foreground)]">
                Privacy
              </a>
              <a href="#" className="hover:text-[var(--foreground)]">
                Contact
              </a>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              2026 PropData. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
