import express from "express";
import { getDeliveries, updateDelivery } from "./delivery.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.AGENT),
  getDeliveries
);
router.put("/:id", authenticate, authorize(ROLES.AGENT), updateDelivery);

export default router;
