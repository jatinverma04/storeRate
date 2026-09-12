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

**Seed admin** (development only):

| Field | Value |
|--------|--------|
| Email | `admin@storerate.com` |
| Password | `Admin@12345` |

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

**Store owners in admin:** Users list defaults to normal + admin users. Set **Role → Store Owner** in the filter, then **View** for details (includes store average rating).

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

- **Admin:** `/api/admin/dashboard`, `/api/admin/stores`, `/api/admin/users`, `/api/admin/users/:id`
- **User:** `GET /api/stores`, `PUT /api/stores/:id/rating`
- **Store owner:** `GET /api/owner/dashboard`

List endpoints support **filter** query params and **`sortBy` / `sortOrder`** (`asc` | `desc`).

## Manual test checklist

- [ ] Admin login → dashboard counts load
- [ ] Admin add store → owner can login → owner dashboard (empty raters until rated)
- [ ] Admin add normal user and admin user
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

- Set strong `JWT_SECRET` and production `DATABASE_URL`
- `cd server && npm run db:deploy` before starting the server
- Build client: `cd client && npm run build` — serve `client/dist` behind your host or point API CORS `CLIENT_URL` at your frontend origin
