import { Link } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";
import { PageSkeleton } from "@/components/PageSkeleton";
import { TandemLogo } from "@/components/TandemLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  selectAuthStatus,
  selectIsAuthenticated,
} from "@/features/auth/authSelectors";
import { AppLayout } from "@/layouts/AppLayout";

const NotFoundContent = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center py-10">
      <Card className="w-full shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            404
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <CardDescription>
            This link is missing or no longer exists. Check the URL, or go back
            to a page you can open.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-center gap-2">
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/">Go to app</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Log in</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/guide">How Tandem works</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const NotFoundPage = () => {
  const status = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (status === "idle" || status === "loading") {
    return <PageSkeleton />;
  }

  if (isAuthenticated) {
    return (
      <AppLayout>
        <NotFoundContent isAuthenticated />
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/login"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <TandemLogo className="size-8" />
            <span className="text-sm font-medium">Tandem</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="px-6">
        <NotFoundContent isAuthenticated={false} />
      </main>
    </div>
  );
};
