import { Link } from "react-router-dom";

import { TandemLogo } from "@/components/TandemLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

import type { ReactNode } from "react";

type GuidePageLayoutProps = {
  children: ReactNode;
};

export const GuidePageLayout = ({ children }: GuidePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted dark:bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 py-4">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
          >
            <TandemLogo className="size-8" />
            <span className="truncate text-sm font-medium">Tandem</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link to="/upcoming">Upcoming</Link>
            </Button>
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-6 text-sm text-muted-foreground">
          <Link
            to="/privacy"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            to="/upcoming"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Upcoming
          </Link>
        </div>
      </footer>
    </div>
  );
};
