import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

import { PlatformDashboardPage } from "./PlatformDashboardPage";
import { platformService } from "../platformService";
import { platformAdminState } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/render";

vi.mock("../platformService", () => ({
  platformService: {
    getPlatformStats: vi.fn(),
  },
}));

describe("PlatformDashboardPage", () => {
  it("shows org, active-user, and lead counts", async () => {
    vi.mocked(platformService.getPlatformStats).mockResolvedValue({
      organizationCount: 5,
      activeOrganizationCount: 4,
      activeUserCount: 18,
      leadCount: 42,
    });

    renderWithProviders(<PlatformDashboardPage />, {
      preloadedState: platformAdminState(),
    });

    expect(
      await screen.findByRole("heading", { name: "Platform overview" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("4 active")).toBeInTheDocument();
    expect(screen.getByText("Active users")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("Leads created")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
