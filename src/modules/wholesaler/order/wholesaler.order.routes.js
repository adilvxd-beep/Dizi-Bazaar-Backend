import express from "express";
import { getBroadcasts, acceptOrder, getOrders } from "./wholesaler.order.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.WHOLESALER));

// List active broadcasts for this wholesaler
router.get("/broadcasts", getBroadcasts);

// Accept specific items from a broadcasted order
router.post("/accept", acceptOrder);

// Get legacy/fulfilled orders by this wholesaler
router.get("/", getOrders);

export default router;
