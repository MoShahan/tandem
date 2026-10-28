import { cn } from "@/lib/utils";

type TandemLogoProps = {
  className?: string;
  iconClassName?: string;
};

const TandemMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("size-[72%]", className)}
    aria-hidden
  >
    <path
      d="M4.2 5.2 11.4 12 4.2 18.8"
      stroke="currentColor"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.6 5.2 19.8 12 12.6 18.8"
      stroke="currentColor"
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TandemLogo = ({ className, iconClassName }: TandemLogoProps) => (
  <div
    className={cn(
      "flex size-10 shrink-0 items-center justify-center rounded-[0.7rem]",
      "bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground",
      "shadow-[inset_0_1px_0_oklch(1_0_0_/_0.28),0_1px_2px_oklch(0.2_0.05_223_/_0.18)]",
      className,
    )}
  >
    <TandemMark className={iconClassName} />
  </div>
);
