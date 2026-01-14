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
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Property } from "@/lib/supabase";

export default function DataExplorerPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user, page, modeFilter, locationFilter]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
  };

  const fetchProperties = async () => {
    setLoading(true);
    
    let query = supabase
      .from("properties")
      .select("*", { count: "exact" });

    if (modeFilter !== "all") {
      query = query.eq("mode", modeFilter);
    }

    if (locationFilter) {
      query = query.ilike("location", `%${locationFilter}%`);
    }

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (!error && data) {
      setProperties(data);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const formatPrice = (price: string | null) => {
    return price || "-";
  };

  const totalPages = Math.ceil(total / limit);

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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Key className="h-4 w-4" />
              API Keys
            </Link>
            <Link
              href="/dashboard/explorer"
              className="flex items-center gap-3 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-sm font-medium text-[var(--accent)]"
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
            <h1 className="text-lg font-semibold">Data Explorer</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Browse and search property data
            </p>
          </div>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="mb-6 card p-4">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                    placeholder="Search properties..."
                  />
                </div>
              </div>
              <select
                value={modeFilter}
                onChange={(e) => {
                  setModeFilter(e.target.value);
                  setPage(1);
                }}
                className="input w-auto"
              >
                <option value="all">All Types</option>
                <option value="jual">For Sale</option>
                <option value="sewa">For Rent</option>
              </select>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input w-auto"
                placeholder="Location..."
              />
              <button type="submit" className="btn btn-accent">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </form>
          </div>

          {/* Results Info */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing {properties.length} of {total} properties
            </p>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="skeleton h-40 w-full mb-4" />
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="card p-12 text-center">
              <Database className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
              <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <div key={property.id} className="card overflow-hidden">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-[var(--muted)]">
                      <Home className="h-12 w-12 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`badge ${property.mode === 'jual' ? 'badge-accent' : 'badge-secondary'}`}>
                        {property.mode === 'jual' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold line-clamp-2 text-sm">
                      {property.title}
                    </h3>
                    <p className="mb-2 text-lg font-bold text-[var(--accent)]">
                      {formatPrice(property.price)}
                    </p>
                    <div className="mb-3 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {property.bathrooms}
                        </span>
                      )}
                      {property.building_area && (
                        <span className="flex items-center gap-1">
                          <Maximize className="h-3 w-3" />
                          {property.building_area}m2
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{property.location || "-"}</span>
                    </div>
                    <a
                      href={property.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                    >
                      View on OLX
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-4 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
