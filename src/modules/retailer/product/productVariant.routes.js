import express from "express";
import {
  findAllProductVariantsForRetailerController,
  findProductWithVariantsForRetailerController,
} from "./productVariant.controller.js";

const router = express.Router();

/* ================= FIND ALL PRODUCT VARIANTS (RETAILER) ================= */
router.get(
  "/",
  findAllProductVariantsForRetailerController
);

router.get(
  "/:productId",
  findProductWithVariantsForRetailerController
);

export default router;
