# Tandem

A multi-tenant sales CRM / Sales OS I built as a personal full-stack learning project.

**Use it:** [https://tandemcrm.vercel.app](https://tandemcrm.vercel.app) · [How Tandem works](https://tandemcrm.vercel.app/guide) (no login) · [API health](https://tandem-api-4eal.onrender.com/health)

Sample login (same as local seed): `tandem.admin@yopmail.com` / `Admin@123`

## Project Overview

Tandem is a **multi-tenant sales platform** where each organization (tenant) gets isolated users, teams, roles, leads, and dashboards. A **platform** layer above tenants handles cross-organization administration. User identity is global (one email per person); org access is modeled via `organization_members` so the same user can belong to multiple organizations in the future. See [Multi-Org Readiness](docs/architecture.md#multi-org-readiness).

### Capabilities

| Area               | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| **Multi-tenancy**  | Shared database with row-level isolation per organization                       |
| **Authentication** | Email/password login with httpOnly cookie sessions (access + refresh tokens)    |
| **RBAC**           | One role per org membership; permissions enforced on API and mirrored in the UI |
| **Teams**          | Org teams with member management                                                |
| **Sales CRM**      | Lead pipeline with assignment, status workflow, and activity logging            |
| **Dashboards**     | Role-scoped analytics with customizable widget layouts                          |
| **Notifications**  | In-app alerts for lead events and account welcome (event-driven)                |
| **Audit trails**   | Append-only compliance logs at org and platform scope                           |
| **Platform admin** | Create/suspend orgs, manage modules, manage platform admins                     |

### Tech stack

| Layer    | Technology                                                                             |
| -------- | -------------------------------------------------------------------------------------- |
| Frontend | React 19, Vite, Redux Toolkit, React Router, Axios, shadcn/ui                          |
| Backend  | Express 5, TypeScript, Prisma 7                                                        |
| Database | PostgreSQL 16 (Docker Compose for local dev)                                           |
| Monorepo | npm workspaces - `apps/frontend`, `apps/backend`, `packages/shared` (`@tandem/shared`) |

### Repository layout

```
apps/backend/     Express API, Prisma schema, migrations, seeds
apps/frontend/    React SPA
packages/shared/  Shared constants, types, and Zod schemas
docs/             Product guide, architecture, OpenAPI spec, schema reference
docs/assets/      Screenshots and other documentation assets
```

## Prerequisites

- **Node.js** 22 or later
- **Docker Desktop** (for PostgreSQL)

## Installation Steps

From the repository root:

```powershell
copy apps\backend\.env.example apps\backend\.env
copy apps\frontend\.env.example apps\frontend\.env
npm run setup
```

`npm run setup` runs `npm ci` (workspace root), starts PostgreSQL, runs migrations, regenerates the Prisma client (fallback if migrate did not), and seeds development data.

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable                   | Description                                  | Default                                                |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `PORT`                     | API server port                              | `3000`                                                 |
| `DATABASE_URL`             | PostgreSQL connection string. Local Docker, or Neon **pooled** (`-pooler`) on Render | `postgresql://tandem:tandem@localhost:5432/tandem`     |
| `DIRECT_URL`               | Neon **non-pooled** URL for `migrate deploy` and seed. Omit locally. | *(unset locally)*                                      |
| `JWT_SECRET`               | Secret used to sign access tokens            | `change-me` locally. Production refuses to start if this is still `change-me`. |
| `JWT_EXPIRES_IN`           | Access token lifetime                        | From env. Local example `1d`. Set `15m` on Render. Refresh stays `7d`. |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime                       | `7d`                                                   |
| `FRONTEND_URL`             | Allowed frontend origin for CORS and cookies | `http://localhost:5173`                                |
| `COOKIE_SECURE`            | Set `Secure` flag on auth cookies            | `true`                                                 |
| `LOG_LEVEL`                | Logging verbosity                            | `info`                                                 |

For local HTTP development (`http://localhost:5173`), set `COOKIE_SECURE=false` in `apps/backend/.env` so auth cookies are sent over plain HTTP.

### Frontend (`apps/frontend/.env`)

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

`VITE_API_URL` is baked into the SPA at **build** time. On Vercel, set it on **Production** and **Preview** (not Development) **before** the build. Changing the API host later requires a new frontend deploy.

Copy the `.env.example` files to `.env` in each app directory and adjust values as needed.

Vercel: leave **Root Directory** empty (repo root). `vercel.json` runs `npm ci` here so `packages/shared` and the Vite alias resolve, builds `apps/frontend`, and rewrites unknown paths to `index.html` so `/login` and `/leads/:id` do not 404 on refresh.

## Running the Application

### Daily development

From the repository root:

```powershell
npm run dev
```

This starts PostgreSQL (if not already running), the API, and the web app together.

- API: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:5173](http://localhost:5173)

Press **Ctrl+C** to stop the API and frontend. PostgreSQL keeps running in the background until you run `npm run db:down`.

## Production hosting

Live app and health links are at the **top** of this file. Hosting: Browser → **Vercel** (SPA) → **Render** (Express API) → **Neon** (Postgres). Local Docker Postgres is not used in production.

| Piece | Host | Project / service | Public URL |
| ----- | ---- | ----------------- | ---------- |
| Frontend | [Vercel](https://vercel.com) | `tandemcrm` | [https://tandemcrm.vercel.app](https://tandemcrm.vercel.app) |
| Backend | [Render](https://render.com) | Project `tandem`, web service `tandemcrm-api` | [https://tandem-api-4eal.onrender.com](https://tandem-api-4eal.onrender.com) |
| Database | [Neon](https://neon.tech) | Project `tandem`, Postgres 16 | No public URL. Only the API holds `DATABASE_URL` / `DIRECT_URL` (pooled + direct, `sslmode=require`) |

How they connect:

- Vercel `VITE_API_URL` = Render origin (baked in at frontend build)
- Render `FRONTEND_URL` = `https://tandemcrm.vercel.app` (CORS + cookies)
- Render `DATABASE_URL` = Neon pooled string; `DIRECT_URL` = Neon direct string for migrations

Health: `GET https://tandem-api-4eal.onrender.com/health`

Do not put Neon connection strings, `JWT_SECRET`, or Render/Vercel tokens in this file.

### Other useful commands

| Command               | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `npm run dev:apps`    | Start API and frontend only (Postgres already running) |
| `npm run db:up`       | Start PostgreSQL                                       |
| `npm run db:down`     | Stop PostgreSQL                                        |
| `npm run db:ps`       | Check PostgreSQL status                                |
| `npm run db:migrate`  | Run database migrations (dev)                          |
| `npm run db:migrate:deploy` | Apply migrations non-interactively (production)  |
| `npm run db:generate` | Regenerate Prisma client from schema                   |
| `npm run db:seed`     | Seed development data                                  |
| `npm run db:studio`   | Open Prisma Studio                                     |

### Seed credentials (development)

After running `npm run db:seed`, these users are available for auth testing. Inboxes are at [yopmail.com](https://yopmail.com).

| Email | Role | Password |
| ----- | ---- | -------- |
| `tandem.admin@yopmail.com` | Platform Admin | `Admin@123` |
| `tandem.oracle@yopmail.com` | Platform Admin | `Tandem@123` |
| `wayne@yopmail.com` | Org Admin (Wayne Enterprises) | `Wayne@123` |
| `daggett@yopmail.com` | Org Admin (Daggett Industries) | `Daggett@123` |
| `ace@yopmail.com` | Org Admin (Ace Chemicals) | `Ace@123` |
| `janus@yopmail.com` | Org Admin (Janus Cosmetics) | `Janus@123` |
| `lexcorp@yopmail.com` | Org Admin (LexCorp) | `Lex@123` |

## Theme

The UI uses **light**, **dark**, and **system** modes. Use the toggle in the app header (or on the login page) to switch themes.

## Screenshots

![Login page](docs/assets/screenshots/public/login-page.png)

Full UI screenshots by role and feature area are in the [Product guide - UI screenshots](docs/product-guide.md#20-ui-screenshots).

## Documentation

- [How Tandem works](https://tandemcrm.vercel.app/guide) — public, no-login product story (`/guide`)
- [Product guide](docs/product-guide.md) — stakeholder/QA reference (roles, permissions, lists, seed accounts, [screenshots](docs/product-guide.md#20-ui-screenshots))
- [API specification (OpenAPI)](docs/openapi.yaml) - import into [Swagger Editor](https://editor.swagger.io) to browse and try endpoints
- [Architecture](docs/architecture.md) - system design, auth, tenancy, multi-org readiness, notifications, scaling
- [Database schema](docs/database-schema.md) - table-level reference, columns, enums, and relationships
- [ER diagram](docs/er-diagram.md) - entity-relationship diagram of all database tables
