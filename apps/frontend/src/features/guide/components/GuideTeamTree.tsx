import { UserRound } from "lucide-react";

import { GuideDownArrow, GuideFigure } from "./GuideFigure";

export const GuideTeamTree = () => (
  <GuideFigure
    label="A team is a small sales unit"
    caption="One team leader, a few executives, and the leads those people work. A person can only be on one team."
  >
    <div className="flex flex-col items-center">
      <div className="rounded-xl border bg-primary/10 px-4 py-3 text-center">
        <p className="text-sm font-medium">Kiran - team leader</p>
        <p className="text-xs text-muted-foreground">Sees every lead on North</p>
      </div>
      <GuideDownArrow />
      <div className="grid w-full gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-background p-3">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <UserRound className="size-4 text-primary" />
            Asha - executive
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="rounded-md bg-muted/50 px-2 py-1">Priya Shah</p>
            <p className="rounded-md bg-muted/50 px-2 py-1">Dev Patel</p>
          </div>
        </div>
        <div className="rounded-xl border bg-background p-3">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <UserRound className="size-4 text-primary" />
            Rohan - executive
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="rounded-md bg-muted/50 px-2 py-1">Arun Mehta</p>
            <p className="rounded-md border border-dashed px-2 py-1">
              No more assigned leads
            </p>
          </div>
        </div>
      </div>
    </div>
  </GuideFigure>
);
