import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import FieldError from "../components/ui/FieldError.jsx";
import Input from "../components/ui/Input.jsx";
import Label from "../components/ui/Label.jsx";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { collectSignupErrors } from "../utils/validation.js";
import { homePathForRole } from "../utils/roles.js";

export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const clientErrors = collectSignupErrors(form);
    if (clientErrors.length > 0) {
      const map = {};
      for (const item of clientErrors) map[item.field] = item.message;
      setFieldErrors(map);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const created = await register(form);
      navigate(homePathForRole(created.role), { replace: true });
    } catch (err) {
      if (err.errors?.length) {
        const map = {};
        for (const item of err.errors) map[item.field] = item.message;
        setFieldErrors(map);
      } else {
        setFormError(err.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 md:p-8">
        <h1 className="text-xl font-semibold text-text-primary">Sign up</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Register as a normal user to rate stores.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
              {formError}
            </p>
          )}
          {["name", "email", "address", "password"].map((key) => (
            <div key={key}>
              <Label htmlFor={key}>
                {key === "password" ? "Password" : key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <Input
                id={key}
                type={key === "password" ? "password" : key === "email" ? "email" : "text"}
                autoComplete={key === "password" ? "new-password" : key}
                value={form[key]}
                onChange={(e) => updateField(key, e.target.value)}
                error={fieldErrors[key]}
              />
              <FieldError message={fieldErrors[key]} />
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
