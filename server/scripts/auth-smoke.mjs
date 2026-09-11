const base = process.env.API_URL || "http://localhost:5002";

async function post(path, body, token) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

const login = await post("/api/auth/login", {
  email: "admin@storerate.com",
  password: "Admin@12345",
});
if (login.status !== 200 || !login.data.token) {
  console.error("login failed", login);
  process.exit(1);
}

const change = await post(
  "/api/auth/change-password",
  { currentPassword: "Admin@12345", newPassword: "Admin@12345" },
  login.data.token
);
if (change.status !== 403) {
  console.error("admin change-password should be 403", change);
  process.exit(1);
}

const bad = await post("/api/auth/register", {
  name: "short",
  email: "bad",
  address: "x",
  password: "weak",
});
if (bad.status !== 400 || !bad.data.errors?.length) {
  console.error("register validation should fail", bad);
  process.exit(1);
}

console.log("auth-smoke: ok");
