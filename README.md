# StoreRate

Web app for rating stores (1–5). Built for the **Full Stack Intern Coding Challenge**: one login, three roles (System Administrator, Normal User, Store Owner).

## Tech stack

| Layer | Choice |
|--------|--------|
| Frontend | React, Vite, Tailwind CSS v4, lucide-react |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT, bcrypt |

UI colors are defined in `client/tailwind.config.js` and `client/src/index.css`.

## Prerequisites

- Node.js 18+
- Neon PostgreSQL `DATABASE_URL`

## Setup

```bash
cd client && npm install
cd ../server && npm install
```

Environment (server only):

```bash
cp server/.env.example server/.env
```

Set in `server/.env`:

- `DATABASE_URL` — Neon connection string
- `JWT_SECRET` — long random string
- `PORT` — default `5001` (must match Vite proxy in `client/vite.config.js`)
- `CLIENT_URL` — default `http://localhost:5173`

### Database

From `server/`:

```bash
npx prisma migrate deploy   # or: npm run db:migrate (dev)
npm run db:seed
```

**Demo accounts** (development only — `npm run db:seed` wipes users, stores, and ratings, then reloads):

| Role | Name | Email | Password |
|------|------|-------|----------|
| **Admin** (primary) | StoreRate Platform Administrator | `admin@storerate.com` | `Admin@12345` |
| **Admin** | Priya Sharma Operations Administrator | `priya.admin@storerate.com` | `Admin@12345` |
| **Normal user** | Rohan Mehta Community Member User | `rohan.user@example.com` | `User@12345` |
| **Store owner** (featured) | Anita Desai Coffee Store Owner | `anita.owner@storerate.com` | `Owner@12345` |

**Five seeded stores** (each has its own owner; all owners use `Owner@12345`):

| Store | Owner email |
|-------|-------------|
| Downtown Coffee Collective Cafe | `anita.owner@storerate.com` |
| GreenLeaf Organic Grocery Market | `vikram.owner@storerate.com` |
| CityFit Premium Fitness Studio Hub | `meera.owner@storerate.com` |
| TechHub Electronics Repair Center | `arjun.owner@storerate.com` |
| Bella Napoli Italian Kitchen Restaurant | `sofia.owner@storerate.com` |

The normal user has sample ratings on all five stores. Any admin can view and manage (except delete) all users; admins cannot delete other admins or themselves.

Do not commit `server/.env` or use these credentials in production.

## Run locally

Two terminals from project root:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

- App: http://localhost:5173  
- API health: http://localhost:5001/api/health  

If port 5001 is busy, change `PORT` in `server/.env` and update `client/vite.config.js` proxy `target`.

## Roles & flows

| Role | How to get an account | Main screens |
|------|------------------------|--------------|
| **System Administrator** | Seed / another admin creates you | Dashboard, Stores, Users |
| **Normal User** | Sign up at `/register` | Stores (search, rate), Password |
| **Store Owner** | Created when admin adds a store (same email/password) | Dashboard (raters + average), Password |

**Store owners in admin:** Users list shows normal users, admins, and store owners (use **Role** filter to narrow). **View** a store owner for details including store average rating.

**Add store:** Name, email, and address must meet validation (name 20–60 characters). Owner logs in with that email and the password you set.

## Form validation (client + server)

| Field | Rules |
|--------|--------|
| Name | 20–60 characters |
| Address | Required, max 400 characters |
| Password | 8–16 characters, one uppercase, one special character |
| Email | Valid email format |
| Rating | Integer 1–5 |

## API overview

### Auth

| Method | Path |
|--------|------|
| POST | `/api/auth/register` — normal user only |
| POST | `/api/auth/login` |
| POST | `/api/auth/change-password` — `USER`, `STORE_OWNER` |

### Protected (Bearer token)

- **Admin:** `/api/admin/dashboard`, `/api/admin/stores`, `/api/admin/users`, `/api/admin/users/:id` (GET), `DELETE /api/admin/users/:id`
- **User:** `GET /api/stores`, `PUT /api/stores/:id/rating`
- **Store owner:** `GET /api/owner/dashboard`

List endpoints support **filter** query params and **`sortBy` / `sortOrder`** (`asc` | `desc`).

## Manual test checklist

- [ ] Admin login → dashboard counts load
- [ ] Admin add store → owner can login → owner dashboard (empty raters until rated)
- [ ] Admin **Users** list (view only); **Delete user** — normal users and store owners (not admins), confirm modal
- [ ] Admin filter/sort stores and users; open user detail; store owner shows rating when applicable
- [ ] Normal user register/login → search stores by name/address → submit and update rating
- [ ] Normal user / store owner change password; admin cannot use change-password endpoint
- [ ] Logout returns to login; protected routes redirect when logged out
- [ ] Invalid form values show validation errors

## Project structure

```text
storeRate/
  client/           React UI
  server/
    prisma/         schema & migrations
    src/routes/     auth, admin, stores, owner
```

## Production notes

### Environment (server)

Set on your host (or `server/.env`):

- `DATABASE_URL` — production PostgreSQL (e.g. Neon)
- `JWT_SECRET` — long random string
- `PORT` — host port (often `5001` or platform default)
- `CLIENT_URL` — public frontend URL (for CORS), e.g. `https://your-app.example.com`

### Database + demo data (first deploy)

From `server/` with production `DATABASE_URL` loaded:

```bash
npm install
npm run db:setup
```

`db:setup` runs **migrate deploy** then **seed**. **Seed deletes all users, stores, and ratings** and reloads the [demo accounts](#demo-accounts-development-only--npm-run-dbseed-wipes-users-stores-and-ratings-then-reloads) above. Safe for a fresh DB; do not run seed on a live DB you need to keep.

To apply migrations only (no wipe):

```bash
npm run db:deploy
```

### Run API

```bash
npm start
```

### Frontend

```bash
cd client && npm install && npm run build
```

Serve `client/dist` (static host, nginx, etc.).

### Vercel (frontend) + Render (API)

1. **Vercel** → Import repo → **Root Directory:** `client`
2. **Framework:** Vite (auto) — Build: `npm run build`, Output: `dist`
3. **Environment variable** (Production):

   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com` (no trailing slash) |

4. Deploy. Copy the Vercel URL (e.g. `https://storerate.vercel.app`).
5. **Render** → API service → **Environment** → set `CLIENT_URL` to that Vercel URL → redeploy API.
6. On Render **Shell** (once): `npm run db:seed` for demo logins.

Health check: `GET /api/health` on the Render URL.

### Reviewer quick login

After `db:setup`: `admin@storerate.com` / `Admin@12345` — see demo table above for all roles.
