import { cn } from "@/lib/utils";

type TandemLogoProps = {
  className?: string;
  withWordmark?: boolean;
  /** White mark for surfaces that stay dark even in light theme (login hero). */
  onDark?: boolean;
};

const TandemMark = ({
  className,
  labeled = false,
  onDark = false,
}: {
  className?: string;
  labeled?: boolean;
  onDark?: boolean;
}) => (
  <span
    className={cn("relative inline-flex size-9 shrink-0", className)}
    role={labeled ? "img" : undefined}
    aria-label={labeled ? "Tandem" : undefined}
    aria-hidden={labeled ? undefined : true}
  >
    {onDark ? (
      <img
        src="/brand/tandem-mark-dark.png?v=2"
        alt=""
        className="size-full object-contain"
      />
    ) : (
      <>
        <img
          src="/brand/tandem-mark.png?v=2"
          alt=""
          className="size-full object-contain dark:hidden"
        />
        <img
          src="/brand/tandem-mark-dark.png?v=2"
          alt=""
          className="hidden size-full object-contain dark:block"
        />
      </>
    )}
  </span>
);

export const TandemLogo = ({
  className,
  withWordmark = false,
  onDark = false,
}: TandemLogoProps) => {
  if (!withWordmark) {
    return <TandemMark className={className} labeled onDark={onDark} />;
  }

  return (
    <div className={cn("flex flex-col items-center gap-2.5", className)}>
      <TandemMark className="size-16" onDark={onDark} />
      <span className="text-xl font-semibold tracking-tight">Tandem</span>
    </div>
  );
};
