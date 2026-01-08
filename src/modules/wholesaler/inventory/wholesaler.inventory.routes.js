import express from "express";
import {
  getInventory,
  updateInventory,
} from "./wholesaler.inventory.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.WHOLESALER), getInventory);
router.put("/:id", authenticate, authorize(ROLES.WHOLESALER), updateInventory);

export default router;
