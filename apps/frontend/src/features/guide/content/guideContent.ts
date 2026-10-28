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
    realLife: "Operator of Tandem itself",
    does: "Creates and suspends companies, turns modules on or off. Does not sell inside a company.",
  },
  {
    role: "Org admin",
    scope: "company",
    realLife: "Office, HR, or operations admin",
    does: "Manages users, teams, roles, and the audit log. Not a salesperson by default.",
  },
  {
    role: "Director",
    scope: "company",
    realLife: "Head of sales",
    does: "Sees every lead in the company and the organization dashboard.",
  },
  {
    role: "Sales manager",
    scope: "company",
    realLife: "Sales manager",
    does: "Creates and edits leads across the company. No dashboard by default.",
  },
  {
    role: "Team leader",
    scope: "company",
    realLife: "Team lead or supervisor",
    does: "Creates leads for the team, assigns them, sees the team dashboard, and can add team members.",
  },
  {
    role: "Executive",
    scope: "company",
    realLife: "Sales executive, agent, or closer - not a CEO",
    does: "Works assigned leads, logs activities, and uses a personal dashboard. Cannot create leads by default.",
  },
] as const;
