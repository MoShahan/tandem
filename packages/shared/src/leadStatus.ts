export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "SITE_VISIT_COMPLETED"
  | "VISIT_SCHEDULED";

export const LINEAR_LEAD_STAGES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "VISIT_SCHEDULED",
  "SITE_VISIT_COMPLETED",
  "NEGOTIATION",
];

export const TERMINAL_LEAD_STAGES: LeadStatus[] = ["WON", "LOST"];

export const LEAD_STATUS_SORT_ORDER: LeadStatus[] = [
  ...LINEAR_LEAD_STAGES,
  ...TERMINAL_LEAD_STAGES,
];

export const getLeadStatusSortIndex = (status: LeadStatus): number =>
  LEAD_STATUS_SORT_ORDER.indexOf(status);

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  VISIT_SCHEDULED: "Visit scheduled",
  SITE_VISIT_COMPLETED: "Site visit completed",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

const isTerminalStatus = (status: LeadStatus) =>
  TERMINAL_LEAD_STAGES.includes(status);

export const getNextLinearStatus = (current: LeadStatus): LeadStatus | null => {
  if (isTerminalStatus(current)) {
    return null;
  }

  const index = LINEAR_LEAD_STAGES.indexOf(current);

  if (index === -1 || index >= LINEAR_LEAD_STAGES.length - 1) {
    return null;
  }

  return LINEAR_LEAD_STAGES[index + 1];
};

export const getAllowedNextStatuses = (current: LeadStatus): LeadStatus[] =>
  LEAD_STATUS_SORT_ORDER.filter((status) => status !== current);

export const getQuickAdvanceStatuses = (current: LeadStatus): LeadStatus[] => {
  if (isTerminalStatus(current)) {
    return [];
  }

  const next = getNextLinearStatus(current);
  const quick: LeadStatus[] = [];

  if (next) {
    quick.push(next);
  }

  if (current !== "WON") {
    quick.push("WON");
  }

  if (current !== "LOST") {
    quick.push("LOST");
  }

  return quick;
};

export const isTerminalLeadStatus = (status: LeadStatus) =>
  isTerminalStatus(status);

export const getLinearStageIndex = (status: LeadStatus): number =>
  LINEAR_LEAD_STAGES.indexOf(status);
