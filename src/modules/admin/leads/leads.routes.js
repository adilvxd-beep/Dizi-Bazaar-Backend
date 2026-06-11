import express from "express";
import * as controller from "./leads.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

// Public submission routes
router.post("/investment", controller.createInvestmentLead);
router.post("/agent-application", controller.createAgentApplication);

// Admin-only management routes
router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/investment", controller.getInvestmentLeads);
router.patch("/investment/:id/status", controller.updateInvestmentLeadStatus);

router.get("/agent-application", controller.getAgentApplications);
router.patch("/agent-application/:id/status", controller.updateAgentApplicationStatus);

export default router;
