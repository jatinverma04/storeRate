import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http.js";
import SortableTh from "../components/SortableTh.jsx";
import Button from "../components/ui/Button.jsx";
import FieldError from "../components/ui/FieldError.jsx";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Label from "../components/ui/Label.jsx";
import Modal from "../components/ui/Modal.jsx";
import { Table, TableBody, TableHead, TableRow, Td, Th } from "../components/ui/Table.jsx";
import { collectSignupErrors, validateAdminUserRole } from "../utils/validation.js";
import { formatRole } from "../utils/format.js";
import { toQueryString } from "../utils/queryString.js";

export default function UsersPage() {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = toQueryString({ ...filters, sortBy, sortOrder });
      const data = await api(`/api/admin/users${qs}`);
      setUsers(data.users);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function toggleSort(field) {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();
    setFormError("");
    const errors = collectSignupErrors(form);
    const roleErr = validateAdminUserRole(form.role);
    if (roleErr) errors.push({ field: "role", message: roleErr });
    if (errors.length) {
      const map = {};
      for (const item of errors) map[item.field] = item.message;
      setFieldErrors(map);
      return;
    }
    setFieldErrors({});
    setSaving(true);
    try {
      await api("/api/admin/users", { method: "POST", body: form });
      setModalOpen(false);
      setForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });
      loadUsers();
    } catch (err) {
      if (err.errors?.length) {
        const map = {};
        for (const item of err.errors) map[item.field] = item.message;
        setFieldErrors(map);
      } else {
        setFormError(err.message || "Could not add user.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text-primary">Users</h1>
        <Button type="button" onClick={() => setModalOpen(true)}>Add User</Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["name", "email", "address"].map((key) => (
          <div key={key}>
            <Label htmlFor={`user-filter-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={`user-filter-${key}`}
              value={filters[key]}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
              placeholder="Filter…"
            />
          </div>
        ))}
        <div>
          <Label htmlFor="user-filter-role">Role</Label>
          <select
            id="user-filter-role"
            className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="">Normal &amp; Admin</option>
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
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
                <SortableTh label="Role" field="role" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                <Th>Details</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <Td>{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td>{u.address}</Td>
                  <Td>{formatRole(u.role)}</Td>
                  <Td>
                    <Link
                      to={`/users/${u.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal open={modalOpen} title="Add user" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleAddUser} noValidate>
          {formError && <p className="text-sm text-error">{formError}</p>}
          {["name", "email", "address", "password"].map((key) => (
            <div key={key}>
              <Label htmlFor={`user-${key}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              {key === "password" ? (
                <PasswordInput
                  id={`user-${key}`}
                  autoComplete="new-password"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  error={fieldErrors[key]}
                />
              ) : (
                <Input
                  id={`user-${key}`}
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  error={fieldErrors[key]}
                />
              )}
              <FieldError message={fieldErrors[key]} />
            </div>
          ))}
          <div>
            <Label htmlFor="user-role">Role</Label>
            <select
              id="user-role"
              className="w-full rounded-input border border-border bg-surface px-3 py-2 text-sm"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <FieldError message={fieldErrors.role} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add user"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
