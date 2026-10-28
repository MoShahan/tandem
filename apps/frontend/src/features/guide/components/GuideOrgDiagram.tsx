import { Building2, Kanban, Users, UsersRound } from "lucide-react";

import { GuideArrow, GuideFigure } from "./GuideFigure";

const NODES = [
  {
    icon: Building2,
    title: "Organization",
    body: "Your company",
  },
  {
    icon: UsersRound,
    title: "Teams",
    body: "Sales groups",
  },
  {
    icon: Users,
    title: "People",
    body: "Leaders and executives",
  },
  {
    icon: Kanban,
    title: "Leads",
    body: "Potential customers",
  },
] as const;

export const GuideOrgDiagram = () => {
  return (
    <GuideFigure
      label="How a company is structured"
      caption="Work flows from the company into teams, then to people, then to leads. Another company on Tandem cannot see any of this."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-1">
        {NODES.map((node, index) => (
          <div key={node.title} className="flex flex-1 items-stretch gap-1">
            {index > 0 ? (
              <GuideArrow className="hidden sm:flex" />
            ) : null}
            <div className="flex flex-1 gap-3 rounded-xl border bg-muted/30 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <node.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{node.title}</p>
                <p className="text-xs text-muted-foreground">{node.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GuideFigure>
  );
};
