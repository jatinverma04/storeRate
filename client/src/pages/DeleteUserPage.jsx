import { useCallback, useEffect, useState } from "react";
import { api } from "../api/http.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Label from "../components/ui/Label.jsx";
import Modal from "../components/ui/Modal.jsx";
import { Table, TableBody, TableHead, TableRow, Td, Th } from "../components/ui/Table.jsx";
import { toQueryString } from "../utils/queryString.js";

export default function DeleteUserPage() {
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = toQueryString({
        ...filters,
        forDelete: "true",
        sortBy: "name",
        sortOrder: "asc",
      });
      const data = await api(`/api/admin/users${qs}`);
      setUsers(data.users);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function closeConfirm() {
    if (deleting) return;
    setPendingDelete(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await api(`/api/admin/users/${pendingDelete.id}`, { method: "DELETE" });
      setPendingDelete(null);
      loadUsers();
    } catch (err) {
      setDeleteError(err.message || "Could not delete user.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Delete user</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Normal users you are allowed to remove. Admins and store owners are not listed here.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {["name", "email", "address"].map((key) => (
          <div key={key}>
            <Label htmlFor={`del-filter-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={`del-filter-${key}`}
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
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Address</Th>
                <Th>Delete</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <Td colSpan={4} className="text-text-secondary">
                    No users available to delete.
                  </Td>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <Td>{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.address}</Td>
                    <Td>
                      <Button
                        type="button"
                        variant="destructive"
                        className="px-2 py-1 text-xs"
                        onClick={() => {
                          setDeleteError("");
                          setPendingDelete(u);
                        }}
                      >
                        Delete
                      </Button>
                    </Td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal open={Boolean(pendingDelete)} title="Delete user" onClose={closeConfirm}>
        {pendingDelete && (
          <div className="space-y-4">
            <p className="text-sm text-text-primary">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <dl className="rounded-input border border-border bg-background px-4 py-3 text-sm">
              <div>
                <dt className="text-xs text-text-secondary">Name</dt>
                <dd className="text-text-primary">{pendingDelete.name}</dd>
              </div>
              <div className="mt-2">
                <dt className="text-xs text-text-secondary">Email</dt>
                <dd className="text-text-primary">{pendingDelete.email}</dd>
              </div>
            </dl>
            {deleteError && <p className="text-sm text-error">{deleteError}</p>}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" disabled={deleting} onClick={closeConfirm}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={confirmDelete}
              >
                {deleting ? "Deleting…" : "Yes, delete user"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
