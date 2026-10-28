import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

/** Nested well on a card: full muted is too close to white/card in both themes. */
export const GUIDE_WELL =
  "bg-[color-mix(in_oklch,var(--muted),var(--foreground)_10%)]";

type GuideFigureProps = {
  label: string;
  caption: string;
  className?: string;
  children: ReactNode;
};

export const GuideFigure = ({
  label,
  caption,
  className,
  children,
}: GuideFigureProps) => (
  <figure className="space-y-2">
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
    <figcaption className="text-xs leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">{label}. </span>
      {caption}
    </figcaption>
  </figure>
);

export const GuideArrow = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex items-center justify-center text-muted-foreground",
      className,
    )}
    aria-hidden
  >
    <span className="hidden h-px w-5 bg-border sm:block" />
    <svg
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const GuideDownArrow = () => (
  <div className="flex justify-center py-1 text-muted-foreground" aria-hidden>
    <svg viewBox="0 0 16 20" className="h-5 w-4" fill="none">
      <path
        d="M8 2v14M4 12l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
