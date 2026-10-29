import { DAY_IN_THE_LIFE } from "../content/guideContent";

import { GUIDE_WELL, GuideFigure } from "./GuideFigure";

export const GuideDayInTheLife = () => (
  <GuideFigure
    label="Same morning, two jobs"
    caption="Kavya fills the team pile and hands work out. Asha works her assigned leads and can capture a walk-in of her own. That split is why “executive” here means salesperson, not CEO."
  >
    <div className="grid gap-4 lg:grid-cols-2">
      {DAY_IN_THE_LIFE.map((day) => (
        <article
          key={day.id}
          className={`flex flex-col gap-4 rounded-xl border p-4 sm:p-5 ${GUIDE_WELL}`}
        >
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {day.role}
            </p>
            <h3 className="text-sm font-semibold text-foreground">
              {day.person}
            </h3>
            <p className="text-xs text-muted-foreground">{day.setting}</p>
          </header>
          <ol className="space-y-3">
            {day.steps.map((step) => (
              <li key={step.time} className="flex gap-3">
                <time className="w-10 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                  {step.time}
                </time>
                <div className="min-w-0 space-y-1 rounded-lg border bg-background px-3 py-2">
                  <p className="text-sm font-medium text-foreground">
                    {step.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-auto text-xs leading-relaxed text-muted-foreground">
            {day.limit}
          </p>
        </article>
      ))}
    </div>
  </GuideFigure>
);
