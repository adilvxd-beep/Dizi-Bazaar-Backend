import express from "express";
import { getOrders, createOrder } from "./admin.order.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.ADMIN), getOrders);
router.post("/", authenticate, authorize(ROLES.ADMIN), createOrder);

export default router;
