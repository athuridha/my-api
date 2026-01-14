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
  Database,
  User,
  Mail,
  Shield,
  Loader2,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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
      setFullName(profileData.full_name || "");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

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
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
              className="flex items-center gap-3 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-sm font-medium text-[var(--accent)]"
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
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
          <div>
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage your account settings
            </p>
          </div>
        </header>

        <div className="p-6 max-w-2xl">
          {/* Profile Settings */}
          <div className="mb-8 card p-6">
            <h2 className="mb-6 text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email address
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="text-[var(--muted-foreground)]">
                    {user?.email}
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Account type
                </label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="badge badge-accent capitalize">
                    {profile?.role || "user"}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn btn-accent"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>

          {/* Password Settings */}
          <div className="card p-6">
            <h2 className="mb-6 text-lg font-semibold flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </h2>
            <div className="space-y-4">
              {passwordError && (
                <div className="rounded-lg bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="rounded-lg bg-[var(--success)]/10 p-3 text-sm text-[var(--success)]">
                  Password updated successfully
                </div>
              )}
              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={saving || !newPassword || !confirmPassword}
                className="btn btn-secondary"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update password"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
