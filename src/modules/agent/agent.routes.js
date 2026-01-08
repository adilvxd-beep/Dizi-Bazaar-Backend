import express from "express";
import { getAgents, updateAgent } from "./agent.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.ADMIN), getAgents);
router.put("/:id", authenticate, authorize(ROLES.ADMIN), updateAgent);

export default router;
