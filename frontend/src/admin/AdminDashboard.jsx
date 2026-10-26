
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Palette,
  Video,
  ShoppingBag,
  MessageSquare,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";

import api from "../services/api";
import AdminLogout from "./AdminLogout";

const managementItems = [
  {
    title: "Projects",
    description: "Manage portfolio projects and designs.",
    path: "/admin/projects",
    icon: FolderOpen,
    color: "text-purple-300",
  },
  {
    title: "Services",
    description: "Manage design services and pricing.",
    path: "/admin/services",
    icon: Palette,
    color: "text-purple-300",
  },
  {
    title: "Reels",
    description: "Manage promotional videos and reels.",
    path: "/admin/reels",
    icon: Video,
    color: "text-purple-300",
  },
  {
    title: "Orders",
    description: "Review orders and update their status.",
    path: "/admin/orders",
    icon: ShoppingBag,
    color: "text-purple-300",
  },
  {
    title: "Messages",
    description: "Read and manage client enquiries.",
    path: "/admin/messages",
    icon: MessageSquare,
    color: "text-purple-300",
  },
];

const initialStats = [
  { key: "projects", title: "Total Projects", icon: FolderOpen },
  { key: "services", title: "Total Services", icon: Palette },
  { key: "reels", title: "Total Reels", icon: Video },
  { key: "orders", title: "Total Orders", icon: ShoppingBag },
  { key: "messages", title: "Total Messages", icon: MessageSquare },
];

function getCount(response) {
  const data = response?.data;

  if (typeof data?.count === "number") {
    return data.count;
  }

  if (Array.isArray(data)) {
    return data.length;
  }

  if (Array.isArray(data?.projects)) return data.projects.length;
  if (Array.isArray(data?.services)) return data.services.length;
  if (Array.isArray(data?.reels)) return data.reels.length;
  if (Array.isArray(data?.orders)) return data.orders.length;
  if (Array.isArray(data?.messages)) return data.messages.length;

  if (Array.isArray(data?.data)) return data.data.length;

  return 0;
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    reels: 0,
    orders: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    const endpoints = [
      { key: "projects", url: "/projects" },
      { key: "services", url: "/services" },
      { key: "reels", url: "/reels" },
      { key: "orders", url: "/orders" },
      { key: "messages", url: "/contact" },
    ];

    try {
      const results = await Promise.allSettled(
        endpoints.map((endpoint) => api.get(endpoint.url))
      );

      const nextStats = { ...stats };
      const failedEndpoints = [];

      results.forEach((result, index) => {
        const key = endpoints[index].key;

        if (result.status === "fulfilled") {
          nextStats[key] = getCount(result.value);
        } else {
          failedEndpoints.push(endpoints[index].url);
          console.error(
            `Dashboard request failed: ${endpoints[index].url}`,
            result.reason?.response?.data || result.reason?.message
          );
        }
      });

      setStats(nextStats);

      if (failedEndpoints.length > 0) {
        setError(
          `Some dashboard data could not load: ${failedEndpoints.join(", ")}. Check your backend routes.`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <main className="admin-shell admin-dashboard min-h-screen bg-[#09090b] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-purple-300">
              <LayoutDashboard size={17} />
              Admin Panel
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Manage your graphic design portfolio from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              {loading ? "Loading..." : "Refresh Data"}
            </button>

            <AdminLogout />
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Overview</h2>
            <span className="text-xs text-zinc-500">
              {loading ? "Updating..." : "Latest loaded data"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {initialStats.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.key}
                  className="rounded-2xl border border-white/10 bg-[#111114] p-5 transition hover:border-purple-400/30"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      {item.title}
                    </span>
                    <Icon size={20} className="text-purple-300" />
                  </div>

                  <p className="text-3xl font-bold tabular-nums">
                    {loading ? (
                      <LoaderCircle
                        size={25}
                        className="animate-spin text-zinc-500"
                      />
                    ) : (
                      stats[item.key]
                    )}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Management links */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Manage Website</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Select a section to manage your portfolio content.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {managementItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group rounded-2xl border border-white/10 bg-[#111114] p-6 transition hover:-translate-y-1 hover:border-purple-400/40 hover:bg-[#15151a]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-xl bg-white/5 p-3">
                      <Icon size={24} className={item.color} />
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="text-zinc-500 transition group-hover:text-white"
                    />
                  </div>

                  <h3 className="text-lg font-semibold">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>

                  <span className="mt-5 inline-block text-sm font-medium text-purple-300">
                    Manage {item.title} →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 py-5 text-center text-xs text-zinc-500">
          Incredible Graphics · Admin Dashboard
        </footer>
      </div>
    </main>
  );
}

export default AdminDashboard;
