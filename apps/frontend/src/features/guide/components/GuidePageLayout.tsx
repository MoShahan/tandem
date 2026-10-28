import { Link } from "react-router-dom";

import { HiliteLogo } from "@/components/HiliteLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

import type { ReactNode } from "react";

type GuidePageLayoutProps = {
  children: ReactNode;
};

export const GuidePageLayout = ({ children }: GuidePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 py-4">
          <Link
            to="/guide"
            className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
          >
            <HiliteLogo />
            <span className="truncate text-sm font-medium">Tandem</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
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
          </div>
          <Link
            to="/login"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Back to login
          </Link>
        </div>
      </footer>
    </div>
  );
};
