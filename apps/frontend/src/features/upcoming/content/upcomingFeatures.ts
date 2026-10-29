export type UpcomingFeature = {
  id: string;
  title: string;
  body: string;
};

export const UPCOMING_FEATURES: UpcomingFeature[] = [
  {
    id: "org-switcher",
    title: "Work in more than one company",
    body: "Today you log into one organization. Later, the same person will pick which company to work in after login (an org picker, then a switch that re-issues the session). The database already allows extra memberships; the app cannot switch yet.",
  },
  {
    id: "invite-second-org",
    title: "Invite someone who already has a login",
    body: "Today adding an email that already exists fails. Later, a second company can add that same person as a membership only — one password, a different role in the new company. That needs the org picker to be useful.",
  },
  {
    id: "membership-status",
    title: "Turn off access in one company only",
    body: "Today deactivate turns off the whole login. The membership row already has its own status, but the app still uses the global user status. When someone can be in two companies, an admin will be able to remove them from this office without locking them out of the other one.",
  },
  {
    id: "email",
    title: "Sending emails",
    body: "Alerts stay in the in-app bell. Tandem does not send mail for a new lead, an assignment, a welcome, a password reset, or the org-admin login when a company is created. If you never open the app, you will not hear about a new lead.",
  },
  {
    id: "email-new-org",
    title: "Email when a company is created",
    body: "Today a platform admin creates an organization and must pass the org admin’s password by hand. Later Tandem will email those credentials (or a set-password link) when the company is provisioned.",
  },
  {
    id: "password-reset",
    title: "Forgot password / admin reset",
    body: "There is no Forgot password on login. An admin cannot set a temporary password for you yet — only activate or deactivate the account. Self-service email reset comes after that, once Tandem can send mail.",
  },
  {
    id: "custom-pipeline",
    title: "Pipeline you name, per organization",
    body: "Every company currently uses the same stages, including site visit — that stays for now. Later each organization will name its own statuses (for example Demo booked instead of Site visit completed).",
  },
  {
    id: "duplicates",
    title: "Duplicate lead detection",
    body: "The same phone or email in one company will be flagged so two executives do not chase the same person.",
  },
  {
    id: "csv",
    title: "CSV import and export",
    body: "Bring a spreadsheet of leads in, and download the list you already have.",
  },
  {
    id: "follow-up",
    title: "Follow-up reminders",
    body: "A date on a lead that nags the owner in the app — even before email exists.",
  },
  {
    id: "auto-assign",
    title: "Auto-assignment",
    body: "Round-robin or least-loaded distribution of new walk-ins across a team, instead of a leader assigning every name by hand.",
  },
  {
    id: "sso",
    title: "Sign in with Google / SSO",
    body: "Company login without a Tandem password, when an organization is ready for it.",
  },
  {
    id: "impersonate",
    title: "Open this organization (support)",
    body: "Platform operators will be able to view a tenant the way that company sees it, without sharing a password.",
  },
  {
    id: "redis-unread",
    title: "Faster notification badge (Redis)",
    body: "Today every logged-in person asks the database every minute how many unread alerts they have. Later Redis will cache that number (and similar lookups such as the permission catalog) so the bell stays cheap when many people are online.",
  },
  {
    id: "redis-shorter-poll",
    title: "Shorter wait for in-app alerts",
    body: "Today the bell asks every 60 seconds, so a new assignment can sit unseen for a minute. When Redis caches the unread count, that poll can drop to a few seconds without hammering the database. Push (live updates) is a later step.",
  },
  {
    id: "redis-multi-instance",
    title: "More than one API server (Redis)",
    body: "Today in-app alerts travel on an in-process bus, so only one API instance is safe. When Tandem is live on a custom domain with real customers, Redis (pub/sub or a queue) will share those events so more than one server can run.",
  },
  {
    id: "redis-durable-queue",
    title: "Don't lose alerts on restart (Redis)",
    body: "Today assigning a lead fires an in-memory event. If the API dies before the bell row is written, that alert is gone. When Redis ships, a queue (or an outbox table) will remember the job so the bell still gets created after a restart.",
  },
  {
    id: "redis-retry-alerts",
    title: "Retry failed alerts (Redis)",
    body: "Today if writing the bell fails, Tandem logs it and gives up. When Redis ships, the queue retries that job instead of dropping it.",
  },
  {
    id: "log-archival",
    title: "Clean out old bells and audit logs",
    body: "Today every in-app alert and every audit row stays forever. When Tandem is live on a custom domain with real customers, old bell notifications will be dropped after a while, and old audit rows will be archived so the database does not grow without a limit.",
  },
  {
    id: "mobile-apps",
    title: "iPhone and Android apps",
    body: "Today Tandem is a website. You can open it in a phone browser, but there is no App Store or Play Store app. Later, salespeople will get native apps for the work they do on site.",
  },
  {
    id: "custom-domain",
    title: "Your own domain",
    body: "Today the site is tandemcrm.vercel.app and the API is on onrender.com, so login cookies are third-party. Later the app and API will sit on a Tandem domain so login cookies are first-party and browsers treat it like a normal company site.",
  },
  {
    id: "microservices",
    title: "Split the API into services",
    body: "Today one API does login, leads, dashboards, and alerts. Later those can split into separate services if real traffic needs it. Until then the monolith is the product.",
  },
  {
    id: "per-tenant-db",
    title: "A database per company",
    body: "Today every company shares one Postgres; rows are tagged with the organization. Later a large customer can get their own database so their data is physically separate.",
  },
];
