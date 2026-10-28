import { Link } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { NO_FEATURES_COPY } from "@/constants/orgModules";
import {
  selectAuthOrganization,
  selectCanAccessNotifications,
} from "@/features/auth/authSelectors";

export const HomePage = () => {
  const organization = useAppSelector(selectAuthOrganization);
  const canAccessNotifications = useAppSelector(selectCanAccessNotifications);
  const description = organization
    ? `${organization.name} has not enabled any modules you can access, or your role does not include them. Ask an organization admin to turn on modules or update your permissions.`
    : NO_FEATURES_COPY.description;

  return (
    <Card className="mx-auto w-full max-w-xl shadow-sm">
      <CardHeader>
        <h1 className="text-lg font-semibold leading-none tracking-tight">
          {NO_FEATURES_COPY.title}
        </h1>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/account">Open account</Link>
        </Button>
        {canAccessNotifications ? (
          <Button asChild variant="outline">
            <Link to="/notifications">Notifications</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};
