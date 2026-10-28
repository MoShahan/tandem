import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrganizationDetailPage } from "./OrganizationDetailPage";
import { platformService } from "../platformService";
import { platformAdminState } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/render";

import type { Organization } from "../platformTypes";

vi.mock("../platformService", () => ({
  platformService: {
    getOrganization: vi.fn(),
    getOrganizationModules: vi.fn(),
    updateOrganization: vi.fn(),
    updateOrganizationStatus: vi.fn(),
  },
}));

const organization: Organization = {
  id: "org-1",
  name: "Wayne Enterprises",
  code: "wayne",
  description: "Gotham operations",
  logoUrl: null,
  status: "ACTIVE",
  userCount: 4,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const renderDetail = () =>
  renderWithProviders(
    <Routes>
      <Route
        path="/platform/organizations/:id"
        element={<OrganizationDetailPage />}
      />
    </Routes>,
    {
      route: "/platform/organizations/org-1",
      preloadedState: platformAdminState(),
    },
  );

describe("OrganizationDetailPage", () => {
  beforeEach(() => {
    vi.mocked(platformService.getOrganization).mockResolvedValue(organization);
    vi.mocked(platformService.getOrganizationModules).mockResolvedValue({
      modules: { sales: true, dashboards: true, notifications: true },
      catalog: [],
    });
  });

  it("opens in read-only view and switches to edit on demand", async () => {
    const user = userEvent.setup();
    renderDetail();

    expect(
      await screen.findByRole("heading", { name: "Wayne Enterprises" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gotham operations")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Name" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "Wayne Enterprises",
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("textbox", { name: "Name" }),
      ).not.toBeInTheDocument();
    });
  });
});
