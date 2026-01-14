"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Key,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  TrendingUp,
  Database,
  Clock,
  ChevronRight,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase";

interface ApiKeyData {
  id: string;
  key: string;
  name: string;
  requests_count: number;
  requests_limit: number;
  tier: string;
  is_active: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [apiKey, setApiKey] = useState<ApiKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch API key
    const { data: keyData } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (keyData) {
      setApiKey(keyData);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  const usagePercentage = apiKey
    ? Math.round((apiKey.requests_count / apiKey.requests_limit) * 100)
    : 0;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-[var(--border)] bg-[var(--muted)]/30 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
            <Building2 className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-semibold">PropData</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {profile?.role === "owner" && (
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-sm font-medium text-[var(--accent)]"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/api-keys"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Key className="h-4 w-4" />
              API Keys
            </Link>
            <Link
              href="/dashboard/explorer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Database className="h-4 w-4" />
              Data Explorer
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <FileText className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          <div className="border-t border-[var(--border)] p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="badge badge-accent capitalize">
              {apiKey?.tier || "free"} plan
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">
                  API Requests
                </span>
                <TrendingUp className="h-4 w-4 text-[var(--success)]" />
              </div>
              <div className="mt-2 text-2xl font-bold">
                {apiKey?.requests_count || 0}
              </div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                of {apiKey?.requests_limit || 50} this month
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">
                  Usage
                </span>
                <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div className="mt-2 text-2xl font-bold">{usagePercentage}%</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">
                  Data Points
                </span>
                <Database className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div className="mt-2 text-2xl font-bold">10,234</div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                Properties available
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">
                  Last Updated
                </span>
                <Clock className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div className="mt-2 text-2xl font-bold">2h ago</div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                Data refreshed daily
              </div>
            </div>
          </div>

          {/* API Key Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Your API Key</h2>
            <div className="card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-sm text-[var(--muted-foreground)]">
                    API Key
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="rounded-lg bg-[var(--muted)] px-4 py-2 font-mono text-sm">
                      {apiKey
                        ? showKey
                          ? apiKey.key
                          : maskApiKey(apiKey.key)
                        : "No API key found"}
                    </code>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="btn btn-ghost p-2"
                      title={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={copyApiKey}
                      className="btn btn-ghost p-2"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-[var(--success)]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <button className="btn btn-secondary">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Quick Start</h2>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-[var(--destructive)]/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-[var(--success)]/50" />
                <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                  Example Request
                </span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code className="font-mono text-[var(--muted-foreground)]">
                  {`curl -X GET "https://propdata.vercel.app/api/v1/properties?location=jakarta&limit=10" \\
  -H "X-API-Key: ${apiKey?.key ? maskApiKey(apiKey.key) : "YOUR_API_KEY"}"`}
                </code>
              </pre>
            </div>
          </div>

          {/* Upgrade CTA */}
          {apiKey?.tier === "free" && (
            <div className="card bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">Upgrade your plan</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Get more API requests and unlock advanced features
                  </p>
                </div>
                <Link href="/#pricing" className="btn btn-accent">
                  View Plans
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
