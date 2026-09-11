# StoreRate

Full-stack store rating app (React + Vite, Express, PostgreSQL/Neon, Prisma).

## Prerequisites

- Node.js 18+
- PostgreSQL (Neon) — configured in Phase 1

## Setup

```bash
# Root (runs client + server together)
npm install

cd client && npm install
cd ../server && npm install
```

Copy environment file for the server:

```bash
cp server/.env.example server/.env
# Edit server/.env — set DATABASE_URL and JWT_SECRET
```

### Database (Phase 1)

From `server/`:

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

Default **admin** (after seed):

| Field | Value |
|-------|--------|
| Email | `admin@storerate.com` |
| Password | `Admin@12345` |

Change these in production; do not commit `server/.env`.

### Auth (Phase 2)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register` | Normal user signup only |
| POST | `/api/auth/login` | All roles |
| POST | `/api/auth/change-password` | `USER` and `STORE_OWNER` (Bearer token) |

## Development

```bash
# From project root
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5001 (set `PORT` in `server/.env`)
- Health: http://localhost:5001/api/health

Or run separately:

```bash
npm run dev:client
npm run dev:server
```

## Tailwind CSS

Tailwind v4 with `@tailwindcss/vite` in `client/vite.config.js`. Theme tokens: `client/tailwind.config.js` (`THEME.md`).

```bash
cd client
npm install
```

## Project structure

```text
storeRate/
  client/     React + Vite + Tailwind
  server/     Express API
  THEME.md    UI theme reference
```
