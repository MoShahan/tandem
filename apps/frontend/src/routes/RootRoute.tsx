import { useAppSelector } from "@/app/hooks";
import { PageSkeleton } from "@/components/PageSkeleton";
import {
  selectAuthStatus,
  selectIsAuthenticated,
} from "@/features/auth/authSelectors";
import { LandingPage } from "@/pages/LandingPage";
import { DefaultLandingRedirect } from "@/routes/DefaultLandingRedirect";

export const RootRoute = () => {
  const status = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (status === "idle" || status === "loading") {
    return <PageSkeleton />;
  }

  if (isAuthenticated) {
    return <DefaultLandingRedirect />;
  }

  return <LandingPage />;
};
