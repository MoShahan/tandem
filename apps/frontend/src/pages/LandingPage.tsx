import { Link } from "react-router-dom";

import { TandemLogo } from "@/components/TandemLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

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

      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <TandemLogo className="mb-8 size-16" />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Streamline your sales operations
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          A shared workspace for a company&apos;s sales team. Leads, owners, and
          the pipeline live in one place — not a website for your customers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/guide">How Tandem works</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/upcoming">Upcoming features</Link>
          </Button>
        </div>
      </main>

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
