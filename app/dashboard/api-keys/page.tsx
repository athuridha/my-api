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
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { ApiKey } from "@/lib/supabase";

export default function ApiKeysPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

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
    fetchApiKeys(user.id);
  };

  const fetchApiKeys = async (userId: string) => {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApiKeys(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const copyApiKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "olx_";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const createNewKey = async () => {
    if (!user || !newKeyName.trim()) return;

    setCreating(true);
    const newKey = generateApiKey();

    const { error } = await supabase.from("api_keys").insert({
      user_id: user.id,
      key: newKey,
      name: newKeyName.trim(),
      user_email: user.email,
      requests_count: 0,
      requests_limit: 50,
      tier: "free",
      is_active: true,
    });

    if (!error) {
      setNewKeyName("");
      fetchApiKeys(user.id);
    }
    setCreating(false);
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (!error && user) {
      fetchApiKeys(user.id);
    }
  };

  const regenerateKey = async (id: string) => {
    if (!confirm("Regenerate this API key? The old key will stop working immediately.")) return;

    const newKey = generateApiKey();
    const { error } = await supabase
      .from("api_keys")
      .update({ key: newKey })
      .eq("id", id);

    if (!error && user) {
      fetchApiKeys(user.id);
    }
  };

  if (!user) {
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
              className="flex items-center gap-3 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-sm font-medium text-[var(--accent)]"
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
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
          <div>
            <h1 className="text-lg font-semibold">API Keys</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage your API keys for accessing the PropData API
            </p>
          </div>
        </header>

        <div className="p-6">
          {/* Create New Key */}
          <div className="mb-8 card p-6">
            <h2 className="mb-4 text-lg font-semibold">Create New API Key</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="input flex-1"
                placeholder="Key name (e.g., Production, Development)"
              />
              <button
                onClick={createNewKey}
                disabled={creating || !newKeyName.trim()}
                className="btn btn-accent"
              >
                <Plus className="h-4 w-4" />
                Create Key
              </button>
            </div>
          </div>

          {/* API Keys List */}
          <div className="card">
            <div className="border-b border-[var(--border)] p-4">
              <h2 className="font-semibold">Your API Keys</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 text-center">
                <Key className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                <h3 className="mt-4 font-semibold">No API keys yet</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Create your first API key to start using the API
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <span className={`badge ${apiKey.is_active ? 'badge-success' : 'badge-secondary'}`}>
                            {apiKey.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="badge badge-accent capitalize">
                            {apiKey.tier}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <code className="rounded bg-[var(--muted)] px-3 py-1.5 font-mono text-sm">
                            {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                          </code>
                          <button
                            onClick={() => toggleShowKey(apiKey.id)}
                            className="btn btn-ghost p-1.5"
                            title={showKeys[apiKey.id] ? "Hide key" : "Show key"}
                          >
                            {showKeys[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyApiKey(apiKey.key, apiKey.id)}
                            className="btn btn-ghost p-1.5"
                            title="Copy to clipboard"
                          >
                            {copied === apiKey.id ? (
                              <Check className="h-4 w-4 text-[var(--success)]" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                          <span>
                            Usage: {apiKey.requests_count} / {apiKey.requests_limit} requests
                          </span>
                          <span>
                            Created: {new Date(apiKey.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {/* Usage bar */}
                        <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-[var(--muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--accent)] transition-all"
                            style={{
                              width: `${Math.min((apiKey.requests_count / apiKey.requests_limit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => regenerateKey(apiKey.id)}
                          className="btn btn-ghost p-2"
                          title="Regenerate key"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteKey(apiKey.id)}
                          className="btn btn-ghost p-2 text-[var(--destructive)]"
                          title="Delete key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
            <div className="text-sm">
              <p className="font-medium text-yellow-600">Keep your API keys secure</p>
              <p className="mt-1 text-yellow-600/80">
                Never share your API keys in public repositories or client-side code.
                If you suspect a key has been compromised, regenerate it immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
