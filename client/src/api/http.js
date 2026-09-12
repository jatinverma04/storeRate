const TOKEN_KEY = "storeRate_token";

/** Empty in dev (Vite proxies /api). Set on Vercel: VITE_API_URL=https://your-api.onrender.com */
const API_ROOT = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, { method = "GET", body, token } = {}) {
  const authToken = token ?? getStoredToken();
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const url = path.startsWith("http") ? path : `${API_ROOT}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.errors = data.errors;
    throw err;
  }
  return data;
}
