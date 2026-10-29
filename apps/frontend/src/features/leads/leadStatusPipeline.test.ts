import { describe, expect, it } from "vitest";

import {
  getAllowedNextStatuses,
  getAdvanceActionLabel,
  getLinearStageIndex,
  isTerminalLeadStatus,
} from "./leadStatusPipeline";

describe("getAllowedNextStatuses", () => {
  it("allows skip, back, won, and lost from an open stage", () => {
    expect(getAllowedNextStatuses("CONTACTED")).toEqual([
      "NEW",
      "VISIT_SCHEDULED",
      "SITE_VISIT_COMPLETED",
      "NEGOTIATION",
      "WON",
      "LOST",
    ]);
  });

  it("allows reopening a closed lead", () => {
    expect(getAllowedNextStatuses("LOST")).toContain("NEW");
    expect(getAllowedNextStatuses("WON")).toContain("NEGOTIATION");
  });
});

describe("getAdvanceActionLabel", () => {
  it("returns known action labels", () => {
    expect(getAdvanceActionLabel("CONTACTED")).toBe("Mark as contacted");
    expect(getAdvanceActionLabel("WON")).toBe("Mark as won");
  });

  it("labels a move back to New", () => {
    expect(getAdvanceActionLabel("NEW")).toBe("Move to New");
  });
});

describe("isTerminalLeadStatus", () => {
  it("identifies terminal statuses", () => {
    expect(isTerminalLeadStatus("WON")).toBe(true);
    expect(isTerminalLeadStatus("LOST")).toBe(true);
    expect(isTerminalLeadStatus("NEW")).toBe(false);
  });
});

describe("getLinearStageIndex", () => {
  it("returns the index within the linear pipeline", () => {
    expect(getLinearStageIndex("NEW")).toBe(0);
    expect(getLinearStageIndex("NEGOTIATION")).toBe(4);
    expect(getLinearStageIndex("WON")).toBe(-1);
  });
});
