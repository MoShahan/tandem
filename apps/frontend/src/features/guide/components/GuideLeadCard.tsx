import { Building2, Mail, MapPin, Phone, UserRound } from "lucide-react";

import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";

import { GUIDE_WELL, GuideFigure } from "./GuideFigure";

const FIELDS = [
  { icon: Phone, label: "Mobile", value: "98765 43210" },
  { icon: Mail, label: "Email", value: "priya@example.com" },
  { icon: MapPin, label: "Source", value: "Walk-in" },
  { icon: Building2, label: "Project", value: "Riverside Heights" },
] as const;

export const GuideLeadCard = () => (
  <GuideFigure
    label="A lead is a person"
    caption="Priya is a potential customer, not an employee. The team and owner are your salespeople. Priya never logs in."
  >
    <div className={`mx-auto max-w-md rounded-xl border p-4 shadow-sm ${GUIDE_WELL}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            PS
          </div>
          <div>
            <p className="font-medium">Priya Shah</p>
            <p className="text-xs text-muted-foreground">Potential customer</p>
          </div>
        </div>
        <LeadStatusBadge status="NEW" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {FIELDS.map((field) => (
          <div key={field.label} className="space-y-1">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <field.icon className="size-3.5" />
              {field.label}
            </dt>
            <dd className="text-sm">{field.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2 border-t pt-3 text-xs">
        <span className="rounded-full border bg-background px-2.5 py-1">
          Team: North
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1">
          <UserRound className="size-3" />
          Owner: unassigned
        </span>
      </div>
    </div>
  </GuideFigure>
);
