import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/http.js";
import { formatRating, formatRole } from "../utils/format.js";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api(`/api/admin/users/${id}`);
        if (!cancelled) setUser(data.user);
      } catch (err) {
        if (!cancelled) setError(err.message || "User not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading…</p>;
  }

  if (error || !user) {
    return (
      <div>
        <p className="text-sm text-error">{error || "User not found."}</p>
        <Link to="/users" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Link to="/users" className="text-sm text-primary hover:underline">
        ← Back to users
      </Link>
      <h1 className="mt-4 text-xl font-semibold text-text-primary">User details</h1>
      <dl className="mt-6 space-y-4 rounded-card border border-border bg-surface p-6">
        <div>
          <dt className="text-xs text-text-secondary">Name</dt>
          <dd className="text-sm text-text-primary">{user.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Email</dt>
          <dd className="text-sm text-text-primary">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Address</dt>
          <dd className="text-sm text-text-primary">{user.address}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Role</dt>
          <dd className="text-sm text-text-primary">{formatRole(user.role)}</dd>
        </div>
        {user.role === "STORE_OWNER" && (
          <div>
            <dt className="text-xs text-text-secondary">Store rating</dt>
            <dd className="text-sm text-text-primary">{formatRating(user.rating)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
