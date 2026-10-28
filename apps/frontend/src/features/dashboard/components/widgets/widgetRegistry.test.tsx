import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  DASHBOARD_WIDGET_KEYS,
  type DashboardWidgetKey,
} from "../../dashboardLayoutTypes";
import { renderDashboardWidget } from "./widgetRegistry";

import type { MeDashboardSummary } from "../../dashboardTypes";

const mockSummary: MeDashboardSummary = {
  view: "me",
  conversion: {
    totalLeads: 10,
    openLeads: 4,
    wonCount: 4,
    lostCount: 2,
    closedCount: 6,
    winRate: 67,
    unassignedCount: 0,
  },
  totalActivities: 5,
  statusBreakdown: [],
  recentActivities: [],
  needsAttentionCount: 1,
};

describe("renderDashboardWidget", () => {
  it("renders known widget components", () => {
    render(
      <>
        {renderDashboardWidget(
          DASHBOARD_WIDGET_KEYS.CONVERSION_OVERVIEW,
          mockSummary,
        )}
      </>,
    );

    expect(screen.getByText("Assigned leads")).toBeInTheDocument();
  });

  it("returns null for unknown widget keys", () => {
    const result = renderDashboardWidget(
      "unknown_widget" as DashboardWidgetKey,
      mockSummary,
    );

    expect(result).toBeNull();
  });
});
