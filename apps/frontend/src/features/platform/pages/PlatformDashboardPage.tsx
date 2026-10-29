import { Building2, Kanban, LayoutDashboard, Users } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatCard } from "@/features/dashboard/components/DashboardStatGrid";

import {
  selectPlatformStats,
  selectPlatformStatsError,
  selectPlatformStatsStatus,
} from "../platformSelectors";
import { fetchPlatformStats } from "../platformSlice";

export const PlatformDashboardPage = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectPlatformStats);
  const status = useAppSelector(selectPlatformStatsStatus);
  const error = useAppSelector(selectPlatformStatsError);
  const isLoading = status === "idle" || status === "loading";

  useEffect(() => {
    void dispatch(fetchPlatformStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="size-4" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Platform overview
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Counts across every company on Tandem.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/platform/organizations">View organizations</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DashboardStatCard
            label="Organizations"
            value={stats.organizationCount}
            description={
              stats.activeOrganizationCount === stats.organizationCount
                ? "All currently active"
                : `${stats.activeOrganizationCount} active`
            }
            icon={Building2}
            tone="primary"
          />
          <DashboardStatCard
            label="Active users"
            value={stats.activeUserCount}
            description="People with an active login in a company"
            icon={Users}
            tone="info"
          />
          <DashboardStatCard
            label="Leads created"
            value={stats.leadCount}
            description="Created across all companies"
            icon={Kanban}
            tone="success"
          />
        </div>
      ) : null}
    </div>
  );
};
