import {
  assignLeadSchema,
  createActivitySchema,
  createLeadSchema,
  updateLeadSchema,
} from "@tandem/shared";
import { Router } from "express";

import { ORG_MODULE_KEYS } from "../constants/orgModules";
import { PERMISSIONS } from "../constants/permissions";
import {
  assignLead,
  createActivity,
  createLead,
  getLead,
  listActivities,
  listLeads,
  listStatusHistory,
  updateLead,
} from "../controllers/lead.controller";
import { authenticate } from "../middleware/authenticate";
import { requireAnyPermission } from "../middleware/requireAnyPermission";
import { requireOrgModule } from "../middleware/requireOrgModule";
import { requirePermission } from "../middleware/requirePermission";
import { validateBody } from "../middleware/validateBody";

const router = Router();

const salesModule = [
  authenticate,
  requireOrgModule(ORG_MODULE_KEYS.SALES),
];

const leadsRead = [
  requireAnyPermission(
    PERMISSIONS.LEADS_READ,
    PERMISSIONS.LEADS_READ_TEAM,
    PERMISSIONS.LEADS_READ_ORG,
  ),
];

const leadsWrite = [requirePermission(PERMISSIONS.LEADS_WRITE)];

const leadsUpdate = [
  requireAnyPermission(
    PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.LEADS_STATUS_WRITE,
    PERMISSIONS.LEADS_STATUS_WRITE_TEAM,
  ),
];

const leadsReassign = [
  requirePermission(PERMISSIONS.LEADS_WRITE, PERMISSIONS.LEADS_READ_TEAM),
];

const activitiesWrite = [requirePermission(PERMISSIONS.ACTIVITIES_WRITE)];

router.get("/", ...salesModule, ...leadsRead, listLeads);
router.post("/", ...salesModule, ...leadsWrite, validateBody(createLeadSchema), createLead);
router.get("/:id", ...salesModule, ...leadsRead, getLead);
router.patch("/:id", ...salesModule, ...leadsUpdate, validateBody(updateLeadSchema), updateLead);
router.patch("/:id/assign", ...salesModule, ...leadsReassign, validateBody(assignLeadSchema), assignLead);
router.get("/:id/activities", ...salesModule, ...leadsRead, listActivities);
router.get(
  "/:id/status-history",
  ...salesModule,
  ...leadsRead,
  listStatusHistory,
);
router.post("/:id/activities", ...salesModule, ...activitiesWrite, validateBody(createActivitySchema), createActivity);

export default router;
