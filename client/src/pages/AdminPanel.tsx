import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Eye,
  Flag,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

type Tab = "users" | "reports" | "stats";

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");

  const adminStats = trpc.admin.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchInterval: 30000,
  });
  const usersQuery = trpc.admin.getUsers.useQuery(undefined, {
    enabled: user?.role === "admin" && tab === "users",
  });
  const reportsQuery = trpc.admin.getReports.useQuery(undefined, {
    enabled: user?.role === "admin" && tab === "reports",
  });
  const moderationStats = trpc.moderation.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchInterval: 30000,
  });

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const users = usersQuery.data ?? [];
    if (!query) return users;

    return users.filter(candidate =>
      [candidate.id, candidate.username, candidate.name, candidate.email]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(query))
    );
  }, [search, usersQuery.data]);

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Admin access required. Please log in.
        </p>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container py-20 text-center">
        <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          The server requires an authenticated admin role for this panel.
        </p>
      </div>
    );
  }

  const stats = adminStats.data;
  const moderation = moderationStats.data;
  const statsLoading = adminStats.isLoading || moderationStats.isLoading;

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">
            Server-authorized beta administration and moderation visibility
          </p>
        </div>
        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full ml-auto">
          ● Database-backed
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Users,
            label: "Total Users",
            value: statsLoading ? "…" : (stats?.totalUsers ?? 0).toLocaleString(),
            color: "text-primary",
          },
          {
            icon: Activity,
            label: "Total Posts",
            value: statsLoading ? "…" : (stats?.totalPosts ?? 0).toLocaleString(),
            color: "text-green-400",
          },
          {
            icon: BarChart3,
            label: "Transactions",
            value: statsLoading
              ? "…"
              : (stats?.totalTransactions ?? 0).toLocaleString(),
            color: "text-blue-400",
          },
          {
            icon: Flag,
            label: "Reports",
            value: statsLoading
              ? "…"
              : (moderation?.totalReports ?? 0).toLocaleString(),
            color: "text-yellow-400",
          },
        ].map(item => (
          <div key={item.label} className="card p-4">
            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
            <div className={`text-xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <ShieldCheck className="h-4 w-4" />
          Beta administration boundary
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          User and report reads are live. Account bans, role promotion, and
          content deletion remain intentionally gated until canonical account
          state and audit-trail contracts are implemented. This screen does not
          simulate successful moderation mutations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["users", "reports", "stats"] as Tab[]).map(value => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {value}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Link
            href="/security"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Shield className="w-3 h-3" />
            Security
          </Link>
          <Link
            href="/audit-log"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3 h-3" />
            Audit Log
          </Link>
        </div>
      </div>

      {tab === "users" && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Filter loaded users by ID, name, username, or email…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => void usersQuery.refetch()}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Refresh users"
            >
              <RefreshCw
                className={`w-4 h-4 ${usersQuery.isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {usersQuery.isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading users…
            </div>
          ) : usersQuery.error ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="font-medium">Unable to load users</p>
              <p className="text-sm text-muted-foreground mt-1">
                {usersQuery.error.message}
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No users match the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Verified</th>
                    <th className="text-left px-4 py-3">XP</th>
                    <th className="text-left px-4 py-3">Last Sign-in</th>
                    <th className="text-left px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(candidate => (
                    <tr
                      key={candidate.id}
                      className="border-b border-border/10 last:border-0 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {candidate.username || candidate.name || candidate.id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {candidate.email || candidate.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            candidate.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {candidate.role || "user"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            candidate.verified
                              ? "bg-green-500/10 text-green-400"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {candidate.verified ? "verified" : "not verified"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {candidate.xp ?? 0}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {candidate.lastSignedIn
                          ? new Date(candidate.lastSignedIn).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {candidate.createdAt
                          ? new Date(candidate.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void reportsQuery.refetch()}
              className="btn-secondary text-xs flex items-center gap-1"
            >
              <RefreshCw
                className={`w-3 h-3 ${reportsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {reportsQuery.isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading reports…
            </div>
          ) : reportsQuery.error ? (
            <div className="card p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="font-medium">Unable to load reports</p>
              <p className="text-sm text-muted-foreground mt-1">
                {reportsQuery.error.message}
              </p>
            </div>
          ) : (reportsQuery.data ?? []).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-muted-foreground">No reports are stored.</p>
            </div>
          ) : (
            (reportsQuery.data ?? []).map(report => (
              <div key={report.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">
                      Report against {report.reportedUserId}
                    </span>
                    <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                      {report.status || "pending"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground bg-secondary/50 rounded px-3 py-2">
                  {report.reason}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reporter: {report.reporterId}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="grid md:grid-cols-2 gap-4">
          {statsLoading ? (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">
              Loading stats…
            </div>
          ) : (
            <>
              {[
                {
                  label: "Total Users",
                  value: (stats?.totalUsers ?? 0).toLocaleString(),
                },
                {
                  label: "Total Posts",
                  value: (stats?.totalPosts ?? 0).toLocaleString(),
                },
                {
                  label: "Total Transactions",
                  value: (stats?.totalTransactions ?? 0).toLocaleString(),
                },
                {
                  label: "Moderation Actions",
                  value: (moderation?.totalActions ?? 0).toLocaleString(),
                },
                {
                  label: "Reports Resolved",
                  value: `${moderation?.resolvedReports ?? 0} / ${
                    moderation?.totalReports ?? 0
                  }`,
                },
                {
                  label: "Resolution Ratio",
                  value: `${Math.round((moderation?.accuracy ?? 0) * 100)}%`,
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="card p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                  </div>
                </div>
              ))}
              <div className="md:col-span-2 card p-4 text-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  These values come from the canonical admin and moderation
                  procedures. Session concurrency, system health, stream totals,
                  and revenue accounting are not inferred on this screen.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
