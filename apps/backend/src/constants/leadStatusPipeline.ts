import {
  getAllowedNextStatuses as getSharedAllowedNextStatuses,
  getNextLinearStatus as getSharedNextLinearStatus,
  getQuickAdvanceStatuses as getSharedQuickAdvanceStatuses,
  LEAD_STATUS_LABELS,
  LINEAR_LEAD_STAGES,
  TERMINAL_LEAD_STAGES,
} from "@tandem/shared";

import { LeadStatus } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";

export {
  LEAD_STATUS_LABELS,
  LINEAR_LEAD_STAGES,
  TERMINAL_LEAD_STAGES,
};

export const getAllowedNextStatuses = (current: LeadStatus): LeadStatus[] =>
  getSharedAllowedNextStatuses(current) as LeadStatus[];

export const getNextLinearStatus = (current: LeadStatus): LeadStatus | null =>
  getSharedNextLinearStatus(current) as LeadStatus | null;

export const getQuickAdvanceStatuses = (current: LeadStatus): LeadStatus[] =>
  getSharedQuickAdvanceStatuses(current) as LeadStatus[];

export const assertValidStatusTransition = (
  from: LeadStatus,
  to: LeadStatus,
) => {
  if (from === to) {
    return;
  }

  const allowed = getAllowedNextStatuses(from);

  if (!allowed.includes(to)) {
    throw AppError.badRequest(
      `Invalid status transition from ${LEAD_STATUS_LABELS[from]} to ${LEAD_STATUS_LABELS[to]}`,
      [
        {
          field: "status",
          message: `Cannot move from ${LEAD_STATUS_LABELS[from]} to ${LEAD_STATUS_LABELS[to]}`,
        },
      ],
    );
  }
};
