import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import FieldError from "../components/ui/FieldError.jsx";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Label from "../components/ui/Label.jsx";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { homePathForRole } from "../utils/roles.js";

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      navigate(homePathForRole(loggedIn.role), { replace: true });
    } catch (err) {
      if (err.errors?.length) {
        const map = {};
        for (const item of err.errors) map[item.field] = item.message;
        setFieldErrors(map);
      } else {
        setFormError(err.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 md:p-8">
        <h1 className="text-xl font-semibold text-text-primary">Log in</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Sign in to your StoreRate account.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
              {formError}
            </p>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            <FieldError message={fieldErrors.password} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          Normal user?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
