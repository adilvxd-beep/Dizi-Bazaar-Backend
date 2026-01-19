import express from "express";

import {
  getProducts,
  getProductByIdController,
  createProduct,
  createFullProduct,
  updateProduct,
  deleteProduct,
  getVariantByIdController,
  getVariantsByProduct,
  getVariantBySKUController,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantImagesController,
  addVariantImages,
  updateImageOrder,
  deleteVariantImage,
  getUserPricing,
  getVariantPricing,
  setVariantPricing,
  bulkSetVariantPricing,
  deleteVariantPricing,
  getCompleteProductController,
  searchProducts,
  getProductsPriceStats,
  getProductsByCategoryController,
  updateFullProduct,
  deleteFullProduct,
} from "./admin.products.controller.js";

import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  addVariantImagesSchema,
  updateVariantImageOrderSchema,
  setVariantPricingSchema,
  bulkVariantPricingSchema,
} from "./admin.products.schema.js";

const router = express.Router();

/* ==================== PRODUCT ROUTES ==================== */

router.get("/", authenticate, authorize(ROLES.ADMIN), getProducts);

router.get("/search", authenticate, authorize(ROLES.ADMIN), searchProducts);

router.get(
  "/price-stats",
  authenticate,
  authorize(ROLES.ADMIN),
  getProductsPriceStats
);

router.get(
  "/category/:categoryId",
  authenticate,
  authorize(ROLES.ADMIN),
  getProductsByCategoryController
);

router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  getProductByIdController
);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createProductSchema),
  createProduct
);

router.post("/full", authenticate, authorize(ROLES.ADMIN), createFullProduct);

router.patch(
  "/full/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  updateFullProduct
);

router.delete(
  "/full/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteFullProduct
);

router.patch(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateProductSchema),
  updateProduct
);

router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteProduct);

/* ==================== VARIANT ROUTES ==================== */

router.get(
  "/:productId/variants",
  authenticate,
  authorize(ROLES.ADMIN),
  getVariantsByProduct
);

router.get(
  "/variants/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  getVariantByIdController
);

router.get(
  "/variants/sku/:sku",
  authenticate,
  authorize(ROLES.ADMIN),
  getVariantBySKUController
);

router.post(
  "/variants",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createVariantSchema),
  createVariant
);

router.patch(
  "/variants/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateVariantSchema),
  updateVariant
);

router.delete(
  "/variants/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteVariant
);

/* ==================== VARIANT IMAGES ==================== */

router.get(
  "/variants/:variantId/images",
  authenticate,
  authorize(ROLES.ADMIN),
  getVariantImagesController
);

router.post(
  "/variants/:variantId/images",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(addVariantImagesSchema),
  addVariantImages
);

router.patch(
  "/variant-images/:imageId",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateVariantImageOrderSchema),
  updateImageOrder
);

router.delete(
  "/variant-images/:imageId",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteVariantImage
);

/* ==================== PRICING ==================== */

router.get(
  "/pricing/user/:userId",
  authenticate,
  authorize(ROLES.ADMIN),
  getUserPricing
);

router.get(
  "/pricing/variant/:variantId",
  authenticate,
  authorize(ROLES.ADMIN),
  getVariantPricing
);

router.post(
  "/pricing",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(setVariantPricingSchema),
  setVariantPricing
);

router.post(
  "/pricing/bulk/:userId",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(bulkVariantPricingSchema),
  bulkSetVariantPricing
);

router.delete(
  "/pricing/:variantId/:userId",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteVariantPricing
);

/* ==================== COMPLETE PRODUCT ==================== */

router.get(
  "/:productId/complete",
  authenticate,
  authorize(ROLES.ADMIN),
  getCompleteProductController
);

export default router;
