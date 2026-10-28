import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";

import { PIPELINE_STEPS } from "../content/guideContent";

import { GuideArrow, GuideDownArrow, GuideFigure } from "./GuideFigure";

export const GuidePipeline = () => {
  const openSteps = PIPELINE_STEPS.filter((step) => !step.closed);
  const closedSteps = PIPELINE_STEPS.filter((step) => step.closed);

  return (
    <div className="space-y-4">
      <GuideFigure
        label="The path a lead walks"
        caption="One step at a time. From negotiation the deal either becomes won or lost, and then it is closed."
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full flex-wrap items-center justify-center gap-y-2">
            {openSteps.map((step, index) => (
              <div key={step.status} className="flex items-center">
                {index > 0 ? <GuideArrow /> : null}
                <LeadStatusBadge status={step.status} className="h-7 px-2.5" />
              </div>
            ))}
          </div>
          <GuideDownArrow />
          <div className="flex items-center gap-3">
            <LeadStatusBadge status="WON" className="h-7 px-3" />
            <span className="text-xs text-muted-foreground">or</span>
            <LeadStatusBadge status="LOST" className="h-7 px-3" />
          </div>
        </div>
      </GuideFigure>

      <ol className="grid gap-2 sm:grid-cols-2">
        {PIPELINE_STEPS.map((step, index) => (
          <li
            key={step.status}
            className="flex gap-3 rounded-lg border bg-card px-3 py-2"
          >
            <span className="mt-0.5 font-mono text-xs text-muted-foreground">
              {step.closed ? "C" : String(index + 1)}
            </span>
            <div className="space-y-1">
              <LeadStatusBadge status={step.status} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {step.meaning}
              </p>
            </div>
          </li>
        ))}
        <li className="flex items-center gap-2 rounded-lg border border-dashed bg-muted px-3 py-2 text-xs text-muted-foreground sm:col-span-2">
          Closed ({closedSteps.map((step) => step.status === "WON" ? "Won" : "Lost").join(" / ")})
          cannot be edited, reassigned, or moved.
        </li>
      </ol>
    </div>
  );
};
