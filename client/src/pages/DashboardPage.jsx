import { useEffect, useState } from "react";
import { api } from "../api/http.js";
import StatCard from "../components/ui/StatCard.jsx";
import SortableTh from "../components/SortableTh.jsx";
import { Table, TableBody, TableHead, TableRow, Td } from "../components/ui/Table.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toQueryString } from "../utils/queryString.js";
import { formatRating } from "../utils/format.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user.role === "ADMIN";

  const [stats, setStats] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (isAdmin) {
          const data = await api("/api/admin/dashboard");
          if (!cancelled) setStats(data);
        } else {
          const qs = toQueryString({ sortBy, sortOrder });
          const data = await api(`/api/owner/dashboard${qs}`);
          if (!cancelled) setOwnerData(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, sortBy, sortOrder]);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading dashboard…</p>;
  }

  if (error) {
    return <p className="text-sm text-error">{error}</p>;
  }

  if (isAdmin && stats) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Stores" value={stats.totalStores} />
          <StatCard label="Total Ratings" value={stats.totalRatings} />
        </div>
      </div>
    );
  }

  if (ownerData) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">{ownerData.store.name}</p>
        <div className="mt-6 max-w-sm">
          <StatCard
            label="Average store rating"
            value={formatRating(ownerData.store.averageRating)}
          />
        </div>
        <h2 className="mt-8 text-lg font-medium text-text-primary">Raters</h2>
        {ownerData.raters.length === 0 ? (
          <p className="mt-2 text-sm text-text-secondary">No ratings yet.</p>
        ) : (
          <div className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <SortableTh
                    label="Name"
                    field="name"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                  />
                  <SortableTh
                    label="Email"
                    field="email"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                  />
                  <SortableTh
                    label="Address"
                    field="address"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                  />
                  <SortableTh
                    label="Rating"
                    field="score"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={toggleSort}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {ownerData.raters.map((r) => (
                  <TableRow key={`${r.email}-${r.score}`}>
                    <Td>{r.name}</Td>
                    <Td>{r.email}</Td>
                    <Td>{r.address}</Td>
                    <Td>{r.score}</Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  return null;
}
