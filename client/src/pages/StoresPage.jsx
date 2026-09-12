import { useCallback, useEffect, useState } from "react";
import { api } from "../api/http.js";
import SortableTh from "../components/SortableTh.jsx";
import Button from "../components/ui/Button.jsx";
import FieldError from "../components/ui/FieldError.jsx";
import Input from "../components/ui/Input.jsx";
import Label from "../components/ui/Label.jsx";
import Modal from "../components/ui/Modal.jsx";
import RatingPicker from "../components/ui/RatingPicker.jsx";
import { Table, TableBody, TableHead, TableRow, Td } from "../components/ui/Table.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { collectSignupErrors } from "../utils/validation.js";
import { formatRating } from "../utils/format.js";
import { toQueryString } from "../utils/queryString.js";

function AdminStores() {
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = toQueryString({ ...filters, sortBy, sortOrder });
      const data = await api(`/api/admin/stores${qs}`);
      setStores(data.stores);
    } catch (err) {
      setError(err.message || "Failed to load stores.");
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  function toggleSort(field) {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  async function handleAddStore(e) {
    e.preventDefault();
    setFormError("");
    const clientErrors = collectSignupErrors(form);
    if (clientErrors.length) {
      const map = {};
      for (const item of clientErrors) map[item.field] = item.message;
      setFieldErrors(map);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    try {
      await api("/api/admin/stores", { method: "POST", body: form });
      setModalOpen(false);
      setForm({ name: "", email: "", address: "", password: "" });
      loadStores();
    } catch (err) {
      if (err.errors?.length) {
        const map = {};
        for (const item of err.errors) map[item.field] = item.message;
        setFieldErrors(map);
      } else {
        setFormError(err.message || "Could not add store.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text-primary">Stores</h1>
        <Button type="button" onClick={() => setModalOpen(true)}>Add Store</Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {["name", "email", "address"].map((key) => (
          <div key={key}>
            <Label htmlFor={`filter-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={`filter-${key}`}
              value={filters[key]}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
              placeholder="Filter…"
            />
          </div>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      {loading ? (
        <p className="mt-4 text-sm text-text-secondary">Loading…</p>
      ) : (
        <div className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <SortableTh label="Name" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                <SortableTh label="Email" field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                <SortableTh label="Address" field="address" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                <SortableTh label="Rating" field="rating" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((s) => (
                <TableRow key={s.id}>
                  <Td>{s.name}</Td>
                  <Td>{s.email}</Td>
                  <Td>{s.address}</Td>
                  <Td>{formatRating(s.rating)}</Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal open={modalOpen} title="Add store" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleAddStore} noValidate>
          {formError && <p className="text-sm text-error">{formError}</p>}
          <p className="text-xs text-text-secondary">
            Creates the store and a store owner login (same name, email, address).
          </p>
          {["name", "email", "address", "password"].map((key) => (
            <div key={key}>
              <Label htmlFor={`store-${key}`}>
                {key === "password" ? "Owner password" : key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <Input
                id={`store-${key}`}
                type={key === "password" ? "password" : key === "email" ? "email" : "text"}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                error={fieldErrors[key]}
              />
              <FieldError message={fieldErrors[key]} />
            </div>
          ))}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add store"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function UserStores() {
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draftRatings, setDraftRatings] = useState({});
  const [savingId, setSavingId] = useState(null);

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = toQueryString({ ...filters, sortBy, sortOrder });
      const data = await api(`/api/stores${qs}`);
      setStores(data.stores);
      const drafts = {};
      for (const s of data.stores) {
        drafts[s.id] = s.myRating;
      }
      setDraftRatings(drafts);
    } catch (err) {
      setError(err.message || "Failed to load stores.");
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);


  async function submitRating(storeId) {
    const score = draftRatings[storeId];
    if (!score || score < 1) return;
    setSavingId(storeId);
    try {
      await api(`/api/stores/${storeId}/rating`, {
        method: "PUT",
        body: { score },
      });
      await loadStores();
    } catch (err) {
      setError(err.message || "Could not save rating.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Stores</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="filter-name">Name</Label>
          <Input
            id="filter-name"
            value={filters.name}
            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
            placeholder="Search by name…"
          />
        </div>
        <div>
          <Label htmlFor="filter-address">Address</Label>
          <Input
            id="filter-address"
            value={filters.address}
            onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))}
            placeholder="Search by address…"
          />
        </div>
        <div>
          <Label htmlFor="sort-by">Sort by</Label>
          <select
            id="sort-by"
            className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
          </select>
        </div>
        <div>
          <Label htmlFor="sort-order">Order</Label>
          <select
            id="sort-order"
            className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      {loading ? (
        <p className="mt-4 text-sm text-text-secondary">Loading…</p>
      ) : (
        <div className="mt-4 space-y-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-card border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-text-primary">{store.name}</p>
                  <p className="text-sm text-text-secondary">{store.address}</p>
                </div>
                <div className="text-sm text-text-secondary">
                  Overall: <span className="text-text-primary">{formatRating(store.overallRating)}</span>
                  {" · "}
                  Yours: <span className="text-text-primary">{formatRating(store.myRating)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <RatingPicker
                  value={draftRatings[store.id] || null}
                  onChange={(score) =>
                    setDraftRatings((d) => ({ ...d, [store.id]: score }))
                  }
                  disabled={savingId === store.id}
                />
                <Button
                  type="button"
                  variant="success"
                  disabled={!draftRatings[store.id] || savingId === store.id}
                  onClick={() => submitRating(store.id)}
                >
                  {store.myRating ? "Update rating" : "Submit rating"}
                </Button>
              </div>
            </div>
          ))}
          {stores.length === 0 && (
            <p className="text-sm text-text-secondary">No stores found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function StoresPage() {
  const { user } = useAuth();
  if (user.role === "ADMIN") return <AdminStores />;
  return <UserStores />;
}
