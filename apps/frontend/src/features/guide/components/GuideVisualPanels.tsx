import {
  Bell,
  Building2,
  Calculator,
  LayoutDashboard,
  Mail,
  Shield,
  SlidersHorizontal,
  Warehouse,
  X,
} from "lucide-react";

import { GUIDE_WELL, GuideFigure } from "./GuideFigure";

export const GuideRoleLadder = () => (
  <GuideFigure
    label="Who sits where"
    caption="Tandem does not store a boss field. What you can see is the reporting line: director over managers, team leader over executives. Org admin sits beside sales, not above it. Platform admin is outside the company."
  >
    <div className="space-y-2">
      <div className="rounded-lg border border-dashed px-3 py-2 text-center text-sm">
        Platform admin
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Operates Tandem, not a salesperson
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-primary/10 px-3 py-2 text-center text-sm">
          Org admin
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Users, teams, roles — office side
          </span>
        </div>
        <div className="rounded-lg bg-primary/20 px-3 py-2 text-center text-sm">
          Director
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Head of sales, whole-company view
          </span>
        </div>
      </div>
      <div className="rounded-lg bg-primary/25 px-3 py-2 text-center text-sm">
        Sales manager
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Several teams; company-wide leads
        </span>
      </div>
      <div className="rounded-lg bg-primary/30 px-3 py-2 text-center text-sm">
        Team leader
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Boss of one team; creates and assigns leads
        </span>
      </div>
      <div className="rounded-lg bg-primary/45 px-3 py-2 text-center text-sm">
        Executive
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Salesperson on that team — the “team member,” not a CEO
        </span>
      </div>
    </div>
  </GuideFigure>
);

export const GuideModulesPanel = () => (
  <GuideFigure
    label="Modules are on/off switches"
    caption="A platform admin can disable Sales, Dashboards, or Notifications for a company. Welcome password reminders still work."
  >
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { icon: Building2, title: "Sales", on: true, detail: "Leads and activities" },
        { icon: LayoutDashboard, title: "Dashboards", on: true, detail: "Charts and widgets" },
        { icon: Bell, title: "Notifications", on: false, detail: "Bell alerts paused" },
      ].map((module) => (
        <div
          key={module.title}
          className={`flex flex-col items-start gap-3 rounded-xl border p-3 ${GUIDE_WELL}`}
        >
          <div className="flex w-full items-center justify-between">
            <module.icon className="size-4 text-primary" />
            <span
              className={`relative h-5 w-9 rounded-full ${
                module.on ? "bg-primary" : "bg-foreground/20"
              }`}
              aria-hidden
            >
              <span
                className={`absolute top-0.5 size-4 rounded-full bg-background shadow ${
                  module.on ? "right-0.5" : "left-0.5"
                }`}
              />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{module.title}</p>
            <p className="text-xs text-muted-foreground">{module.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </GuideFigure>
);

export const GuideNotifyVsAudit = () => (
  <GuideFigure
    label="Two different logs"
    caption="The bell is for you. The audit trail is for compliance. Only one of them is a to-do."
  >
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-primary/10 p-4">
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Bell className="size-5" />
        </div>
        <p className="text-sm font-medium">Notification</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          "Priya Shah was assigned to you." Click it and go do the work.
        </p>
      </div>
      <div className={`rounded-xl p-4 ${GUIDE_WELL}`}>
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground">
          <Shield className="size-5" />
        </div>
        <p className="text-sm font-medium">Audit row</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          "Kiran assigned Priya to Asha at 4:02pm." You cannot edit this.
        </p>
      </div>
    </div>
  </GuideFigure>
);

export const GuideDashboardScopes = () => (
  <GuideFigure
    label="Dashboards nest like zoom levels"
    caption="An executive sees personal numbers. A team leader zooms out to the team. Directors, sales managers, and org admins zoom out to the company."
  >
    <div className={`space-y-2 rounded-xl border p-3 ${GUIDE_WELL}`}>
      <p className="text-center text-[11px] uppercase tracking-wide text-muted-foreground">
        Organization
      </p>
      <div className="rounded-lg border bg-card p-3">
        <p className="text-center text-[11px] uppercase tracking-wide text-muted-foreground">
          Team
        </p>
        <div className="mt-2 rounded-md bg-primary/20 px-3 py-4 text-center">
          <LayoutDashboard className="mx-auto mb-1 size-4 text-primary" />
          <p className="text-sm font-medium">My numbers</p>
          <p className="text-xs text-muted-foreground">Executive view</p>
        </div>
      </div>
    </div>
  </GuideFigure>
);

export const GuideNotErp = () => (
  <GuideFigure
    label="Tandem is a sales CRM"
    caption="It tracks people you hope to sell to. It is not accounting, inventory, payroll, or an email blaster."
  >
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[
        { icon: Calculator, label: "Accounting", included: false },
        { icon: Warehouse, label: "Inventory", included: false },
        { icon: Mail, label: "Email marketing", included: false },
        { icon: SlidersHorizontal, label: "Sales pipeline", included: true },
      ].map((item) => (
        <div
          key={item.label}
          className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${
            item.included ? "bg-primary/10" : GUIDE_WELL
          }`}
        >
          <item.icon
            className={`size-5 ${
              item.included ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="text-xs font-medium">{item.label}</p>
          {item.included ? (
            <span className="text-[10px] text-primary">Included</span>
          ) : (
            <X className="size-3.5 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  </GuideFigure>
);
