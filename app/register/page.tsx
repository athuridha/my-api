"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile for new user
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: email,
          full_name: name,
          role: "user",
          tier: "free",
        });

        // Create API key for new user
        const apiKey = generateApiKey();
        await supabase.from("api_keys").insert({
          user_id: data.user.id,
          key: apiKey,
          name: "Default API Key",
          user_email: email,
          requests_count: 0,
          requests_limit: 50,
          tier: "free",
          is_active: true,
        });

        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "olx_";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-[var(--accent)]" />
              <span className="text-xl font-semibold">PropData</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Get started with 50 free API requests per month
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-[var(--border)]"
                required
              />
              <label htmlFor="terms" className="text-sm text-[var(--muted-foreground)]">
                I agree to the{" "}
                <a href="#" className="text-[var(--accent)] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[var(--accent)] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent w-full py-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden bg-[var(--muted)] lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        <div className="max-w-md px-8 text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--accent)]/10">
            <Building2 className="h-10 w-10 text-[var(--accent)]" />
          </div>
          <h2 className="mb-4 text-2xl font-bold">Start with 50 Free Requests</h2>
          <p className="text-[var(--muted-foreground)]">
            No credit card required. Get instant access to our property data API
            and start building your application today.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--accent)]">10K+</div>
              <div className="text-xs text-[var(--muted-foreground)]">Properties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--accent)]">99.9%</div>
              <div className="text-xs text-[var(--muted-foreground)]">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--accent)]">500+</div>
              <div className="text-xs text-[var(--muted-foreground)]">Developers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
