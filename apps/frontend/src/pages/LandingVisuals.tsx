import { elevatedShadowClassName } from "@/lib/tableSurface";

const frameClassName = `overflow-hidden rounded-2xl bg-card ${elevatedShadowClassName}`;

export const LandingPipelineImage = () => (
  <figure className="space-y-2">
    <div className={frameClassName}>
      <svg
        viewBox="0 0 560 280"
        className="h-auto w-full text-primary"
        role="img"
        aria-label="A sales pipeline with leads in New, Talking, Visit, and Closed"
      >
        <title>Leads move through the pipeline</title>
        <rect width="560" height="280" className="fill-card" />
        {[
          { x: 24, label: "New", cards: 3 },
          { x: 154, label: "Talking", cards: 2 },
          { x: 284, label: "Visit", cards: 2 },
          { x: 414, label: "Closed", cards: 1 },
        ].map((column) => (
          <g key={column.label}>
            <text
              x={column.x + 54}
              y="36"
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="11"
            >
              {column.label}
            </text>
            {Array.from({ length: column.cards }, (_, index) => (
              <g key={`${column.label}-${index}`}>
                <rect
                  x={column.x}
                  y={52 + index * 68}
                  width="108"
                  height="56"
                  rx="10"
                  className="fill-muted dark:fill-[color-mix(in_oklch,var(--muted),var(--foreground)_10%)]"
                />
                <circle
                  cx={column.x + 20}
                  cy={74 + index * 68}
                  r="8"
                  fill="currentColor"
                  fillOpacity="0.45"
                />
                <rect
                  x={column.x + 34}
                  y={68 + index * 68}
                  width="58"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  fillOpacity="0.28"
                />
                <rect
                  x={column.x + 34}
                  y={82 + index * 68}
                  width="40"
                  height="5"
                  rx="2.5"
                  fill="currentColor"
                  fillOpacity="0.14"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
    <figcaption className="px-1 text-center text-xs text-muted-foreground">
      Every lead sits in a stage the whole office can see
    </figcaption>
  </figure>
);

export const LandingLeadsImage = () => (
  <figure className="space-y-2">
    <div className={frameClassName}>
      <svg
        viewBox="0 0 560 280"
        className="h-auto w-full text-primary"
        role="img"
        aria-label="A lead list with an owner on each row"
      >
        <title>Each lead has an owner</title>
        <rect width="560" height="280" className="fill-card" />
        {[
          { name: "Anita Rao", owner: "Kavya", y: 28 },
          { name: "Rohit Shah", owner: "Imran", y: 90 },
          { name: "Meera Iyer", owner: "Kavya", y: 152 },
          { name: "Arjun Nair", owner: "Priya", y: 214 },
        ].map((row) => (
          <g key={row.name}>
            <rect
              x="24"
              y={row.y}
              width="512"
              height="50"
              rx="12"
              className="fill-muted dark:fill-[color-mix(in_oklch,var(--muted),var(--foreground)_10%)]"
            />
            <circle
              cx="52"
              cy={row.y + 25}
              r="12"
              fill="currentColor"
              fillOpacity="0.45"
            />
            <text
              x="76"
              y={row.y + 30}
              className="fill-foreground"
              fontSize="13"
            >
              {row.name}
            </text>
            <text
              x="512"
              y={row.y + 30}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize="12"
            >
              {row.owner}
            </text>
          </g>
        ))}
      </svg>
    </div>
    <figcaption className="px-1 text-center text-xs text-muted-foreground">
      Someone on the team owns every person in the book
    </figcaption>
  </figure>
);
