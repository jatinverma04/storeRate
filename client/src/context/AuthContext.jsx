import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api, getStoredToken, setStoredToken } from "../api/http.js";
import { homePathForRole } from "../utils/roles.js";

const USER_KEY = "storeRate_user";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => getStoredToken());

  const applySession = useCallback((nextToken, nextUser) => {
    setStoredToken(nextToken);
    persistUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    applySession(data.token, data.user);
    return data.user;
  }, [applySession]);

  const register = useCallback(async (payload) => {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: payload,
    });
    applySession(data.token, data.user);
    return data.user;
  }, [applySession]);

  const logout = useCallback(() => {
    applySession(null, null);
  }, [applySession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      homePath: user ? homePathForRole(user.role) : "/login",
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
