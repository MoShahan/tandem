import { GUIDE_WELL, GuideFigure } from "./GuideFigure";

const DONUT = {
  won: 8,
  lost: 4,
};

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL = DONUT.won + DONUT.lost;
const WON_LENGTH = (DONUT.won / TOTAL) * CIRCUMFERENCE;
const WIN_RATE = Math.round((DONUT.won / TOTAL) * 100);

const FUNNEL = [
  { label: "New", count: 20, width: 100 },
  { label: "Contacted", count: 14, width: 78 },
  { label: "Visit scheduled", count: 10, width: 60 },
  { label: "Negotiation", count: 6, width: 42 },
  { label: "Won", count: 4, width: 28 },
] as const;

export const GuideOutcomeCharts = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    <GuideFigure
      label="Win rate ignores open leads"
      caption="Example only: 8 won and 4 lost is 67%. The 10 still-open leads do not count."
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          viewBox="0 0 120 120"
          className="size-32"
          role="img"
          aria-label={`Example donut chart, ${WIN_RATE} percent win rate`}
        >
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            className="stroke-rose-200 dark:stroke-rose-900"
            strokeWidth="14"
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth="14"
            strokeDasharray={`${WON_LENGTH} ${CIRCUMFERENCE - WON_LENGTH}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <text
            x="60"
            y="56"
            textAnchor="middle"
            className="fill-foreground"
            fontSize="18"
            fontWeight="600"
          >
            {WIN_RATE}%
          </text>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="9"
          >
            win rate
          </text>
        </svg>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            {DONUT.won} won
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-300 dark:bg-rose-800" />
            {DONUT.lost} lost
          </span>
        </div>
      </div>
    </GuideFigure>

    <GuideFigure
      label="A pipeline usually gets narrower"
      caption="Example only: not every new lead becomes a customer. That is why the bars shrink."
    >
      <div className="space-y-2" role="img" aria-label="Example funnel bar chart of leads by stage">
        {FUNNEL.map((row) => (
          <div key={row.label} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{row.label}</span>
              <span>{row.count}</span>
            </div>
            <div className={`h-2.5 overflow-hidden rounded-full ${GUIDE_WELL}`}>
              <div
                className={`h-full rounded-full ${
                  row.label === "Won" ? "bg-emerald-500" : "bg-primary/70"
                }`}
                style={{ width: `${row.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GuideFigure>
  </div>
);
