import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { GuideActivityStrip } from "../components/GuideActivityStrip";
import { GuideAssignmentFlow } from "../components/GuideAssignmentFlow";
import { GuideHero } from "../components/GuideHero";
import { GuideLeadCard } from "../components/GuideLeadCard";
import { GuideOrgDiagram } from "../components/GuideOrgDiagram";
import { GuideOutcomeCharts } from "../components/GuideOutcomeCharts";
import { GuidePageLayout } from "../components/GuidePageLayout";
import { GuidePipeline } from "../components/GuidePipeline";
import { GuideTeamTree } from "../components/GuideTeamTree";
import {
  GuideDashboardScopes,
  GuideModulesPanel,
  GuideNotErp,
  GuideNotifyVsAudit,
  GuideRoleLadder,
} from "../components/GuideVisualPanels";
import { GUIDE_SECTIONS, ROLE_ROWS } from "../content/guideContent";

import type { ReactNode } from "react";

const SectionHeading = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => (
  <h2
    id={id}
    className="scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
  >
    {children}
  </h2>
);

const Prose = ({ children }: { children: ReactNode }) => (
  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground">
    {children}
  </div>
);

export const GuidePage = () => {
  return (
    <GuidePageLayout>
      <div className="mb-8 space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">Product guide</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            How Tandem works
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            A plain-language tour of the product - for people who have never
            worked in sales, and for people who have but do not know this app
            yet.
          </p>
        </div>
        <GuideHero />
      </div>

      <nav
        aria-label="On this page"
        className="mb-10 rounded-xl border bg-card p-4"
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <ol className="grid gap-1 sm:grid-cols-2">
          {GUIDE_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex gap-2 rounded-md px-1 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="font-mono text-xs text-muted-foreground/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-12">
        <section className="space-y-4" aria-labelledby="what-tandem-is">
          <SectionHeading id="what-tandem-is">What Tandem is</SectionHeading>
          <Prose>
            <p>
              Tandem is a shared workspace for a company’s sales team. People
              log in, pick up potential customers, follow up, and record what
              happened - so the rest of the team can see the same picture.
            </p>
            <p>
              Each company on Tandem is an <strong>organization</strong>, like a
              separate office. Company A cannot see Company B’s people or leads.
            </p>
            <p>
              A <strong>platform admin</strong> is Tandem staff (or whoever
              operates the product). They create companies and turn features on
              or off. They do not sell houses, plots, or products inside a
              company.
            </p>
          </Prose>
          <GuideOrgDiagram />
        </section>

        <section className="space-y-4" aria-labelledby="what-a-lead-is">
          <SectionHeading id="what-a-lead-is">What a lead is</SectionHeading>
          <Prose>
            <p>
              A <strong>lead</strong> is a <strong>potential customer</strong> -
              a person, couple, or company that sales hopes to convert. Leads
              are not employees. They are also not “team leads.” That word
              collision is the most common confusion in this product.
            </p>
            <p>
              In Tandem a lead has a name, optional phone and email, where they
              came from (<strong>source</strong>), an optional{" "}
              <strong>project</strong> (a building, plot, or product), a{" "}
              <strong>team</strong>, and sometimes an <strong>owner</strong> -
              the salesperson responsible for follow-up.
            </p>
            <p>
              Leads never log in. Only your company’s users do.
            </p>
          </Prose>
          <GuideLeadCard />
        </section>

        <section className="space-y-4" aria-labelledby="pipeline">
          <SectionHeading id="pipeline">The sales pipeline</SectionHeading>
          <Prose>
            <p>
              The pipeline is the path a lead walks from “we just heard of them”
              to “the deal is done.” In Tandem that path is one step at a time.
              You cannot skip ahead or go backwards today.
            </p>
          </Prose>
          <GuidePipeline />
          <Prose>
            <p>
              <strong>Closed</strong> means the deal is finished. You cannot
              edit, reassign, or move a won or lost lead. That is intentional.
            </p>
            <p>
              This pipeline is shaped around property and site visits. It still
              works for other kinds of sales, but “site visit” may feel odd if
              you sell software. Statuses are not configurable yet.
            </p>
          </Prose>
        </section>

        <section className="space-y-4" aria-labelledby="assignment">
          <SectionHeading id="assignment">Who owns a lead</SectionHeading>
          <Prose>
            <p>
              <strong>Assignment</strong> answers one question: which
              salesperson is responsible for this person right now?
            </p>
          </Prose>
          <GuideAssignmentFlow />
        </section>

        <section className="space-y-4" aria-labelledby="winning-and-losing">
          <SectionHeading id="winning-and-losing">
            Winning and losing
          </SectionHeading>
          <Prose>
            <p>
              <strong>Won</strong> means the sale happened - a booking, a token,
              an agreement, whatever your company counts as a conversion.
            </p>
            <p>
              <strong>Lost</strong> means it did not, and this team is done
              chasing this person in this pipeline.
            </p>
            <p>
              Dashboards use wins versus losses for <strong>win rate</strong>.
              Open leads (still in the pipeline) are not wins. They are work in
              progress.
            </p>
          </Prose>
          <GuideOutcomeCharts />
        </section>

        <section className="space-y-4" aria-labelledby="activities">
          <SectionHeading id="activities">Activities</SectionHeading>
          <Prose>
            <p>
              An <strong>activity</strong> is a diary entry on a lead: a call,
              email, meeting, site visit, message, or note. It is the
              salesperson’s work log.
            </p>
            <p>
              It is not the audit trail. Audit is the system’s security log of
              who changed what. Activities are how sales actually happened.
            </p>
          </Prose>
          <GuideActivityStrip />
        </section>

        <section className="space-y-4" aria-labelledby="teams">
          <SectionHeading id="teams">Teams</SectionHeading>
          <Prose>
            <p>
              A <strong>team</strong> is a group of salespeople, usually a team
              leader plus executives. Every lead belongs to a team. A person can
              only be on <strong>one team</strong> in an organization.
            </p>
          </Prose>
          <GuideTeamTree />
        </section>

        <section className="space-y-4" aria-labelledby="roles">
          <SectionHeading id="roles">Roles</SectionHeading>
          <Prose>
            <p>
              A role is a job title bundled with permissions - what that person
              is allowed to see and do. The most important translation:{" "}
              <strong>executive does not mean CEO</strong>. In Tandem it means
              salesperson.
            </p>
          </Prose>
          <GuideRoleLadder />
          <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-normal">
                    Role in Tandem
                  </TableHead>
                  <TableHead className="whitespace-normal">
                    Who they are
                  </TableHead>
                  <TableHead className="whitespace-normal">
                    What they do here
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROLE_ROWS.map((row) => (
                  <TableRow key={row.role}>
                    <TableCell className="whitespace-normal font-medium">
                      {row.role}
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {row.realLife}
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {row.does}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Prose>
            <p>
              Organization admins can invent <strong>custom roles</strong> by
              ticking permissions. Built-in roles cannot be deleted.
            </p>
          </Prose>
        </section>

        <section className="space-y-4" aria-labelledby="modules">
          <SectionHeading id="modules">Modules</SectionHeading>
          <Prose>
            <p>
              A company can turn off Sales, Dashboards, or Notifications. If
              Sales is off, leads disappear from the app. Welcome messages that
              ask a new user to change their password still work.
            </p>
          </Prose>
          <GuideModulesPanel />
        </section>

        <section
          className="space-y-4"
          aria-labelledby="notifications-and-audit"
        >
          <SectionHeading id="notifications-and-audit">
            Notifications vs audit
          </SectionHeading>
          <Prose>
            <p>
              A <strong>notification</strong> is a bell for you - “this lead was
              assigned to you.” It is a to-do prompt, not a legal record.
            </p>
            <p>
              An <strong>audit log</strong> is a compliance record - “this user
              changed this lead at 4:02pm.” It is not a to-do list. You cannot
              edit or delete audit rows.
            </p>
          </Prose>
          <GuideNotifyVsAudit />
        </section>

        <section className="space-y-4" aria-labelledby="dashboards">
          <SectionHeading id="dashboards">Dashboards</SectionHeading>
          <Prose>
            <p>
              There are three heights of dashboard: <strong>my numbers</strong>{" "}
              (executive), <strong>my team</strong> (team leader), and{" "}
              <strong>whole company</strong> (director). You can show, hide, and
              reorder widgets. The layout is saved per person.
            </p>
          </Prose>
          <GuideDashboardScopes />
        </section>

        <section className="space-y-4" aria-labelledby="what-tandem-is-not">
          <SectionHeading id="what-tandem-is-not">
            What Tandem is not
          </SectionHeading>
          <Prose>
            <p>
              Tandem is a sales CRM, not a full ERP. It does not do accounting,
              inventory, payroll, or email marketing. Potential customers never
              get their own login.
            </p>
            <p>
              One person cannot switch between multiple companies in the app
              yet, even though the data model can store that later.
            </p>
          </Prose>
          <GuideNotErp />
        </section>
      </div>

      <div className="mt-12 rounded-xl border bg-card px-5 py-6 text-center">
        <p className="text-sm font-medium">Ready to open the workspace?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in with the account your organization gave you.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Log in
        </Link>
      </div>
    </GuidePageLayout>
  );
};
