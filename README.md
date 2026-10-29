# Tandem

A multi-tenant sales CRM / Sales OS I built as a personal full-stack learning project.

**Use it:** [https://tandemcrm.vercel.app](https://tandemcrm.vercel.app) · [How Tandem works](https://tandemcrm.vercel.app/guide) (no login) · [Upcoming features](https://tandemcrm.vercel.app/upcoming) · [API health](https://tandem-api-4eal.onrender.com/health)

Sample login (same as local seed): `tandem.admin@yopmail.com` / `Admin@123`

## Project Overview

Tandem is a **multi-tenant sales platform** where each organization (tenant) gets isolated users, teams, roles, leads, and dashboards. A **platform** layer above tenants handles cross-organization administration. User identity is global (one email per person). You work in **one organization per login**. An org switcher (same person in two companies, pick which one after login) is an **upcoming feature**, not in the product today. The schema already allows extra memberships; the app cannot switch. See [Multi-Org Readiness](docs/architecture.md#multi-org-readiness).

### Capabilities

| Area               | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| **Multi-tenancy**  | Shared database with row-level isolation per organization                       |
| **Authentication** | Email/password login with httpOnly cookie sessions (access + refresh tokens)    |
| **RBAC**           | One role per org membership; permissions enforced on API and mirrored in the UI |
| **Teams**          | Org teams with member management                                                |
| **Sales CRM**      | Lead pipeline with assignment, status workflow, and activity logging            |
| **Dashboards**     | Role-scoped analytics with customizable widget layouts                          |
| **Notifications**  | In-app alerts for lead events and account welcome (event-driven). No email yet. |
| **Audit trails**   | Append-only compliance logs at org and platform scope                           |
| **Platform admin** | Overview (orgs, active users, leads created), create/suspend orgs, modules, platform admins |

### Upcoming (not in the product yet)

| Feature | Today |
| ------- | ----- |
| **Org switcher** | One email can have membership rows in more than one org in the database. Login still binds the session to a **single** org. There is no picker in the UI and no `POST /auth/switch-organization`. Planned in Plan 8. Details: [Architecture — Multi-Org Readiness](docs/architecture.md#multi-org-readiness). |
| **Invite existing email into a second org** | Adding an email that already has a Tandem user fails. Later, the second company adds a **membership only** (same login, different role). Needs the org picker. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Per-org deactivate** | Users pages activate/deactivate global `users.status` (the whole login). `organization_members.status` exists but is unused. Later, with the org switcher, an admin can remove someone from this company without locking them out of another. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Forgot password / admin reset** | Login has no Forgot password. Admins cannot set a temporary password; they can only activate or deactivate. Admin set-password is Plan 7.10; self-service email reset is Plan 7.11. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Sign in with Google / SSO** | Login is email and a Tandem password only. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Sending emails** | Alerts stay **in-app** (bell + notifications page). The API does not send mail for a new lead, assignment, welcome, password reset, or the org-admin login when a company is created. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Customizable pipeline** | Every org uses the same stages today, including **site visit**. Later each organization will name its own statuses. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Auto-assignment** | A leader (or anyone with assign permission) picks the owner by hand. Round-robin or least-loaded distribution of new walk-ins is **not** in the product. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Redis (unread badge + more than one API)** | The bell counts unread alerts with a Postgres `COUNT` every 60s, so a new assignment can sit unseen for a minute. Alerts use an in-process bus, so only one API instance is safe — a restart can drop an alert, and a failed bell write is logged and given up. Redis later caches the badge, lets polling drop, shares events across servers, queues jobs so they survive a restart, and retries failed writes — after a custom domain and real customers. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Audit / notification archival** | Bell and audit rows stay forever. Retention ships after a custom domain and real customers. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Mobile apps** | Website only. Phone browser can open it; no App Store or Play Store app yet. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Custom domain** | Stay on `tandemcrm.vercel.app` + `tandem-api-4eal.onrender.com`. Login cookies are third-party. A Tandem hostname (first-party cookies) is later. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **Split the API into services** | One Express process today. Separate services later if traffic needs it. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |
| **A database per company** | Shared Postgres with `organizationId`. A dedicated database per tenant is later. Public list: [`/upcoming`](https://tandemcrm.vercel.app/upcoming). |

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

### Vercel deploy notifications

[`.github/workflows/vercel-deploy-notify.yml`](.github/workflows/vercel-deploy-notify.yml) runs after Vercel finishes a GitHub-connected deploy. It pings **Discord** and/or **Telegram** on success (🚀) or failure (💥) only — pending, canceled, skipped, and ignored deploys are silent.

Each message includes project, environment, branch, commit, author, duration, PR (if any), and the deployment URL. The workflow file must be on the **default branch** or Vercel events never reach it.

Optional GitHub Actions secrets (Settings → Secrets and variables → Actions). Missing ones are skipped; the job stays green so this file can be copied to other repos:

| Secret | Used for |
| ------ | -------- |
| `DISCORD_WEBHOOK_URL` | Discord channel webhook |
| `TELEGRAM_BOT_TOKEN` | Telegram bot from [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | Telegram chat or channel id (needs `TELEGRAM_BOT_TOKEN` too) |

- Both Discord and Telegram secrets set → send to both
- Only one app configured → send there
- Neither configured, or both sends fail → comment on the commit instead (and still write the Actions job summary)

Do not put webhook URLs or bot tokens in this file.

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
- [Upcoming features](https://tandemcrm.vercel.app/upcoming) — public roadmap (`/upcoming`)
- [Product guide](docs/product-guide.md) — stakeholder/QA reference (roles, permissions, lists, seed accounts, [screenshots](docs/product-guide.md#20-ui-screenshots))
- [API specification (OpenAPI)](docs/openapi.yaml) - import into [Swagger Editor](https://editor.swagger.io) to browse and try endpoints
- [Architecture](docs/architecture.md) - system design, auth, tenancy, multi-org readiness, notifications, scaling
- [Database schema](docs/database-schema.md) - table-level reference, columns, enums, and relationships
- [ER diagram](docs/er-diagram.md) - entity-relationship diagram of all database tables
