const base = process.env.API_URL || "http://localhost:5002";

async function request(method, path, body, token) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

const login = await request("POST", "/api/auth/login", {
  email: "admin@storerate.com",
  password: "Admin@12345",
});
if (login.status !== 200) {
  console.error("admin login failed", login);
  process.exit(1);
}
const adminToken = login.data.token;

const dash = await request("GET", "/api/admin/dashboard", null, adminToken);
if (dash.status !== 200 || typeof dash.data.totalUsers !== "number") {
  console.error("dashboard failed", dash);
  process.exit(1);
}

const suffix = Date.now();
const storeBody = {
  name: "Downtown Coffee And Bakery Shop",
  email: `store${suffix}@example.com`,
  address: "123 Market Street, City Center",
  password: "Owner@12345",
};
const storeRes = await request("POST", "/api/admin/stores", storeBody, adminToken);
if (storeRes.status !== 201) {
  console.error("create store failed", storeRes);
  process.exit(1);
}

const ownerLogin = await request("POST", "/api/auth/login", {
  email: storeBody.email,
  password: storeBody.password,
});
if (ownerLogin.status !== 200) {
  console.error("owner login failed", ownerLogin);
  process.exit(1);
}

const ownerDash = await request(
  "GET",
  "/api/owner/dashboard",
  null,
  ownerLogin.data.token
);
if (ownerDash.status !== 200) {
  console.error("owner dashboard failed", ownerDash);
  process.exit(1);
}

const userBody = {
  name: "Regular Customer Account Name",
  email: `user${suffix}@example.com`,
  address: "456 Oak Avenue, Suburb",
  password: "User@12345",
};
const reg = await request("POST", "/api/auth/register", userBody);
if (reg.status !== 201) {
  console.error("register failed", reg);
  process.exit(1);
}

const stores = await request("GET", "/api/stores", null, reg.data.token);
if (stores.status !== 200 || !stores.data.stores?.length) {
  console.error("user stores failed", stores);
  process.exit(1);
}

const storeId = stores.data.stores[0].id;
const rate = await request(
  "PUT",
  `/api/stores/${storeId}/rating`,
  { score: 4 },
  reg.data.token
);
if (rate.status !== 200) {
  console.error("rate failed", rate);
  process.exit(1);
}

console.log("api-smoke: ok");
