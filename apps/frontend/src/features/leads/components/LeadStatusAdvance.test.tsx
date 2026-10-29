import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { LeadStatusAdvance } from "./LeadStatusAdvance";
import { renderWithProviders } from "@/test/render";

import type { Lead, LeadStatus } from "../leadsTypes";

const mockLead = (status: LeadStatus): Lead => ({
  id: "lead-1",
  name: "Test Lead",
  mobileNumber: "9876543210",
  email: null,
  source: null,
  project: null,
  status,
  lostReason: null,
  dealValue: null,
  expectedCloseDate: null,
  team: { id: "team-1", name: "Sales" },
  assignedTo: null,
  createdBy: { id: "user-1", name: "Creator", email: "creator@example.com" },
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
});

describe("LeadStatusAdvance", () => {
  it("lets a closed lead be reopened", () => {
    renderWithProviders(<LeadStatusAdvance lead={mockLead("WON")} />);

    expect(
      screen.getByRole("combobox", { name: "Reopen or move to" }),
    ).toBeInTheDocument();
  });

  it("renders advance actions for non-terminal statuses", () => {
    renderWithProviders(<LeadStatusAdvance lead={mockLead("NEW")} />);

    expect(screen.getByRole("button", { name: "Mark as contacted" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark as lost" })).toBeInTheDocument();
  });
});
