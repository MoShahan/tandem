import type { LeadStatus } from "@/features/leads/leadsTypes";

export const GUIDE_SECTIONS = [
  { id: "what-tandem-is", label: "What Tandem is" },
  { id: "what-a-lead-is", label: "What a lead is" },
  { id: "pipeline", label: "The sales pipeline" },
  { id: "assignment", label: "Who owns a lead" },
  { id: "winning-and-losing", label: "Winning and losing" },
  { id: "activities", label: "Activities" },
  { id: "teams", label: "Teams" },
  { id: "roles", label: "Roles" },
  { id: "a-day-in-the-life", label: "A day in the life" },
  { id: "modules", label: "Modules" },
  { id: "notifications-and-audit", label: "Notifications vs audit" },
  { id: "dashboards", label: "Dashboards" },
  { id: "what-tandem-is-not", label: "What Tandem is not" },
] as const;

export const PIPELINE_STEPS: {
  status: LeadStatus;
  meaning: string;
  closed?: boolean;
}[] = [
  {
    status: "NEW",
    meaning: "We just captured this person. Nobody has really worked it yet.",
  },
  {
    status: "CONTACTED",
    meaning: "Someone reached out - a call, message, or email.",
  },
  {
    status: "VISIT_SCHEDULED",
    meaning: "They agreed to see the site, product, or office.",
  },
  {
    status: "SITE_VISIT_COMPLETED",
    meaning: "The visit happened.",
  },
  {
    status: "NEGOTIATION",
    meaning: "Talking price, terms, and closing.",
  },
  {
    status: "WON",
    meaning: "They became a customer. The lead is closed.",
    closed: true,
  },
  {
    status: "LOST",
    meaning: "They walked away or chose someone else. Also closed.",
    closed: true,
  },
];

export const ROLE_ROWS = [
  {
    role: "Platform admin",
    scope: "platform",
    realLife: "Operator of Tandem itself — not a salesperson",
    does: "Creates and suspends companies, turns modules on or off.",
  },
  {
    role: "Org admin",
    scope: "company",
    realLife: "Office, HR, or operations admin",
    does: "Users, teams, roles, audit, and company numbers. Not a salesperson by default.",
  },
  {
    role: "Director",
    scope: "company",
    realLife: "Head of sales",
    does: "Sees every lead, the company dashboard, and the audit log.",
  },
  {
    role: "Sales manager",
    scope: "company",
    realLife: "Sales manager across teams",
    does: "Creates and edits leads company-wide and uses the company dashboard.",
  },
  {
    role: "Team leader",
    scope: "company",
    realLife: "Supervisor of one sales team",
    does: "Creates leads, assigns owners, can own a lead, logs cover calls, team dashboard.",
  },
  {
    role: "Executive",
    scope: "company",
    realLife: "Salesperson, agent, or closer — not a CEO",
    does: "Works assigned leads, logs activities, and captures their own walk-ins.",
  },
] as const;

export type GuideRoleProfile = {
  id: string;
  role: string;
  scope: "platform" | "company";
  reportsTo: string;
  realWorld: string;
  inTandem: string;
  can: string[];
  cannot: string[];
};

export const ROLE_PROFILES: GuideRoleProfile[] = [
  {
    id: "platform_admin",
    role: "Platform admin",
    scope: "platform",
    reportsTo: "Outside every company",
    realWorld:
      "The person who runs the product for several companies — like an IT operator or the founder of Tandem. They are not the head of sales inside a builder or dealership.",
    inTandem:
      "Sees a platform overview (companies, active users, leads), creates and suspends organizations, turns Sales, Dashboards, and Notifications on or off, and manages other platform admins.",
    can: [
      "See counts across every company",
      "Create, edit, and suspend companies",
      "Switch modules on or off",
      "Manage platform admins and read platform audit",
    ],
    cannot: [
      "Join a sales team",
      "Work a company’s leads as a salesperson",
    ],
  },
  {
    id: "org_admin",
    role: "Org admin",
    scope: "company",
    reportsTo: "Office leadership (MD, ops) — not in the sales reporting line",
    realWorld:
      "The office manager, HR, or operations person who adds staff and keeps the org chart tidy. They rarely call customers.",
    inTandem:
      "Adds users, builds teams, creates custom roles, reads the audit log, and opens the company dashboard. They can see every lead but cannot edit the pipeline by default.",
    can: [
      "Create and edit users, teams, and roles",
      "Read the company audit log",
      "See all leads (read only)",
      "Open the company dashboard",
    ],
    cannot: [
      "Create or move leads",
      "Log activities",
    ],
  },
  {
    id: "director",
    role: "Director",
    scope: "company",
    reportsTo: "Company leadership. Sales managers and team leaders report up to them",
    realWorld:
      "Head of sales. They care about the whole pipeline: which teams are winning, where deals stall, and whether targets will be hit. They do not usually own individual walk-ins.",
    inTandem:
      "Reads users, teams, and roles. Creates and edits leads anywhere in the company. Uses the organization dashboard and the audit log.",
    can: [
      "See and edit every lead",
      "Open the company-wide dashboard",
      "Read the company audit log",
      "Read who is on which team (cannot hire or change roles)",
    ],
    cannot: [
      "Add users or change permissions",
    ],
  },
  {
    id: "sales_manager",
    role: "Sales manager",
    scope: "company",
    reportsTo: "Director. Team leaders typically report to them in real life",
    realWorld:
      "The person who keeps several teams moving — coaching team leaders, unblocking stuck deals, and watching numbers across the floor. In many companies they sit between the director and the team leaders.",
    inTandem:
      "Creates and edits leads anywhere in the company and uses the organization dashboard — the person who lives in reports.",
    can: [
      "See and edit every lead in the company",
      "Open the company-wide dashboard",
    ],
    cannot: [
      "Add users, teams, or roles",
    ],
  },
  {
    id: "team_lead",
    role: "Team leader",
    scope: "company",
    reportsTo: "Sales manager (or director, in a small company)",
    realWorld:
      "Supervisor of one sales unit — “North site team,” “Channel partners,” and so on. They take walk-ins, decide who works each person, and cover for executives who are out.",
    inTandem:
      "Creates leads for their team, assigns or reassigns owners, can own a lead themselves, logs activities on leads they own, and uses the team dashboard. They cannot see other teams’ leads.",
    can: [
      "Create leads for their team and assign owners",
      "Own a lead when they cover for someone",
      "Log activities on leads they own",
      "Add or edit members of their own team",
      "Move status on the team’s leads",
      "Open the team dashboard",
    ],
    cannot: [
      "See other teams’ leads",
      "Create company-wide roles or users outside the team",
    ],
  },
  {
    id: "executive",
    role: "Executive",
    scope: "company",
    reportsTo: "Their team leader",
    realWorld:
      "The salesperson — agent, closer, or “executive” in Indian real-estate language. They call, visit, negotiate, and close. They are not C-level. In Tandem, executives are the team members.",
    inTandem:
      "Works the leads assigned to them, captures walk-ins they sourced (those leads are assigned to them), logs calls and visits, moves status, and uses a personal dashboard.",
    can: [
      "See and update their assigned leads",
      "Create a walk-in for their team (they own it)",
      "Log activities",
      "Open a personal dashboard",
    ],
    cannot: [
      "See the team pile or other people’s leads",
      "Reassign work to someone else",
      "Add teammates",
    ],
  },
];

export const CUSTOM_ROLE_EXAMPLES: GuideRoleProfile[] = [
  {
    id: "sales_coordinator",
    role: "Sales coordinator",
    scope: "company",
    reportsTo: "Team leader or sales manager",
    realWorld:
      "The person at the front desk or site office who writes down walk-ins and hands them to sales. They capture names; they do not close deals.",
    inTandem:
      "A custom role you can add. Typical ticks: create leads and maybe assign them. Leave win/loss and dashboards off unless you want them operating the pipeline.",
    can: [
      "Create leads (if you grant lead write)",
      "Hand a lead to an executive (if you grant assign)",
    ],
    cannot: [
      "This is not a built-in role — you choose the ticks",
      "Tandem will not invent this job until you create it",
    ],
  },
  {
    id: "viewer",
    role: "Viewer / analyst",
    scope: "company",
    reportsTo: "Director or finance",
    realWorld:
      "A founder, accountant, or analyst who needs numbers without calling customers. Read-only on purpose.",
    inTandem:
      "A custom role. Grant organization lead read and a dashboard. Do not grant lead write, status write, or user write.",
    can: ["See leads and dashboards you grant"],
    cannot: ["Edit the pipeline unless you add those permissions"],
  },
  {
    id: "project_coordinator",
    role: "Project coordinator",
    scope: "company",
    reportsTo: "Director or a project head outside Tandem",
    realWorld:
      "On a construction site this person tracks one building. In Tandem a “project” is only a label on a lead (which tower or product the customer asked about). It is not a project-management tool.",
    inTandem:
      "You can create a custom role that reads company leads so they can filter by project. Tandem cannot hide other projects yet — permissions are company or team, not per building.",
    can: ["Read leads you grant, then filter by project in the list"],
    cannot: [
      "Be scoped to a single building by the permission system today",
      "Replace a real project-management app",
    ],
  },
];

export type GuideDayStep = {
  time: string;
  title: string;
  body: string;
};

export type GuideDayInTheLife = {
  id: string;
  role: string;
  person: string;
  setting: string;
  steps: GuideDayStep[];
  limit: string;
};

export const DAY_IN_THE_LIFE: GuideDayInTheLife[] = [
  {
    id: "team-leader",
    role: "Team leader",
    person: "Kavya",
    setting: "North site team",
    steps: [
      {
        time: "9:00",
        title: "Check the team board",
        body: "Kavya opens the team dashboard. Three site visits are still “scheduled,” with no notes since Monday. That is her cue to chase the executives, not to call every customer herself.",
      },
      {
        time: "9:15",
        title: "Capture a walk-in",
        body: "A couple stops at the site office. Kavya creates Priya Shah as a New lead for North site. Priya sits on the team pile, unassigned.",
      },
      {
        time: "9:20",
        title: "Hand the work to someone",
        body: "She assigns Priya to Asha. Asha’s bell lights up. Kavya can still see the lead; Asha now owns the follow-up.",
      },
      {
        time: "16:00",
        title: "Keep the roster tidy",
        body: "On My team she adds a new executive who joined this week. She cannot see other teams’ leads or hire for the whole company.",
      },
    ],
    limit:
      "If Kavya covers a call, she assigns the lead to herself first, then logs it. The diary stays with the current owner.",
  },
  {
    id: "executive",
    role: "Executive",
    person: "Asha",
    setting: "Salesperson on North site",
    steps: [
      {
        time: "9:25",
        title: "See what is on her plate",
        body: "Asha opens My dashboard, then Leads. Priya Shah is new and assigned to her. Rohan’s leads are hidden.",
      },
      {
        time: "9:30",
        title: "Call and write it down",
        body: "She phones Priya, logs a Call activity, and moves the status to Contacted. That diary entry is how the rest of the team knows the follow-up happened.",
      },
      {
        time: "11:00",
        title: "Book the visit",
        body: "Priya agrees to see the site on Saturday. Asha sets Visit scheduled and leaves a note with the time. The team dashboard will pick this up for Kavya.",
      },
      {
        time: "14:00",
        title: "Capture her own walk-in",
        body: "A second couple walks in. Asha creates them as her own lead. If they should go to Rohan, she still asks Kavya to reassign.",
      },
    ],
    limit:
      "Executives work their own leads, log activities, and can capture walk-ins. They cannot see the team pile or reassign work.",
  },
];
