import { useState } from "react";
import { api } from "../api/http.js";
import Button from "../components/ui/Button.jsx";
import FieldError from "../components/ui/FieldError.jsx";
import Input from "../components/ui/Input.jsx";
import Label from "../components/ui/Label.jsx";
import { validatePassword } from "../utils/validation.js";

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    const pwdErr = validatePassword(newPassword);
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required.";
    if (pwdErr) errors.newPassword = pwdErr;
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      if (err.errors?.length) {
        const map = {};
        for (const item of err.errors) map[item.field] = item.message;
        setFieldErrors(map);
      } else {
        setFormError(err.message || "Could not update password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold text-text-primary">Change password</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Use 8–16 characters with an uppercase letter and a special character.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        {formError && <p className="text-sm text-error">{formError}</p>}
        {success && <p className="text-sm text-success">{success}</p>}
        <div>
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={fieldErrors.currentPassword}
          />
          <FieldError message={fieldErrors.currentPassword} />
        </div>
        <div>
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={fieldErrors.newPassword}
          />
          <FieldError message={fieldErrors.newPassword} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
