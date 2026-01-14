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
  Users,
  Shield,
  Crown,
  Search,
  MoreVertical,
  Ban,
  CheckCircle,
  RefreshCw,
  Activity,
  TrendingUp,
  Server,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile, ApiKey } from "@/lib/supabase";

interface UserWithKey extends Profile {
  api_key?: ApiKey;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<UserWithKey[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalRequests: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

    // Check if user is owner
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profileData || profileData.role !== "owner") {
      router.push("/dashboard");
      return;
    }

    setProfile(profileData);
    await Promise.all([fetchUsers(), fetchStats()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profiles) {
      // Fetch API keys for each user
      const usersWithKeys = await Promise.all(
        profiles.map(async (profile) => {
          const { data: apiKey } = await supabase
            .from("api_keys")
            .select("*")
            .eq("user_id", profile.id)
            .single();
          return { ...profile, api_key: apiKey || undefined };
        })
      );
      setUsers(usersWithKeys);
    }
  };

  const fetchStats = async () => {
    const [
      { count: totalUsers },
      { count: totalProperties },
      { count: totalRequests },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("request_logs").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0,
      totalRequests: totalRequests || 0,
      activeUsers: users.filter((u) => u.api_key?.is_active).length,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateUserTier = async (userId: string, tier: string) => {
    const limits: Record<string, number> = {
      free: 50,
      basic: 500,
      pro: 2000,
      enterprise: 999999,
    };

    await supabase
      .from("api_keys")
      .update({ tier, requests_limit: limits[tier] })
      .eq("user_id", userId);

    await supabase.from("profiles").update({ tier }).eq("id", userId);

    fetchUsers();
  };

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    await supabase
      .from("api_keys")
      .update({ is_active: !isActive })
      .eq("user_id", userId);

    fetchUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!profile || profile.role !== "owner") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-[var(--border)] bg-[var(--muted)]/30 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
            <Building2 className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-semibold">PropData</span>
            <span className="ml-auto badge badge-accent text-xs">Admin</span>
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
              href="/admin"
              className="flex items-center gap-3 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-sm font-medium text-[var(--accent)]"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
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
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Admin Panel
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage users and monitor system
            </p>
          </div>
          <button onClick={fetchStats} className="btn btn-ghost">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Database className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Properties</p>
                  <p className="text-2xl font-bold">{stats.totalProperties.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">API Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                  <Server className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">System Status</p>
                  <p className="text-lg font-bold text-green-500">Operational</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-64"
                  placeholder="Search users..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Tier</th>
                    <th>Usage</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <p className="font-medium">{user.full_name || "No name"}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${user.role === 'owner' ? 'badge-accent' : 'badge-secondary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <select
                          value={user.tier || "free"}
                          onChange={(e) => updateUserTier(user.id, e.target.value)}
                          className="input w-auto text-sm py-1"
                          disabled={user.role === "owner"}
                        >
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td>
                        {user.api_key ? (
                          <div>
                            <span className="text-sm">
                              {user.api_key.requests_count} / {user.api_key.requests_limit}
                            </span>
                            <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-[var(--muted)]">
                              <div
                                className="h-full rounded-full bg-[var(--accent)]"
                                style={{
                                  width: `${Math.min((user.api_key.requests_count / user.api_key.requests_limit) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-[var(--muted-foreground)]">No API key</span>
                        )}
                      </td>
                      <td>
                        {user.api_key?.is_active !== false ? (
                          <span className="flex items-center gap-1 text-sm text-green-500">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-[var(--destructive)]">
                            <Ban className="h-3 w-3" />
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="text-sm text-[var(--muted-foreground)]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {user.role !== "owner" && user.api_key && (
                          <button
                            onClick={() => toggleUserActive(user.id, user.api_key?.is_active ?? true)}
                            className={`btn btn-ghost text-xs ${
                              user.api_key.is_active ? 'text-[var(--destructive)]' : 'text-green-500'
                            }`}
                          >
                            {user.api_key.is_active ? (
                              <>
                                <Ban className="h-3 w-3" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-[var(--muted-foreground)]">
                No users found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
