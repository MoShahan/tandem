export const GuideHero = () => (
  <div className="relative overflow-hidden rounded-2xl border bg-card bg-gradient-to-br from-primary/20 via-card to-card">
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--color-primary) 0.6px, transparent 0.6px)",
        backgroundSize: "18px 18px",
        maskImage:
          "linear-gradient(to bottom, black 0%, transparent 85%)",
      }}
      aria-hidden
    />
    <svg
      viewBox="0 0 720 220"
      className="relative h-auto w-full text-primary"
      role="img"
      aria-label="Illustration of two isolated companies, a sales funnel, and a lead becoming a customer"
    >
      <title>How Tandem organizes sales work</title>
      <defs>
        <linearGradient id="guide-funnel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <g className="text-foreground">
        <rect
          x="36"
          y="42"
          width="150"
          height="118"
          rx="16"
          className="fill-muted dark:fill-[color-mix(in_oklch,var(--muted),var(--foreground)_10%)] stroke-border"
          strokeWidth="1.5"
        />
        <rect x="56" y="62" width="28" height="22" rx="6" fill="currentColor" fillOpacity="0.55" />
        <rect x="92" y="64" width="70" height="6" rx="3" fill="currentColor" fillOpacity="0.28" />
        <rect x="92" y="76" width="46" height="5" rx="2.5" fill="currentColor" fillOpacity="0.16" />
        <rect x="56" y="98" width="110" height="22" rx="7" fill="currentColor" fillOpacity="0.08" />
        <rect x="56" y="126" width="110" height="22" rx="7" fill="currentColor" fillOpacity="0.08" />
        <text x="111" y="184" textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity="0.7">
          Company A
        </text>
      </g>

      <g stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.55">
        <path d="M198 100h28" strokeDasharray="4 4" />
        <rect x="231" y="94" width="18" height="14" rx="3" fill="currentColor" fillOpacity="0.12" />
        <path d="M235 94v-5a4 4 0 0 1 8 0v5" />
        <path d="M261 100h28" strokeDasharray="4 4" />
      </g>

      <g className="text-foreground">
        <rect
          x="312"
          y="42"
          width="150"
          height="118"
          rx="16"
          className="fill-muted dark:fill-[color-mix(in_oklch,var(--muted),var(--foreground)_10%)] stroke-border"
          strokeWidth="1.5"
        />
        <rect x="332" y="62" width="28" height="22" rx="6" fill="currentColor" fillOpacity="0.55" />
        <rect x="368" y="64" width="70" height="6" rx="3" fill="currentColor" fillOpacity="0.28" />
        <rect x="368" y="76" width="46" height="5" rx="2.5" fill="currentColor" fillOpacity="0.16" />
        <rect x="332" y="98" width="110" height="22" rx="7" fill="currentColor" fillOpacity="0.08" />
        <rect x="332" y="126" width="110" height="22" rx="7" fill="currentColor" fillOpacity="0.08" />
        <text x="387" y="184" textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity="0.7">
          Company B
        </text>
      </g>

      <path
        d="M500 48h170l-28 108H528z"
        fill="url(#guide-funnel)"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <circle cx="546" cy="72" r="6" fill="currentColor" opacity="0.55" />
      <circle cx="578" cy="68" r="6" fill="currentColor" opacity="0.45" />
      <circle cx="612" cy="74" r="6" fill="currentColor" opacity="0.4" />
      <circle cx="568" cy="102" r="6" fill="currentColor" opacity="0.5" />
      <circle cx="598" cy="108" r="6" fill="currentColor" opacity="0.35" />
      <circle cx="585" cy="136" r="7" fill="currentColor" opacity="0.7" />
      <text x="585" y="184" textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity="0.7">
        Leads become customers
      </text>
    </svg>
  </div>
);
