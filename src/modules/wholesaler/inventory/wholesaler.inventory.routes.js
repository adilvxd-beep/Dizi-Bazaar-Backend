import express from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

import {
  getStock,
  getStockVariant,
  saveStock,
  updateStockQuantity,
  updateReservedQuantity,
  updatePricing,
  removeStock,
  lowStock,
  outOfStock,
  stockSummary,
  stockByProduct,
} from "./wholesaler.inventory.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.WHOLESALER), getStock);

router.get("/summary", authenticate, authorize(ROLES.WHOLESALER), stockSummary);

router.get("/low", authenticate, authorize(ROLES.WHOLESALER), lowStock);

router.get("/out", authenticate, authorize(ROLES.WHOLESALER), outOfStock);

router.get(
  "/product/:productId",
  authenticate,
  authorize(ROLES.WHOLESALER),
  stockByProduct,
);

router.get(
  "/variant/:variantId",
  authenticate,
  authorize(ROLES.WHOLESALER),
  getStockVariant,
);

router.post("/", authenticate, authorize(ROLES.WHOLESALER), saveStock);

router.patch(
  "/:variantId/quantity",
  authenticate,
  authorize(ROLES.WHOLESALER),
  updateStockQuantity,
);
router.patch(
  "/:variantId/reserved-quantity",
  authenticate,
  authorize(ROLES.WHOLESALER),
  updateReservedQuantity,
);

router.patch(
  "/:variantId/pricing",
  authenticate,
  authorize(ROLES.WHOLESALER),
  updatePricing,
);

router.delete(
  "/:variantId",
  authenticate,
  authorize(ROLES.WHOLESALER),
  removeStock,
);

export default router;
