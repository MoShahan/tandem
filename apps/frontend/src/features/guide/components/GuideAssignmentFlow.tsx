import { ArrowDown, ArrowRight, Inbox, UserRound } from "lucide-react";

import { GUIDE_WELL, GuideFigure } from "./GuideFigure";

export const GuideAssignmentFlow = () => (
  <div className="space-y-4">
    <GuideFigure
      label="Assignment is handing work to someone"
      caption="Unassigned leads sit on the team pile. A team leader gives one to an executive. Reassigning moves it to someone else."
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:justify-center">
        <div className={`flex w-full max-w-40 flex-col items-center gap-2 rounded-xl border border-dashed p-4 text-center ${GUIDE_WELL}`}>
          <Inbox className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Unassigned</p>
          <p className="text-xs text-muted-foreground">Team pile</p>
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="rounded-md bg-background px-2 py-1 text-xs">
              Priya Shah
            </span>
            <span className="rounded-md bg-background px-2 py-1 text-xs">
              Arun Mehta
            </span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground" aria-hidden>
          <ArrowRight className="hidden size-5 sm:block" />
          <ArrowDown className="size-5 sm:hidden" />
        </div>

        <div className="flex w-full max-w-40 flex-col items-center gap-2 rounded-xl border bg-primary/10 p-4 text-center">
          <UserRound className="size-6 text-primary" />
          <p className="text-sm font-medium">Asha</p>
          <p className="text-xs text-muted-foreground">Executive, owner</p>
          <span className="rounded-md border bg-background px-2 py-1 text-xs">
            Priya Shah
          </span>
        </div>

        <div className="flex items-center text-muted-foreground" aria-hidden>
          <ArrowRight className="hidden size-5 sm:block" />
          <ArrowDown className="size-5 sm:hidden" />
        </div>

        <div className={`flex w-full max-w-40 flex-col items-center gap-2 rounded-xl border p-4 text-center ${GUIDE_WELL}`}>
          <UserRound className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Rohan</p>
          <p className="text-xs text-muted-foreground">Reassigned to</p>
          <span className="rounded-md border bg-background px-2 py-1 text-xs">
            Priya Shah
          </span>
        </div>
      </div>
    </GuideFigure>

    <GuideFigure
      label="Who can see which leads"
      caption="Executives see only their own. Team leaders see the whole team. Directors and sales managers see the company."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "Executive",
            rows: ["Own", "Own", "Hidden"],
          },
          {
            title: "Team leader",
            rows: ["Team", "Team", "Team"],
          },
          {
            title: "Director",
            rows: ["Org", "Org", "Org"],
          },
        ].map((scope) => (
          <div key={scope.title} className={`space-y-2 rounded-lg border p-3 ${GUIDE_WELL}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {scope.title}
            </p>
            <div className="space-y-1.5">
              {scope.rows.map((row, index) => (
                <div
                  key={`${scope.title}-${index}`}
                  className={`rounded-md px-2 py-1.5 text-center text-xs ${
                    row === "Hidden"
                      ? "border border-dashed text-muted-foreground/50"
                      : row === "Own"
                        ? "bg-primary/15 text-foreground"
                        : row === "Team"
                          ? "bg-primary/25 text-foreground"
                          : "bg-primary/40 text-foreground"
                  }`}
                >
                  {row === "Hidden" ? "Not visible" : `${row} lead`}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GuideFigure>
  </div>
);
