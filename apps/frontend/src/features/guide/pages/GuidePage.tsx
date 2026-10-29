import { Link } from "react-router-dom";

import { GuideActivityStrip } from "../components/GuideActivityStrip";
import { GuideAssignmentFlow } from "../components/GuideAssignmentFlow";
import { GuideHero } from "../components/GuideHero";
import { GuideLeadCard } from "../components/GuideLeadCard";
import { GuideOrgDiagram } from "../components/GuideOrgDiagram";
import { GuideOutcomeCharts } from "../components/GuideOutcomeCharts";
import { GuidePageLayout } from "../components/GuidePageLayout";
import { GuidePipeline } from "../components/GuidePipeline";
import {
  GuideCustomRoleExamples,
  GuideRoleProfiles,
} from "../components/GuideRoleProfiles";
import { GuideRolesTable } from "../components/GuideRolesTable";
import { GuideDayInTheLife } from "../components/GuideDayInTheLife";
import { GuideTeamTree } from "../components/GuideTeamTree";
import {
  GuideDashboardScopes,
  GuideModulesPanel,
  GuideNotErp,
  GuideNotifyVsAudit,
  GuideRoleLadder,
} from "../components/GuideVisualPanels";
import { GUIDE_SECTIONS } from "../content/guideContent";

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
              You work in one company per login. Switching companies if the
              same person is in two offices, and inviting an email that already
              has a Tandem login into a second company, are{" "}
              <Link
                to="/upcoming"
                className="font-medium text-foreground underline underline-offset-4"
              >
                upcoming features
              </Link>{" "}
              — not in the product yet.
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
              to “the deal is done.” You can skip a stage, go backwards, or mark
              lost from any open step — a lead can go cold on day one. You can
              reopen a won or lost lead if they come back.
            </p>
          </Prose>
          <GuidePipeline />
          <Prose>
            <p>
              <strong>Closed</strong> means the deal is finished until you
              reopen it. While it is closed you cannot edit, reassign, or log
              activities. Marking lost asks for a reason. Marking won can store
              a deal value. Open leads can have an expected close date.
            </p>
            <p>
              This pipeline includes <strong>site visit</strong> stages. That
              stays for now. Naming your own statuses per company is an{" "}
              <Link
                to="/upcoming"
                className="font-medium text-foreground underline underline-offset-4"
              >
                upcoming feature
              </Link>
              .
            </p>
          </Prose>
        </section>

        <section className="space-y-4" aria-labelledby="assignment">
          <SectionHeading id="assignment">Who owns a lead</SectionHeading>
          <Prose>
            <p>
              <strong>Assignment</strong> answers one question: which
              salesperson is responsible for this person right now? Today a
              team leader picks that person by hand. Automatically handing new
              walk-ins around the team (next in line, or whoever has the fewest
              open leads) is an{" "}
              <Link
                to="/upcoming"
                className="font-medium text-foreground underline underline-offset-4"
              >
                upcoming feature
              </Link>
              .
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
              A role is a job title bundled with permissions — what that person
              is allowed to see and do. The most important translation:{" "}
              <strong>executive does not mean CEO</strong>. In Tandem it means
              salesperson. Those people are the <strong>team members</strong>.
            </p>
            <p>
              A <strong>lead</strong> is not a job. It is a potential customer.
              There is no “Lead” role and no built-in “Team member” or “Project
              manager” role. Org admins can add extra roles by ticking
              permissions. Built-in roles cannot be deleted.
            </p>
            <p>
              Tandem does not store “this person is the boss of that person.”
              The ladder below is how a real sales floor usually works, and how
              far each default role can see: own leads, one team, or the whole
              company.
            </p>
          </Prose>
          <GuideRoleLadder />
          <GuideRolesTable />
          <Prose>
            <p>
              Each default role, in a company and in this app:
            </p>
          </Prose>
          <GuideRoleProfiles />
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Roles you can add
          </h3>
          <Prose>
            <p>
              If your office has jobs that are not on the list — a coordinator
              who only captures walk-ins, a founder who only wants numbers, a
              project desk that watches one building — create a custom role and
              tick the permissions that match. These three are examples, not
              extra built-in roles.
            </p>
          </Prose>
          <GuideCustomRoleExamples />
        </section>

        <section className="space-y-4" aria-labelledby="a-day-in-the-life">
          <SectionHeading id="a-day-in-the-life">
            A day in the life
          </SectionHeading>
          <Prose>
            <p>
              Roles are easier to remember as a morning on the sales floor.
              Kavya is the <strong>team leader</strong>. Asha is the{" "}
              <strong>executive</strong> — the salesperson, not a CEO. They
              share Priya Shah as a walk-in. They do not share the same buttons.
            </p>
          </Prose>
          <GuideDayInTheLife />
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
              Tandem does not send email yet — not for a new lead, an
              assignment, a welcome, a password reset, or the org-admin login
              when a company is created. If you never open the app, you will
              not hear about a new lead. Sending emails is an{" "}
              <Link
                to="/upcoming"
                className="font-medium text-foreground underline underline-offset-4"
              >
                upcoming feature
              </Link>
              . There is no Forgot password on login, and an admin cannot set a
              new password for you yet. Signing in with Google is also{" "}
              <Link
                to="/upcoming"
                className="font-medium text-foreground underline underline-offset-4"
              >
                upcoming
              </Link>
              .
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
              <strong>whole company</strong> (director, sales manager, and org
              admin). You can show, hide, and
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
