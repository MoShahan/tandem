# Product Guide

Stakeholder and QA reference for **Tandem** — a multi-tenant sales CRM / Sales OS. Use this file to check what shipped: roles, the permission catalog, pipeline rules, list/search/sort behavior, seed logins, and UI screenshots.

**If you want the non-technical story**, open **[How Tandem works](https://tandemcrm.vercel.app/guide)** (no login). Locally that is [`/guide`](http://localhost:5173/guide). Planned work that is **not in the product yet** is **[Upcoming features](https://tandemcrm.vercel.app/upcoming)** (`/upcoming`).

**Audience:** stakeholders, QA, and anyone reviewing acceptance details — not first-time readers of the product.

**Related technical docs:**

- [Architecture](architecture.md) - system design, auth, multi-org readiness, notifications pipeline, scaling
- [Database schema](database-schema.md) - table-level reference
- [ER diagram](er-diagram.md) - entity relationships
- [OpenAPI specification](openapi.yaml) - REST API contract

---

## Table of contents

1. [Product overview](#1-product-overview)
2. [User types and tenancy](#2-user-types-and-tenancy)
3. [Platform administrators](#3-platform-administrators)
4. [Organization feature modules](#4-organization-feature-modules)
5. [Navigation and landing behavior](#5-navigation-and-landing-behavior)
6. [Roles and default permissions](#6-roles-and-default-permissions)
7. [Permission catalog](#7-permission-catalog)
8. [Feature areas](#8-feature-areas)
9. [Leads and sales pipeline](#9-leads-and-sales-pipeline)
10. [Activities](#10-activities)
11. [Notifications](#11-notifications)
12. [Audit trail](#12-audit-trail)
13. [Dashboard and widgets](#13-dashboard-and-widgets)
14. [Account settings](#14-account-settings)
15. [List and table reference](#15-list-and-table-reference)
16. [Shared list UX patterns](#16-shared-list-ux-patterns)
17. [Future scope](#17-future-scope)
18. [Glossary](#18-glossary)
19. [Development seed accounts](#19-development-seed-accounts)
20. [UI screenshots](#20-ui-screenshots)

---

## 1. Product overview

Tandem is a **multi-tenant sales platform**. Each **organization** (tenant) has its own users, teams, roles, leads, and configuration. A separate **platform** layer sits above tenants for cross-organization administration.

### What the product includes today

| Capability         | Description                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Multi-tenancy**  | Shared database with row-level isolation per organization                                                        |
| **Authentication** | Email/password login with httpOnly cookie sessions (access + refresh tokens)                                     |
| **RBAC**           | One role per org membership (platform admins: one platform role); permissions enforced on API and mirrored in UI |
| **Teams**          | Org teams with member management                                                                                 |
| **Sales CRM**      | Lead pipeline with assignment, status workflow, and activity logging                                             |
| **Dashboards**     | Role-scoped analytics with customizable widget layouts                                                           |
| **Notifications**  | In-app alerts for lead events and account welcome                                                                |
| **Audit trails**   | Append-only compliance logs at org and platform scope                                                            |
| **Platform admin** | Create/suspend orgs, manage modules, manage platform admins                                                      |
| **Rate limiting**  | `/api/v1`: 300 req/min and 60 writes/min per IP; login/refresh 20 / 15 min. `/health` is open. 429 when exceeded |

### What is out of scope in the MVP

- **Sending emails** — assignment, new lead, welcome, password reset, and org-admin credentials when a company is created stay in-app until the email channel ships. SMS and push are also out of scope. See [§17 Future scope](#17-future-scope)
- Real-time delivery (WebSockets / SSE)
- **Per-tenant databases** — shared Postgres with `organizationId` today. A database per company is upcoming. See [§17 Future scope](#17-future-scope)
- **Microservices** — one Express API today. Splitting into services is upcoming. See [§17 Future scope](#17-future-scope)
- **Mobile apps** — website only today (phone browser works; no App Store / Play Store app). See [§17 Future scope](#17-future-scope)
- External CRM integrations
- **Org switcher** — one person in two organizations, pick which one after login (schema ready; not in the UI or API). See [§17 Future scope](#17-future-scope) and [Architecture — Multi-Org Readiness](architecture.md#multi-org-readiness)
- **Invite existing email into a second org** — adding an email that already exists fails. Membership-only invite is upcoming. See [§17 Future scope](#17-future-scope)
- **Forgot password / admin reset** — no Forgot password on login; admins cannot set a temporary password. See [§17 Future scope](#17-future-scope)
- **SSO / Google login** — email and a Tandem password only. See [§17 Future scope](#17-future-scope)
- **Auto-assignment** — a person assigns each lead. Round-robin or least-loaded distribution is not in the product. See [§17 Future scope](#17-future-scope)
- **Redis** — unread badge is a Postgres count every 60s; alerts are in-process, so only one API instance is safe. Shorter polling waits on Redis. See [§17 Future scope](#17-future-scope)

See [Future scope](#17-future-scope) for planned evolution.

---

## 2. User types and tenancy

### Platform users

- **Who:** Platform administrators (`platform_admin` role)
- **Org membership:** None — no `organization_members` rows
- **Access:** Cross-tenant APIs under `/platform/*`, platform audit, notifications (always available, no org module gate)
- **Typical tasks:** Provision organizations, suspend tenants, toggle feature modules, manage other platform admins

### Organization users

- **Who:** Everyone inside a tenant (org admin, executives, team leaders, etc.)
- **Org membership:** Exactly one `organization_members` row in the product today. Extra memberships are an upcoming org-switcher feature, not shipped.
- **Access:** Org-scoped APIs (`/users`, `/teams`, `/leads`, etc.); active tenant comes from the session JWT (`orgId`)
- **Typical tasks:** Manage users/teams, work leads, view dashboards, read org audit

### Organization lifecycle

| Status        | Effect                                                                        |
| ------------- | ----------------------------------------------------------------------------- |
| **Active**    | Org users can sign in and use enabled modules                                 |
| **Suspended** | All org user logins blocked; existing sessions invalidated on next auth check |

Platform admins suspend or reactivate organizations from the organization list or detail page.

### Multi-tenant strategy

Tandem uses **shared-database, row-level multi-tenancy** — a deliberate MVP choice that balances simplicity with strong isolation.

| Approach | Used? | Notes |
| -------- | ----- | ----- |
| **Single PostgreSQL database** | Yes | All tenants share one database instance |
| **Row-level isolation** | Yes | Tenant data carries an `organizationId` foreign key |
| **Per-tenant databases or schemas** | No | Shared DB today; a database per company is **upcoming** |
| **Subdomain-based tenant routing** | No | Tenant is implicit from the authenticated session, not the URL |
| **Tenant ID in org-scoped API URLs** | No | Org context comes from the JWT / session, not path parameters |

**How tenant context flows:**

1. User signs in; the access token carries `sub` (user ID) and `orgId` (active organization).
2. On every request, the API reloads full auth context from the database (role, permissions, modules).
3. Org-scoped services call `requireOrganizationId()` and repositories add `WHERE organizationId = …` to every query.
4. Platform admins (`orgId = null`) use separate `/platform/*` APIs with explicit `platform:*` permissions.

This model keeps deployment simple (one API, one database) while making tenant boundaries enforceable in code. See [Architecture — Multi-Tenant Design](architecture.md#multi-tenant-design) for the technical diagram.

### Tenant data isolation

**A user belonging to one organization must never access another organization's data.** This is enforced at multiple layers:

| Layer | Enforcement |
| ----- | ----------- |
| **Authentication** | Org users are bound to their active `orgId` from the session; suspended orgs block login |
| **Repository queries** | All tenant tables (`teams`, `leads`, `users` via membership, etc.) are filtered by `organizationId` |
| **Service-layer scoping** | Lead and user services apply permission-based record filters (own / team / org) *within* the tenant |
| **Cross-tenant responses** | Accessing a record outside the caller's org or scope returns **404 Not Found** (not 403), so existence of other tenants' data is not leaked |
| **Platform boundary** | Only platform admins with `platform:*` permissions can access cross-tenant APIs under `/platform/*` |

Org audit (`/audit`) is limited to the caller's organization. Platform audit (`/platform/audit`) is the only UI that spans tenants, and it requires `platform:audit:read`.

---

## 3. Platform administrators

### What is a platform admin?

A **platform administrator** is a user account with:

- No organization membership rows
- The built-in **`platform_admin`** role (stored in `user_roles`, not on a membership)
- Permissions to manage the entire platform across all tenants

Platform admins operate in the **Platform** section of the sidebar. They do not see org-scoped items (Users, Teams, Leads) unless they also had an org account - in the current product, platform admins are platform-only users.

### What platform admins can do

| Area                                         | Route                         | Required permission                            |
| -------------------------------------------- | ----------------------------- | ---------------------------------------------- |
| Platform overview (orgs, active users, leads)| `/platform`                   | `platform:orgs:read`                           |
| View/create/update organizations             | `/platform/organizations`     | `platform:orgs:read` / `platform:orgs:write`   |
| Organization detail (edit, suspend, modules) | `/platform/organizations/:id` | `platform:orgs:write` for mutations            |
| View/create platform admins                  | `/platform/admins`            | `platform:users:read` / `platform:users:write` |
| Platform audit trail                         | `/platform/audit`             | `platform:audit:read`                          |
| Notifications                                | Bell + `/notifications`       | Always (no org module gate)                    |

The default **`platform_admin`** role includes all platform permissions:

- `platform:orgs:read`, `platform:orgs:write`
- `platform:users:read`, `platform:users:write`
- `platform:audit:read`

### How platform admins are created

There are **three ways** a platform admin account can exist:

#### 1. Database seed (development)

Running `npm run db:seed` creates two platform admins. Open their inboxes at [yopmail.com](https://yopmail.com).

| Email | Name | Password |
| ----- | ---- | -------- |
| `tandem.admin@yopmail.com` | Platform Admin | `Admin@123` |
| `tandem.oracle@yopmail.com` | Oracle | `Tandem@123` |

This is intended for local development and demos only. Org admin accounts from the same seed are listed in [Development seed accounts](#19-development-seed-accounts).

#### 2. Another platform admin creates them (production path)

A platform admin with `platform:users:write`:

1. Opens **Platform → Platform admins** (`/platform/admins`)
2. Clicks **Add platform admin**
3. Fills in **Name**, **Email**, and **Password** (default password is pre-filled but editable)
4. Submits the dialog

**What happens on create:**

- Global user record created (email, name, password)
- `platform_admin` role assigned via `user_roles`
- `must_change_password = true` — a welcome notification asks them to change it; they can ignore it and keep the password they were given
- **Welcome notification** (`WELCOME_CHANGE_PASSWORD`) created, linking to `/account`
- **Audit event** `PLATFORM_USER_CREATED` logged to platform audit
- Password must meet strength rules (same as all user passwords)

#### 3. Cannot self-register

There is no public signup. All platform admins must be seeded or created by an existing platform admin.

### Platform admin management rules

| Rule                      | Detail                                                 |
| ------------------------- | ------------------------------------------------------ |
| **View list**             | Requires `platform:users:read`                         |
| **Create**                | Requires `platform:users:write`                        |
| **Activate / deactivate** | Requires `platform:users:write`                        |
| **Self-deactivation**     | Blocked — you cannot deactivate your own account       |
| **Last admin protection** | Cannot deactivate the last active platform admin       |
| **Email uniqueness**      | Email must be unique across all users (platform + org) |

### Creating an organization (platform admin workflow)

Platform admins with `platform:orgs:write` create tenants from **Platform → Organizations**:

1. Click **Create organization**
2. Enter organization **name**, **code** (lowercase letters, numbers, hyphens - auto-suggested from name), optional **description** and **logo URL**
3. Enter the first **org admin** credentials: name, email, password
4. Submit

**What happens on create (single transaction):**

- Organization row created (status `ACTIVE`)
- Default org roles seeded (`org_admin`, `executive`, `team_lead`, `sales_manager`, `director`)
- All three feature modules enabled (`sales`, `dashboards`, `notifications`)
- Org admin user created with an `organization_members` row and `org_admin` role
- Org admin receives welcome notification and `must_change_password = true`
- Audit event `ORG_CREATED` logged

Org admins then manage their tenant independently (users, teams, leads, etc.).

---

## 4. Organization feature modules

Platform admins can enable or disable modules **per organization** on the organization detail page. New organizations start with **all modules enabled**.

| Module key      | UI label      | What it unlocks when enabled                                         |
| --------------- | ------------- | -------------------------------------------------------------------- |
| `sales`         | Sales         | Leads list/detail, lead CRUD, activities, lead-related notifications |
| `dashboards`    | Dashboards    | Analytics dashboard and widget customization                         |
| `notifications` | Notifications | Notification bell, notification center, lead-event alerts            |

When a module is **disabled**:

- Backend routes for that module return 403
- Sidebar navigation for that module is hidden
- Lead-event notifications are not created (welcome notifications still work)

Platform users are **not** gated by org modules for notifications.

---

## 5. Navigation and landing behavior

After login, `/` redirects to the **first accessible route** in this priority order:

1. `/dashboard` - if `dashboards` module + any dashboard permission
2. `/platform` - if platform admin
3. `/platform/audit` - if `platform:audit:read`
4. `/leads` - if `sales` module + any lead read permission
5. `/my-team` - if `users:read:team` and not `teams:read`
6. `/users` - if `users:read`
7. `/teams` - if `teams:read`
8. `/audit` - if `audit:read`
9. `/roles` - if `roles:write`
10. `/home` - fallback empty landing

### Sidebar sections

| Section          | Visible when                                                        |
| ---------------- | ------------------------------------------------------------------- |
| **Platform**     | Dashboard, platform audit, platform orgs, or platform admins access |
| **Sales**        | `sales` module + lead read permission → Leads                   |
| **Organization** | Users, Teams, My team, Roles, Audit (each permission-gated)         |

The app supports **light**, **dark**, and **system** themes via the header toggle.

---

## 6. Roles and default permissions

Each org user has **one role per organization** (stored on their `organization_members` row). Platform admins have a single platform role. Built-in role slugs are **protected** and cannot be deleted. Org admins can create **custom roles** by selecting permissions from the catalog.

### Role implementation approach

Roles are **data-driven**, not hard-coded in application logic:

| Concept | Implementation |
| ------- | -------------- |
| **Permission catalog** | Global list of permission keys with labels and scope (`PLATFORM` or `ORGANIZATION`); seeded in the `permissions` table |
| **Roles** | Per-organization (or platform-level) records linked to permissions via `role_permissions` |
| **Assignment** | One role per org membership on `organization_members`; platform admins get `platform_admin` via `user_roles` |
| **Built-in roles** | Defined in application code (`defaultRoles.ts`) and **seeded** when an org is created; slugs are protected from deletion |
| **Custom roles** | Org admins create new roles and pick permissions from the catalog via the Roles UI |
| **Membership scope** | Each role has `TEAM` or `ORGANIZATION` scope — team roles require team membership and can only be assigned from team flows |
| **Grant scope** | Some permissions are tagged `team` or `org_wide` in the catalog; role service validates that team-scoped roles cannot receive org-wide-only permissions |

Team leaders creating members see only **team-assignable** roles (`executive`, `team_lead`). Org admins assigning from the Users page see **org-assignable** roles.

### RBAC implementation strategy

Authorization uses **two enforcement layers** — coarse gates at the route, fine-grained scoping in services:

```text
Request → rate limit (`/api/v1`) → authenticate → requireOrgModule (if applicable) → requirePermission → service data scope → repository (organizationId filter)
```

Rate limits (per client IP, in this API process): **300 requests / minute** on `/api/v1`, **60 writes / minute** (POST/PATCH/PUT/DELETE), and **20 login or refresh attempts / 15 minutes**. `/health` is not limited. Exceeding a limit returns **429** `TOO_MANY_REQUESTS`.

| Layer | Question answered | Example |
| ----- | ----------------- | ------- |
| **1 — Route middleware** | Can this user perform this *type* of action? | `requirePermission('leads:write')` on `POST /leads` |
| **2 — Service scoping** | Can this user access *this specific record*? | Executive with `leads:read` sees only assigned leads; team lead with `leads:read:team` sees team leads |

**Frontend mirrors backend** for UX (sidebar visibility, route guards) but is **advisory only** — the API is authoritative.

| Mechanism | Purpose |
| --------- | ------- |
| `RequirePermission` route guard | Block navigation to unauthorized pages |
| `authSelectors` (`selectHasPermission`, `selectHasModule`) | Conditional UI rendering |
| `leadAccess.service` / `user.service` | Record-level list and single-record filters |

Permission changes take effect on the **next request** — the JWT is not the source of truth; the database role assignment is reloaded on every authenticated call.

### Role summary

| Role           | Slug             | Scope        | Team membership required | Assignable from                  |
| -------------- | ---------------- | ------------ | ------------------------ | -------------------------------- |
| Platform Admin | `platform_admin` | Platform     | No                       | N/A (seed / platform admin only) |
| Org Admin      | `org_admin`      | Organization | No                       | Users page                       |
| Executive      | `executive`      | Team         | **Yes**                  | Team member creation             |
| Team Leader    | `team_lead`      | Team         | **Yes**                  | Team member creation             |
| Sales Manager  | `sales_manager`  | Organization | No                       | Users page                       |
| Director       | `director`       | Organization | No                       | Users page                       |

### Default permissions by role

#### Platform Admin

| Permission             | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `platform:orgs:read`   | View organizations                                  |
| `platform:orgs:write`  | Create/update/suspend organizations, toggle modules |
| `platform:users:read`  | View platform admins                                |
| `platform:users:write` | Create/activate/deactivate platform admins          |
| `platform:audit:read`  | View platform audit trail                           |

#### Org Admin

| Permission       | Purpose                            |
| ---------------- | ---------------------------------- |
| `users:read`     | View all org users                 |
| `users:write`    | Create/update/deactivate org users |
| `teams:read`     | View teams                         |
| `teams:write`    | Create teams, manage memberships   |
| `roles:read`     | View roles and permissions         |
| `roles:write`    | Create/update/delete custom roles  |
| `leads:read:org` | View all leads in the organization |
| `dashboard:org`  | Organization-wide dashboard        |
| `audit:read`     | View organization audit trail      |

Org admins do **not** get activity logging or lead write/status permissions by default — they are administrators, not sales operators. They do get the company dashboard so they can see numbers.

#### Executive

| Permission           | Purpose                              |
| -------------------- | ------------------------------------ |
| `leads:read`         | View leads assigned to self          |
| `leads:write`        | Create walk-ins (assigned to self)   |
| `leads:assignable`   | Can be set as lead owner             |
| `leads:status:write` | Advance status on own assigned leads |
| `activities:write`   | Log activities on accessible leads   |
| `dashboard:me`       | Personal dashboard                   |

#### Team Leader

| Permission                | Purpose                     |
| ------------------------- | --------------------------- |
| `users:read:team`         | View users on own team      |
| `users:write:team`        | Create users on own team    |
| `roles:read:team`         | View team-assignable roles  |
| `leads:read:team`         | View all leads on own team  |
| `leads:write`             | Create/update leads on team |
| `leads:assignable`        | Can be set as lead owner    |
| `leads:status:write:team` | Change status on team leads |
| `activities:write`        | Log activities on owned leads |
| `dashboard:team`          | Team dashboard              |

#### Sales Manager

| Permission       | Purpose                     |
| ---------------- | --------------------------- |
| `leads:read:org` | View all org leads          |
| `leads:write`    | Create/update any org lead  |
| `dashboard:org`  | Organization-wide dashboard |

#### Director

| Permission       | Purpose                            |
| ---------------- | ---------------------------------- |
| `users:read`     | View all org users                 |
| `teams:read`     | View teams                         |
| `roles:read`     | View roles and permissions         |
| `leads:read:org` | View all org leads                 |
| `leads:write`    | Create/update any org lead         |
| `dashboard:org`  | Organization-wide dashboard        |
| `audit:read`     | View organization audit trail      |

### Data access scoping (leads and users)

Permissions control both **route access** and **record visibility**:

| Lead permission   | List shows               | Single lead access     |
| ----------------- | ------------------------ | ---------------------- |
| `leads:read:org`  | All org leads            | Any lead in org        |
| `leads:read:team` | Leads on caller's team   | Leads on caller's team |
| `leads:read`      | Leads assigned to caller | Only assigned leads    |

Cross-tenant or out-of-scope records return **404** (not 403) to avoid leaking existence.

---

## 7. Permission catalog

Full list of permissions available when creating custom roles or understanding built-in roles.

### Platform permissions

| Key                    | Label                     | Description                                |
| ---------------------- | ------------------------- | ------------------------------------------ |
| `platform:orgs:read`   | View organizations        | View all organizations on the platform     |
| `platform:orgs:write`  | Manage organizations      | Create and update organizations            |
| `platform:users:read`  | View platform admins      | View platform administrator accounts       |
| `platform:users:write` | Manage platform admins    | Create platform administrator accounts     |
| `platform:audit:read`  | View platform audit trail | View audit events across all organizations |

### Organization permissions

| Key                       | Label                  | Grant scope | Description                         |
| ------------------------- | ---------------------- | ----------- | ----------------------------------- |
| `users:read`              | View users             | Org-wide    | View users in the organization      |
| `users:read:team`         | View team users        | Team        | View users on caller's team         |
| `users:write`             | Manage users           | Org-wide    | Create, update, deactivate users    |
| `users:write:team`        | Manage team users      | Team        | Create users on caller's team       |
| `teams:read`              | View teams             | Org-wide    | View teams                          |
| `teams:write`             | Manage teams           | Org-wide    | Create/update teams and memberships |
| `roles:read`              | View roles             | Org-wide    | View roles and permissions          |
| `roles:read:team`         | View team roles        | Team        | View team-assignable roles          |
| `roles:write`             | Manage roles           | Org-wide    | Create/update roles and permissions |
| `leads:read`              | View own leads         | —           | Leads assigned to user              |
| `leads:read:team`         | View leads in team     | Team        | Leads on caller's team              |
| `leads:read:org`          | View all org leads     | Org-wide    | All leads in organization           |
| `leads:write`             | Manage leads           | Org-wide    | Create and update leads             |
| `leads:status:write`      | Update own lead status | —           | Status changes on assigned leads    |
| `leads:status:write:team` | Update leads in team   | Team        | Status changes on team leads        |
| `leads:assignable`        | Can be assigned leads  | —           | User may be lead owner              |
| `activities:write`        | Log activities         | —           | Create activities on leads          |
| `dashboard:me`            | My dashboard           | —           | Personal sales analytics            |
| `dashboard:team`          | Team dashboard         | Team        | Team sales analytics                |
| `dashboard:org`           | Organization dashboard | Org-wide    | Org-wide sales analytics            |
| `audit:read`              | View audit trail       | Org-wide    | Organization audit trail            |

---

## 8. Feature areas

| Feature             | Route(s)                      | Who can access                                       | Module          |
| ------------------- | ----------------------------- | ---------------------------------------------------- | --------------- |
| Login               | `/login`                      | Guests                                               | —               |
| Account             | `/account`                    | Authenticated                                        | —               |
| Dashboard           | `/dashboard`                  | Dashboard permission                                 | `dashboards`    |
| Leads list          | `/leads`                      | Any lead read permission                             | `sales`     |
| Lead detail         | `/leads/:id`                  | Lead read scope for that record                      | `sales`     |
| Users               | `/users`                      | `users:read`                                         | —               |
| Teams               | `/teams`, `/teams/:id`        | `teams:read`                                         | —               |
| My team             | `/my-team`                    | `users:read:team` (without `teams:read`)             | —               |
| Roles               | `/roles`                      | `roles:write`                                        | —               |
| Org audit           | `/audit`                      | `audit:read`                                         | —               |
| Notifications       | Bell, `/notifications`        | Authenticated; org users need `notifications` module | `notifications` |
| Platform overview   | `/platform`                   | `platform:orgs:read`                                 | —               |
| Platform orgs       | `/platform/organizations`     | `platform:orgs:read`                                 | —               |
| Platform org detail | `/platform/organizations/:id` | `platform:orgs:read`                                 | —               |
| Platform admins     | `/platform/admins`            | `platform:users:read`                                | —               |
| Platform audit      | `/platform/audit`             | `platform:audit:read`                                | —               |
| Privacy / Terms     | `/privacy`, `/terms`          | Public                                               | —               |
| Home                | `/home`                       | Fallback landing                                     | —               |

Visual reference for major screens is in [§20 UI screenshots](#20-ui-screenshots).

---

## 9. Leads and sales pipeline

### Lead fields

| Field                        | Description                                   |
| ---------------------------- | --------------------------------------------- |
| Name                         | Lead contact name (required)                  |
| Mobile number                | Optional phone                                |
| Email                        | Optional email                                |
| Source                       | Optional lead source                          |
| Project                      | Optional project/property reference           |
| Team                         | Team the lead belongs to (required on create) |
| Assigned user                | Executive or other assignable user (optional). Assignment is **manual** — there is no round-robin or least-loaded auto-assign |
| Status                       | Pipeline stage (see below)                    |
| Lost reason                  | Required when status is Lost                  |
| Deal value                   | Optional number stored on win                 |
| Expected close date          | Optional date on the lead                     |
| Created by                   | User who created the lead                     |
| Created / updated timestamps | Audit timestamps                              |

### Lead statuses and workflow

| Status                 | Label                | Stage type       |
| ---------------------- | -------------------- | ---------------- |
| `NEW`                  | New                  | Linear (default) |
| `CONTACTED`            | Contacted            | Linear           |
| `VISIT_SCHEDULED`      | Visit scheduled      | Linear           |
| `SITE_VISIT_COMPLETED` | Site visit completed | Linear           |
| `NEGOTIATION`          | Negotiation          | Linear           |
| `WON`                  | Won                  | Terminal         |
| `LOST`                 | Lost                 | Terminal         |

**Usual path:** New → Contacted → Visit scheduled → Site visit completed → Negotiation → Won or Lost. **Site visit stages stay.** Per-org custom status names are upcoming (`/upcoming`).

**Rules:**

- You can skip, go backwards, or mark Won/Lost from any open stage
- Closed (Won/Lost) leads cannot be edited, reassigned, or given activities until **reopened**
- Marking Lost requires a **lost reason**. Marking Won can store an optional **deal value**. Open leads can have an **expected close date**
- Dashboards show **won value** (sum of deal value on Won leads), not only counts

### Lead status change tracking

Every lead status change is **tracked and visible** on the lead detail page.

| Mechanism | What is recorded |
| --------- | ---------------- |
| **Audit log** | Each status change writes `LEAD_STATUS_CHANGED` to `audit_logs` with `before.status`, `after.status`, actor, and timestamp |
| **Status history API** | `GET /api/v1/leads/:id/status-history` builds a timeline from audit records |
| **Lead detail UI** | **Status history** section shows a chronological timeline: initial creation (→ New) plus each transition (from → to) with who changed it and when |

Status history is derived from the **audit trail**, not a separate `lead_status_history` table — a single source of truth for compliance and UI. Initial creation appears as the first entry (from `LEAD_CREATED` audit or lead `createdAt` fallback).

Status changes also emit a `LEAD_STATUS_CHANGED` **domain event** (for notifications) and appear in the org audit trail as `LEAD_STATUS_CHANGED`.

### Lead detail page (`/leads/:id`)

Not a table — a detail view with:

| Section           | Content                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Header            | Name, status badge, team, assignee                                                                           |
| Actions           | Assign (requires `leads:write` + `leads:read:team`), Edit (`leads:write`), Log activity (`activities:write`) |
| Contact card      | Mobile, email, source, project, created date                                                                 |
| Status stepper    | Visual pipeline progress                                                                                     |
| Status advance    | Next allowed status buttons (`leads:status:write` on own lead, or `leads:status:write:team` / `leads:write`) |
| Status history    | Timeline of status changes                                                                                   |
| Activity timeline | Chronological activity log (paginated fetch, not a sortable table)                                           |

**Back navigation** preserves the leads list filters via URL query string.

---

## 10. Activities

Activities are **sales interactions logged against a lead**. They are separate from audit logs and notifications.

### Activity types

| Type              | UI label        |
| ----------------- | --------------- |
| `CALL`            | Call            |
| `EMAIL`           | Email           |
| `OFFLINE_MEETING` | Offline meeting |
| `ONLINE_MEETING`  | Online meeting  |
| `SITE_VISIT`      | Site visit      |
| `MESSAGE`         | Message         |
| `NOTE`            | Note            |

### Who can log activities

Users with `activities:write` permission (default: **Executive**).

### Required fields

- **Type** — one of the types above
- **Notes** — free-text description of the interaction

### Side effects

| System           | Behavior                                                                            |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Audit**        | `ACTIVITY_LOGGED` event with activity metadata                                      |
| **Notification** | Team leaders notified (`ACTIVITY_LOGGED`) unless the actor is already a team leader |
| **Dashboard**    | Counted in activity metrics on dashboards                                           |

---

## 11. Notifications

In-app notifications only. **Sending emails is upcoming, not in the product.** No SMS. Delivery uses **REST polling** (every 60 seconds), not WebSockets.

### Implementation approach (event-driven, loosely coupled)

Notifications follow an **event-driven, loosely coupled** design. The Sales module (leads, activities) **does not create notification rows directly**.

```text
lead.service / activity.service  →  eventBus.emit(domain event)  →  notification.handler  →  notifications table
```

| Principle | How it is applied |
| --------- | ----------------- |
| **Separation of concerns** | Domain services (`lead.service`, `activity.service`) persist business data and emit events; they have no dependency on the notification system |
| **In-process event bus** | A lightweight `EventEmitter` dispatches events after successful DB writes (`LEAD_CREATED`, `LEAD_ASSIGNED`, `LEAD_REASSIGNED`, `LEAD_STATUS_CHANGED`, `ACTIVITY_LOGGED`) |
| **Dedicated handler** | `notification.handler` subscribes at server startup, resolves recipients, checks the `notifications` org module, and bulk-inserts notification rows |
| **Fire-and-forget** | Handler errors are caught and logged; they do not fail the originating lead/activity operation |
| **Welcome notifications** | Account welcome alerts (`WELCOME_CHANGE_PASSWORD`) are created by `welcomeNotification.service` during user provisioning — the only path that writes notifications outside the event handler |

This keeps the Sales module independent of notification delivery. Disabling the `notifications` module stops the handler from persisting lead-event alerts without changing lead or activity code.

See [Architecture — Notification Design](architecture.md#notification-design) for the full pipeline diagram.

### Notification types

| Type                      | Title (typical)                | Body (typical)                                       | Recipients                                | Module gate     |
| ------------------------- | ------------------------------ | ---------------------------------------------------- | ----------------------------------------- | --------------- |
| `LEAD_CREATED`            | New unassigned lead            | "{name} was added to your team and needs assignment" | Team leaders (excl. actor)                | Yes             |
| `LEAD_ASSIGNED`           | Lead assigned to you           | "{name} has been assigned to you"                    | New assignee (excl. self-assign)          | Yes             |
| `LEAD_REASSIGNED`         | Lead reassigned                | "{name} is no longer assigned to you"                | Previous assignee (excl. actor)           | Yes             |
| `LEAD_STATUS_CHANGED`     | Lead status updated            | "{name} is now {status}"                             | Current assignee (excl. actor)            | Yes             |
| `ACTIVITY_LOGGED`         | New activity on lead           | "{actor} logged a {type} on {name}"                  | Team leaders (excl. actor if team leader) | Yes             |
| `WELCOME_CHANGE_PASSWORD` | Welcome — change your password | Prompt to change default password                    | New user                                  | **No** (always) |

### Click behavior

| Notification      | Navigates to      |
| ----------------- | ----------------- |
| Lead-related      | `/leads/{leadId}` |
| Welcome / account | `/account`        |

Clicking a notification **marks it as read** before navigation.

### Notification bell (header)

- Visible when authenticated and (`notifications` module enabled **or** user is platform admin)
- Polls unread count every **60 seconds**
- Dropdown shows latest **10** notifications when opened (fetched on open, not on every poll)
- **Mark all read** available in dropdown and full page

---

## 12. Audit trail

Audit logs are **append-only** records for compliance and security. They are **not** editable and differ from activities (sales work) and notifications (user alerts).

### Org audit vs platform audit

|                         | Org audit           | Platform audit        |
| ----------------------- | ------------------- | --------------------- |
| **Route**               | `/audit`            | `/platform/audit`     |
| **Permission**          | `audit:read`        | `platform:audit:read` |
| **Scope**               | Single organization | All organizations     |
| **Organization column** | Hidden              | Shown                 |

### Audit actions

| Action                      | UI label                     | Category |
| --------------------------- | ---------------------------- | -------- |
| `AUTH_LOGIN_SUCCESS`        | Login success                | Auth     |
| `AUTH_LOGIN_FAILED`         | Login failed                 | Auth     |
| `AUTH_LOGOUT`               | Logout                       | Auth     |
| `AUTH_TOKEN_REFRESHED`      | Token refreshed              | Auth     |
| `AUTH_TOKEN_REFRESH_FAILED` | Token refresh failed         | Auth     |
| `AUTH_SESSION_REVOKED`      | Session revoked              | Auth     |
| `AUTH_PROFILE_UPDATED`      | Profile updated              | Auth     |
| `AUTH_PASSWORD_CHANGED`     | Password changed             | Auth     |
| `LEAD_CREATED`              | Lead created                 | Lead     |
| `LEAD_UPDATED`              | Lead updated                 | Lead     |
| `LEAD_STATUS_CHANGED`       | Lead status changed          | Lead     |
| `LEAD_ASSIGNED`             | Lead assigned                | Lead     |
| `LEAD_REASSIGNED`           | Lead reassigned              | Lead     |
| `LEAD_UNASSIGNED`           | Lead unassigned              | Lead     |
| `ACTIVITY_LOGGED`           | Activity logged              | Lead     |
| `USER_CREATED`              | User created                 | Admin    |
| `USER_ACTIVATED`            | User activated               | Admin    |
| `USER_DEACTIVATED`          | User deactivated             | Admin    |
| `TEAM_CREATED`              | Team created                 | Admin    |
| `TEAM_MEMBER_ADDED`         | Team member added            | Admin    |
| `ROLE_CREATED`              | Role created                 | Admin    |
| `ROLE_UPDATED`              | Role updated                 | Admin    |
| `ROLE_DELETED`              | Role deleted                 | Admin    |
| `ORG_CREATED`               | Organization created         | Admin    |
| `ORG_UPDATED`               | Organization updated         | Admin    |
| `ORG_STATUS_CHANGED`        | Organization status changed  | Admin    |
| `ORG_MODULES_UPDATED`       | Organization modules updated | Admin    |
| `PLATFORM_USER_CREATED`     | _(platform audit only)_      | Admin    |

### Entity types

`auth`, `lead`, `activity`, `user`, `team`, `role`, `organization`

### Expandable row detail

Click the expand control on an audit row to reveal:

- **Before** / **After** snapshots (when applicable)
- Changed fields list
- Permissions added / removed (role updates)
- Related entity references
- Request IP and user agent (when captured)

---

## 13. Dashboard and widgets

Route: `/dashboard`

Requires **`dashboards` module** plus one of:

| View   | Permission       | Default role | Title                  |
| ------ | ---------------- | ------------ | ---------------------- |
| `me`   | `dashboard:me`   | Executive    | My dashboard           |
| `team` | `dashboard:team` | Team Leader  | Team dashboard         |
| `org`  | `dashboard:org`  | Director, Sales Manager, Org Admin | Organization dashboard |

The API picks the highest applicable view for the user's permissions.

### Customization

- **Customize** sheet lets users show/hide widgets and reorder them
- Layout saved per user in `user_dashboard_layouts`
- **Reset to default** restores the built-in layout for that view

### Widget catalog by view

#### Personal dashboard (`me`) — Executive

| Widget key                | Label                       | Width | Description                                                |
| ------------------------- | --------------------------- | ----- | ---------------------------------------------------------- |
| `conversion_overview`     | Conversion overview         | Full  | Assigned leads, open pipeline, conversion rate, activities |
| `conversion_chart`        | Conversion outcomes (chart) | Half  | Donut: open, won, lost                                     |
| `win_rate_chart`          | Win rate (chart)            | Half  | Pie: won vs lost among closed                              |
| `pipeline_stats`          | Pipeline stats              | Full  | Needs attention, won, lost, closed counts                  |
| `status_breakdown`        | Lead status                 | Half  | Counts by status                                           |
| `status_pie_chart`        | Lead status (chart)         | Half  | Pie chart by status                                        |
| `recent_activities`       | Recent activities           | Half  | Latest interactions (card list)                            |
| `recent_activities_table` | Recent activities (table)   | Half  | Tabular recent interactions                                |

#### Team dashboard (`team`) — Team Leader

All personal widgets **plus:**

| Widget key                   | Label                    | Description                           |
| ---------------------------- | ------------------------ | ------------------------------------- |
| `assignee_leaderboard`       | Team leaderboard         | Lead counts and win rates by assignee |
| `assignee_performance_chart` | Team performance (chart) | Bar chart of leads by assignee        |

Team-specific copy adjusts metrics (e.g. "leads in team", unassigned count).

#### Organization dashboard (`org`) — Director, Sales Manager, Org Admin

All shared widgets **plus:**

| Widget key             | Label                  | Description                          |
| ---------------------- | ---------------------- | ------------------------------------ |
| `top_teams`            | Top teams              | Lead performance by team (table)     |
| `top_teams_chart`      | Top teams (chart)      | Bar chart of team performance        |
| `top_executives`       | Top executives         | Lead performance by assignee (table) |
| `top_executives_chart` | Top executives (chart) | Bar chart of executive performance   |

### Dashboard performance tables (read-only)

These widgets render tables with **no search, sort, filter, or pagination**:

| Widget                    | Columns                               |
| ------------------------- | ------------------------------------- |
| Top teams                 | Team, Total, Won, Lost, Win rate      |
| Top executives            | Executive, Total, Won, Lost, Win rate |
| Team leaderboard          | Assignee, Total, Won, Lost, Win rate  |
| Recent activities (table) | Type, Lead (link), Notes, By, When    |

---

## 14. Account settings

Route: `/account` — available to all authenticated users.

| Section          | Capabilities                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| **Profile**      | Update name; view email (read-only)                                          |
| **Password**     | Change password from Account (optional). Tandem does not block the rest of the app |
| **Welcome flow** | Welcome notification links here; changing password clears `must_change_password`. Ignoring it is allowed |

Profile and password changes generate audit events (`AUTH_PROFILE_UPDATED`, `AUTH_PASSWORD_CHANGED`).

---

## 15. List and table reference

This section documents every list/table UI in the product: columns, search, sort, filters, pagination, and interactions.

For shared behavior (debounce timing, page sizes, URL sync), see [Shared list UX patterns](#16-shared-list-ux-patterns).

---

### Users (`/users`)

**Access:** `users:read`

| Column  | Sortable | Notes                          |
| ------- | -------- | ------------------------------ |
| Name    | Yes      |                                |
| Email   | Yes      |                                |
| Role    | Yes      | Role display name              |
| Team    | Yes      | Team name or empty             |
| Status  | Yes      | Active / Inactive badge        |
| Created | Yes      | Default sort: **Created desc** |
| Actions | —        | Shown if `users:write`         |

| Feature          | Behavior                                                                           |
| ---------------- | ---------------------------------------------------------------------------------- |
| **Search**       | Name or email; **300 ms debounce**                                                 |
| **Filters**      | Status: All / Active / Inactive; Role dropdown; Team dropdown (includes "No team") |
| **Sort**         | Server-side; click column header toggles asc/desc                                  |
| **Pagination**   | Server; page sizes **10, 20, 50**                                                  |
| **Row click**    | None                                                                               |
| **Actions**      | Activate / Deactivate via row menu (not on self)                                   |
| **Create**       | "Add user" button (`users:write`)                                                  |
| **Empty states** | Global empty with CTA; filtered empty with "Clear filters"                         |

---

### Teams (`/teams`)

**Access:** `teams:read`

| Column  | Sortable               |
| ------- | ---------------------- |
| Name    | Yes                    |
| Members | Yes (member count)     |
| Created | Yes (default **desc**) |

| Feature        | Behavior                                                |
| -------------- | ------------------------------------------------------- |
| **Search**     | Team name; **300 ms debounce**                          |
| **Filters**    | Membership: All / With members / Empty                  |
| **Sort**       | Server-side                                             |
| **Pagination** | Server; 10 / 20 / 50                                    |
| **Row click**  | Navigates to `/teams/:id` (preserves list query in URL) |
| **Create**     | "Create team" (`teams:write`)                           |

---

### Team detail — Members (`/teams/:id`)

**Access:** `teams:read`

Same table component as My Team.

| Column  | Sortable          |
| ------- | ----------------- |
| Name    | Yes               |
| Email   | Yes               |
| Role    | Yes               |
| Status  | No (display only) |
| Created | Yes               |
| Actions | If `users:write`  |

| Feature        | Behavior                                   |
| -------------- | ------------------------------------------ |
| **Search**     | Member name/email; **300 ms debounce**     |
| **Filters**    | Role dropdown; inline "Clear filters"      |
| **Sort**       | Server-side                                |
| **Pagination** | Server; 10 / 20 / 50                       |
| **Actions**    | Activate / Deactivate; Add member dialog. A person can only be on one team; adding an email already on a team names that team in the error |
| **Back link**  | Returns to `/teams` with preserved filters |

---

### My Team — Members (`/my-team`)

**Access:** `users:read:team` without `teams:read`

Same columns and list UX as team detail members table.

| Difference         | Detail                               |
| ------------------ | ------------------------------------ |
| **Scope**          | Current user's team only             |
| **Status actions** | Disabled (`canManageStatus={false}`) |
| **Error state**    | Shown if user has no team assignment |

---

### Leads (`/leads`)

**Access:** `sales` module + any lead read permission

| Column        | Sortable               |
| ------------- | ---------------------- |
| Name          | Yes                    |
| Mobile        | No                     |
| Email         | No                     |
| Team          | Yes                    |
| Assigned user | Yes                    |
| Status        | Yes                    |
| Source        | No                     |
| Project       | No                     |
| Created       | Yes (default **desc**) |

| Feature        | Behavior                                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**     | General text search; **300 ms debounce**                                                                                               |
| **Filters**    | Status (all pipeline values); Team (if `leads:read:org` + `teams:read`); Assignee incl. "Unassigned" (if team/org read + `users:read`) |
| **Sort**       | Server-side                                                                                                                            |
| **Pagination** | Server; 10 / 20 / 50                                                                                                                   |
| **Row click**  | Navigates to `/leads/:id` (preserves list query)                                                                                       |
| **Create**     | "Add lead" (`leads:write`)                                                                                                             |

List content is scoped by permission (own / team / org leads).

---

### Roles & Permissions (`/roles`)

**Access:** `roles:write`

**Not a data table** — split-pane master/detail layout.

| List item shows                            | Detail panel shows                    |
| ------------------------------------------ | ------------------------------------- |
| Role name                                  | Permission checkboxes grouped by area |
| Membership scope (Team / Organization)     | Save / cancel                         |
| "Default" badge if protected built-in role |                                       |
| User count                                 |                                       |

| Feature        | Behavior                                                        |
| -------------- | --------------------------------------------------------------- |
| **Search**     | None                                                            |
| **Sort**       | None (API returns full list; new roles sorted by name on add)   |
| **Filters**    | None (team-scoped users see only team-assignable roles via API) |
| **Pagination** | None — full client-side list                                    |
| **Actions**    | Create role, delete non-protected roles, edit permissions       |

---

### Organization Audit Trail (`/audit`)

**Access:** `audit:read`

| Column  | Sortable               |
| ------- | ---------------------- |
| Expand  | —                      |
| Time    | No                     |
| Actor   | No (name + email)      |
| Action  | No (color-coded badge) |
| Entity  | No (entity type)       |
| Summary | No                     |

| Feature        | Behavior                                                                               |
| -------------- | -------------------------------------------------------------------------------------- |
| **Search**     | Summary text or actor name/email; **300 ms debounce**                                  |
| **Filters**    | Action dropdown; Entity type dropdown; From date; To date; "Clear filters" when active |
| **Sort**       | None                                                                                   |
| **Pagination** | Server; 10 / 20 / 50                                                                   |
| **Expand row** | Shows before/after diffs, changed fields, permission changes, request metadata         |

---

### Platform overview (`/platform`)

**Access:** `platform:orgs:read`

Three counts across every company: organizations (with how many are active), people with an active login in a company, and leads created. This is the platform-admin landing page.

---

### Platform Organizations (`/platform/organizations`)

**Access:** `platform:orgs:read`

| Column       | Sortable                             |
| ------------ | ------------------------------------ |
| Organization | Yes (name; shows avatar, name, code) |
| Status       | Yes                                  |
| Users        | Yes (user count)                     |
| Created      | Yes (default **desc**)               |
| Actions      | No                                   |

| Feature          | Behavior                                             |
| ---------------- | ---------------------------------------------------- |
| **Search**       | Organization name/code; **300 ms debounce**          |
| **Filters**      | Status: All / Active / Suspended                     |
| **Sort**         | Server-side                                          |
| **Pagination**   | Server; 10 / 20 / 50                                 |
| **Row click**    | Navigates to org detail                              |
| **Actions menu** | View details, Suspend / Activate                     |
| **Create**       | "Create organization" dialog (`platform:orgs:write`) |

---

### Platform Admins (`/platform/admins`)

**Access:** `platform:users:read`

| Column  | Sortable                  |
| ------- | ------------------------- |
| Name    | Yes (with avatar)         |
| Email   | Yes                       |
| Status  | Yes                       |
| Created | Yes (default **desc**)    |
| Actions | If `platform:users:write` |

| Feature        | Behavior                                                              |
| -------------- | --------------------------------------------------------------------- |
| **Search**     | Name or email; **300 ms debounce**                                    |
| **Filters**    | Status: All / Active / Inactive                                       |
| **Sort**       | Server-side                                                           |
| **Pagination** | Server; 10 / 20 / 50                                                  |
| **Row click**  | None                                                                  |
| **Actions**    | Activate / Deactivate (not self; cannot deactivate last active admin) |
| **Create**     | "Add platform admin" dialog (`platform:users:write`)                  |

See [Platform administrators](#3-platform-administrators) for creation details.

---

### Platform Audit Trail (`/platform/audit`)

**Access:** `platform:audit:read`

Same table component as org audit with an additional **Organization** column.

| Feature        | Behavior                                                                            |
| -------------- | ----------------------------------------------------------------------------------- |
| **Search**     | Summary or actor; **300 ms debounce**                                               |
| **Filters**    | **Organization** dropdown + all org audit filters (action, entity type, date range) |
| **Sort**       | None                                                                                |
| **Pagination** | Server; 10 / 20 / 50                                                                |
| **Expand row** | Same as org audit                                                                   |

Includes cross-tenant events such as `PLATFORM_USER_CREATED`.

---

### Notifications (`/notifications`)

**Access:** Authenticated; org users need `notifications` module

**Not a `<Table>`** — card-style list rows.

| Row content      | Notes                        |
| ---------------- | ---------------------------- |
| Title            | Notification headline        |
| Body             | Two-line clamp               |
| Time             | Relative timestamp           |
| Unread indicator | Dot + highlighted background |

| Feature        | Behavior                                           |
| -------------- | -------------------------------------------------- |
| **Search**     | None                                               |
| **Sort**       | None (newest first from API)                       |
| **Filters**    | Read status: All / Unread (immediate, no debounce) |
| **Pagination** | Server; 10 / 20 / 50                               |
| **Row click**  | Mark read + navigate to lead or account            |
| **Toolbar**    | "Mark all read"                                    |

**Filtered empty:** "No unread notifications" with link to show all.

---

### Notification dropdown (header bell)

| Feature                        | Behavior                                   |
| ------------------------------ | ------------------------------------------ |
| **Preview size**               | Latest 10 notifications                    |
| **Fetch**                      | On dropdown open only                      |
| **Search / sort / pagination** | None in dropdown                           |
| **Polling**                    | Unread count every 60 s                    |
| **Link**                       | "See all notifications" → `/notifications` |

---

### Organization detail (`/platform/organizations/:id`)

**Not a list page** — form-based detail view.

| Section              | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| Organization profile | Edit name, code, description, logo URL            |
| Status               | Suspend / activate organization                   |
| Feature modules      | Toggle `sales`, `dashboards`, `notifications` |
| Metadata             | Created timestamp, user count                     |

---

## 16. Shared list UX patterns

These behaviors apply consistently across paginated list pages.

### URL-synced query state

List pages persist **search**, **filters**, **sort**, and **pagination** in the URL query string. Refreshing the page or sharing the URL restores the same view. Navigating to detail pages (leads, teams, orgs) preserves list state via query string or router state on back navigation.

### Search debounce

| Setting            | Value                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Delay**          | **300 milliseconds**                                                                      |
| **Implementation** | Shared `useDebouncedSearch` hook in list toolbars (`SEARCH_DEBOUNCE_MS` = 300)            |
| **Trigger**        | Typing in search input updates local state immediately; API fetch fires after 300 ms idle |

Pages **without** debounced search: Notifications (filter toggles immediately), Roles (no search), Dashboard widgets.

### Pagination

| Setting                 | Value                                                  |
| ----------------------- | ------------------------------------------------------ |
| **Default page**        | 1                                                      |
| **Default page size**   | 10                                                     |
| **Page size options**   | 10, 20, 50                                             |
| **Max page size (API)** | 100                                                    |
| **Type**                | Server-side — each page change refetches from API      |
| **UI component**        | Shared `ListPagination` (prev/next + page size select) |
| **Result summary**      | Toolbar shows "Showing X–Y of Z"                       |

### Sorting

| Behavior            | Detail                                                            |
| ------------------- | ----------------------------------------------------------------- |
| **Where supported** | Users, Teams, Team members, Leads, Platform orgs, Platform admins |
| **Mechanism**       | Click sortable column header                                      |
| **Toggle**          | Switches between ascending and descending                         |
| **Default**         | Usually `createdAt` descending                                    |
| **Execution**       | Server-side sort — header click updates URL and refetches         |

Pages **without** sort: Audit (org + platform), Notifications, Roles, Dashboard tables.

### Loading and empty states

| State              | UX                                                          |
| ------------------ | ----------------------------------------------------------- |
| **Loading**        | 5 skeleton rows (`TABLE_SKELETON_ROW_COUNT = 5`)            |
| **Global empty**   | Illustration + primary CTA (e.g. "Add user", "Create team") |
| **Filtered empty** | Message + "Clear filters" button                            |
| **Error**          | Inline error with retry where applicable                    |

---

## 17. Future scope

Items below are **not implemented** in the MVP but are documented as evolution paths in [Architecture — Scaling considerations](architecture.md#scaling-considerations).

### Upcoming: org switcher (not in the product)

**Not present now.** A person logs into **one organization**. There is no picker, no “switch company,” and no `POST /auth/switch-organization`.

The schema already allows the same email to have more than one `organization_members` row (different role and team per org). The app does not use that yet. When this ships: picker after login if there are multiple memberships, `POST /auth/switch-organization` to re-issue the JWT with a new `orgId`, list memberships on `/auth/me`. See [Architecture — Multi-Org Readiness](architecture.md#multi-org-readiness). Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: invite existing email into a second org (not in the product)

**Not present now.** Creating a user with an email that already exists returns **email already exists**. Tandem will not add a second membership.

When this ships: the second org adds an `organization_members` row only (same user, same password, a role for that company). That is useless without the org picker. See [Architecture — Multi-Org Readiness](architecture.md#multi-org-readiness) and [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: per-org membership status (not in the product)

**Not present now.** Users pages **activate / deactivate** the global `users.status`. That turns the login off everywhere. `organization_members.status` already exists but the product does not use it.

When this ships (with the org switcher): an admin can deactivate someone in **this** company without locking them out of another. See [Architecture — Multi-Org Readiness](architecture.md#multi-org-readiness) and [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: customizable pipeline per organization (not in the product)

**Not present now.** Every organization uses the same statuses, including site visit. You can skip, go back, mark lost early, and reopen — but you cannot rename or replace those stages yet.

When this ships: each org will configure its own pipeline labels. Until then, see the public list at [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: sending emails (not in the product)

**Not present now.** Notifications are **in-app only** (bell, 60-second poll). The API does not send email when a lead is created or assigned, when a user is welcomed, for password reset, or when a platform admin creates an organization (org-admin credentials stay out of band). If someone never opens Tandem, they will not hear about a new lead.

When this ships: a mail worker for assignment, welcome, new-org admin credentials, and later self-service reset. SMS and push stay out of scope unless listed separately. See [Architecture — Notification Design](architecture.md#notification-design) and [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: forgot password / admin reset (not in the product)

**Not present now.** Login has no Forgot password link. `POST /api/v1/auth/change-password` needs the **current** password. Org and platform user screens only **activate / deactivate**. An admin cannot set a temporary password.

When this ships: Plan 7.10 is admin set-password (no email). Plan 7.11 is self-service reset once Tandem can send mail. Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: Sign in with Google / SSO (not in the product)

**Not present now.** Sign-in is email plus a Tandem password. There is no Google button and no company SSO.

When this ships: an organization that is ready can sign in without a Tandem password. Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: auto-assignment (not in the product)

**Not present now.** Team leaders and managers still leave new leads unassigned unless they pick an owner. Executives who capture their own walk-in are assigned to themselves so they can see the lead. There is no round-robin, least-loaded, or rule that spreads walk-ins across a team.

When this ships: new leads on a team can rotate to the next assignable executive, or go to whoever has the fewest open leads. Until then, see the public list at [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: Redis (not in the product)

**Not present now.** `GET /notifications/unread-count` runs `COUNT(*)` in Postgres on every 60-second poll. There is no cache for unread counts or the permission catalog. In-app alerts use an in-process event bus, so a second API instance would miss events.

When this ships (after a custom domain and real customers): Redis holds the badge number (and similar lookups) and shares notification events across servers (pub/sub or a queue). That queue also remembers the job so a restart does not drop an alert, and retries if writing the bell fails (today that failure is logged and dropped). The unread poll can then drop from 60 seconds to a few seconds without hammering Postgres. Push (SSE or websocket) stays later. Until then, keep a **single** API instance. See [`/upcoming`](https://tandemcrm.vercel.app/upcoming) and [Architecture — Scaling considerations](architecture.md#scaling-considerations).

### Notifications and real-time

- WebSocket or SSE push instead of 60-second polling
- Durable event queue (Bull, SQS, or Redis) with retries and dead-letter handling — see [Upcoming: Redis](#upcoming-redis-not-in-the-product)
- Sending emails (assignment, welcome, later password reset) — see [Upcoming: sending emails](#upcoming-sending-emails-not-in-the-product)
- SMS notification channel
- Separate notification worker service

### Platform and operations

- Containerized deployment (backend + CDN frontend + managed Postgres)
- CI/CD pipeline
- Structured logging and metrics (observability)
- Redis caching for unread counts and permission catalog — see [Upcoming: Redis](#upcoming-redis-not-in-the-product)

### Upcoming: audit and notification archival (not in the product)

**Not present now.** Bell rows and audit rows stay forever. There is no retention job.

When this ships: after Tandem is live on a custom domain with real customers, old notifications are dropped and old audit logs are archived. See [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: iPhone and Android apps (not in the product)

**Not present now.** Tandem is a website. A phone browser can open it; there is no native app.

When this ships: App Store and Play Store apps for salespeople on site. Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: custom domain (not in the product)

**Not present now.** The SPA is `tandemcrm.vercel.app` and the API is `tandem-api-4eal.onrender.com`. Auth cookies are third-party (`SameSite=None; Secure`).

When this ships: app and API on a Tandem hostname so cookies are first-party. Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: split the API into services (not in the product)

**Not present now.** One Express process serves auth, leads, dashboards, and alerts.

When this ships: those areas can split into separate services if traffic needs it. Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Upcoming: a database per company (not in the product)

**Not present now.** Every organization shares one Postgres; isolation is `organizationId` on rows.

When this ships: a large customer can get their own database. Until then, see [`/upcoming`](https://tandemcrm.vercel.app/upcoming).

### Data and compliance

- Read replicas for heavy list endpoints

### Product extensions (potential)

- Custom lead fields and forms
- Lead import/export (CSV)
- Reporting exports and scheduled reports
- Deal value / revenue tracking
- Task reminders and follow-up scheduling
- Fine-grained custom roles UI for org admins (partially exists)
- Webhook integrations for external CRMs

---

## 18. Glossary

| Term                    | Definition                                                             |
| ----------------------- | ---------------------------------------------------------------------- |
| **Organization**        | A tenant; isolated slice of users, teams, and leads                    |
| **Organization member** | A user's membership in an org, including their role in that org        |
| **Platform admin**      | Cross-tenant administrator with no org membership                      |
| **Module**              | Per-org feature toggle (`sales`, `dashboards`, `notifications`)    |
| **Role**                | Named permission bundle; one per org membership (or one platform role) |
| **Permission**          | Atomic capability key (e.g. `leads:read:team`)                         |
| **Team**                | Group of org users; leads belong to a team                             |
| **Lead**                | Sales prospect/opportunity in the CRM pipeline                         |
| **Activity**            | User-logged sales interaction on a lead                                |
| **Notification**        | In-app alert for a user                                                |
| **Audit log**           | Immutable record of a system or user action                            |
| **Widget**              | Dashboard panel showing a metric, chart, or table                      |
| **Terminal status**     | Won or Lost — closes the lead                                          |

---

## 19. Development seed accounts

After `npm run db:seed`:

| Email | Role | Password | Scope |
| ----- | ---- | -------- | ----- |
| `tandem.admin@yopmail.com` | Platform Admin | `Admin@123` | Platform |
| `tandem.oracle@yopmail.com` | Platform Admin | `Tandem@123` | Platform |
| `wayne@yopmail.com` | Org Admin | `Wayne@123` | Wayne Enterprises (`wayne-enterprises`) |
| `daggett@yopmail.com` | Org Admin | `Daggett@123` | Daggett Industries (`daggett-industries`) |
| `ace@yopmail.com` | Org Admin | `Ace@123` | Ace Chemicals (`ace-chemicals`) |
| `janus@yopmail.com` | Org Admin | `Janus@123` | Janus Cosmetics (`janus-cosmetics`) |
| `lexcorp@yopmail.com` | Org Admin | `Lex@123` | LexCorp (`lexcorp`) |

The seed creates those five organizations with default roles and all modules enabled. It does not create teams, executives, or leads. All seed inboxes are `@yopmail.com`.

---

## 20. UI screenshots

Screenshots live under `docs/assets/screenshots/`, grouped by public pages, shared account screens, platform admin, org admin, and role-specific dashboards. Recaptured October 2026 under **Tandem** branding (light theme). Sample Wayne Enterprises leads in the org/executive shots are local fixture data, not the production seed.

### Public

| Screen             | Route      |
| ------------------ | ---------- |
| Login              | `/login`   |
| How Tandem works   | `/guide`   |
| Privacy policy     | `/privacy` |
| Terms & conditions | `/terms`   |

![Login page](assets/screenshots/public/login-page.png)

![How Tandem works](assets/screenshots/public/guide-page.png)

![A day in the life](assets/screenshots/public/guide-day-in-the-life.png)

![Privacy policy](assets/screenshots/public/privacy-policy.png)

![Terms and conditions](assets/screenshots/public/terms-and-conditions.png)

### Account (all authenticated users)

| Screen           | Route               |
| ---------------- | ------------------- |
| Account settings | `/account`          |
| Change password  | `/account` (dialog) |

![Account settings](assets/screenshots/account/account-settings.png)

![Change password](assets/screenshots/account/change-password.png)

### Platform admin

| Screen               | Route                              |
| -------------------- | ---------------------------------- |
| Platform overview    | `/platform`                        |
| Organizations list   | `/platform/organizations`          |
| Create organization  | `/platform/organizations` (dialog) |
| Organization detail  | `/platform/organizations/:id`      |
| Platform admins      | `/platform/admins`                 |
| Platform audit trail | `/platform/audit`                  |

![Organizations list](assets/screenshots/platform-admin/organizations-list.png)

![Create organization](assets/screenshots/platform-admin/create-organization.png)

![Organization detail](assets/screenshots/platform-admin/organization-detail.png)

![Platform admins](assets/screenshots/platform-admin/platform-admins.png)

![Platform audit trail](assets/screenshots/platform-admin/platform-audit-trail.png)

### Org admin

| Screen                | Route             |
| --------------------- | ----------------- |
| Teams list            | `/teams`          |
| Leads list (org-wide) | `/leads`          |
| Roles & permissions   | `/roles`          |
| Create role           | `/roles` (dialog) |

![Teams list](assets/screenshots/org-admin/teams-list.png)

![Leads list - org admin view](assets/screenshots/org-admin/leads-list.png)

![Roles and permissions](assets/screenshots/org-admin/roles-and-permissions.png)

![Create role](assets/screenshots/org-admin/create-role.png)

### Director

| Screen                 | Route        |
| ---------------------- | ------------ |
| Organization dashboard | `/dashboard` |

![Organization dashboard](assets/screenshots/director/dashboard.png)

### Team leader

| Screen         | Route        |
| -------------- | ------------ |
| Team dashboard | `/dashboard` |
| My team        | `/my-team`   |

![Team dashboard](assets/screenshots/team-leader/dashboard.png)

![My team](assets/screenshots/team-leader/my-team.png)

### Executive

| Screen                | Route                |
| --------------------- | -------------------- |
| My dashboard          | `/dashboard`         |
| Customize dashboard   | `/dashboard` (sheet) |
| Leads list (assigned) | `/leads`             |
| Lead detail           | `/leads/:id`         |

![My dashboard](assets/screenshots/executive/dashboard.png)

![Customize dashboard](assets/screenshots/executive/dashboard-customize.png)

![Leads list - executive view](assets/screenshots/executive/leads-list.png)

![Lead detail](assets/screenshots/executive/lead-detail.png)
