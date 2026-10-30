import { Link } from "react-router-dom";

import { TandemLogo } from "@/components/TandemLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { textLinkClassName } from "@/lib/textLink";

import { LandingLeadsImage, LandingPipelineImage } from "./LandingVisuals";

export const LandingPage = () => {
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
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 sm:py-24">
        <TandemLogo className="mb-8 size-16" />
        <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Streamline your sales operations
        </h1>
        <div className="mt-4 max-w-xl space-y-3 text-center text-base leading-relaxed text-muted-foreground">
          <p>
            A shared workspace for a company&apos;s sales team. Leads, owners,
            and the pipeline live in one place - not a website for your
            customers.
          </p>
          <p>
            Each lead has an owner and a stage, so the office can see who is
            working whom. Team leaders watch their people. Directors see the
            whole company.
          </p>
          <p>
            Nobody is chasing a spreadsheet or a private notebook. Log in to
            open your workspace.
          </p>
        </div>

        <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
          <LandingPipelineImage />
          <LandingLeadsImage />
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-6 text-sm text-muted-foreground">
          <Link to="/privacy" className={textLinkClassName}>
            Privacy Policy
          </Link>
          <Link to="/terms" className={textLinkClassName}>
            Terms &amp; Conditions
          </Link>
          <Link to="/guide" className={textLinkClassName}>
            How Tandem works
          </Link>
          <Link to="/upcoming" className={textLinkClassName}>
            Upcoming
          </Link>
        </div>
      </footer>
    </div>
  );
};
