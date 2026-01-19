import express from "express";

import {
  createWholesalerController,
  getWholesalerByIdController,
  findAllWholesalersController,
  createWholesalerDocumentsController,
  updateWholesalerStatusOnlyController,
  updateWholesalerDocumentsStatusController,
  verifyWholesalerController,
  deleteWholesalerByIdController,
} from "./admin.wholesaler.controller.js";

import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";

import {
  createWholesalerSchema,
  createWholesalerDocumentsSchema,
  updateWholesalerStatusSchema,
  updateWholesalerDocumentsStatusSchema,
  verifyWholesalerSchema
} from "./admin.wholesaler.schema.js";

const router = express.Router();

/* ================= STAGE 1 — CREATE BASIC ================= */
router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createWholesalerSchema),
  createWholesalerController
);

/* ================= GET WHOLESALER BY ID ================= */
router.get(
  "/:wholesalerId",
  authenticate,
  authorize(ROLES.ADMIN),
  getWholesalerByIdController
);    

/* ================= GET ALL WHOLESALERS ================= */
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  findAllWholesalersController
);  


/* ================= STAGE 2 — UPLOAD DOCUMENTS ================= */
router.post(
  "/:wholesalerId/documents",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createWholesalerDocumentsSchema),
  createWholesalerDocumentsController
);

/* ================= STAGE 4 — MANUAL WHOLESALER STATUS ONLY ================= */
router.patch(
  "/:wholesalerId/status",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateWholesalerStatusSchema),
  updateWholesalerStatusOnlyController
);

/* ================= STAGE 5 — MANUAL DOCUMENT STATUS ONLY ================= */
router.patch(
  "/:wholesalerId/documents/status",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateWholesalerDocumentsStatusSchema),
  updateWholesalerDocumentsStatusController
);

/* ================= STAGE 3 — FINAL VERIFY ================= */
router.patch(
  "/:wholesalerId/verify",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(verifyWholesalerSchema),
  verifyWholesalerController
);

router.delete(
  "/:wholesalerId",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteWholesalerByIdController    
)

export default router;
