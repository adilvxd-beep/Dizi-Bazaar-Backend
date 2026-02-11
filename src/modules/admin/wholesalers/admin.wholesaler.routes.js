import express from "express";

import {
  createWholesalerController,
  getWholesalerByIdController,
  findAllWholesalersController,
  createWholesalerDocumentsController,
  getWholesalerDocumentsByWholesalerIdController,
  updateWholesalerStatusOnlyController,
  updateWholesalerDocumentsStatusController,
  verifyWholesalerController,
  deleteWholesalerByIdController,
  editWholesalerBasicAndDocumentsController,
  createWholesalerBankDetailsController,
  getWholesalerBankDetailsByUserIdController,
  getAllUsersBankDetailsController,
  updateUserBankDetailsController,
  deleteWholesalerBankDetailsController,
  updateWholesalerBasicController,
  updateWholesalerDocumentsController,
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
  verifyWholesalerSchema,
  editWholesalerBasicAndDocumentsSchema,
  createWholesalerBankDetailsSchema,
  editWholesalerBankDetailsSchema,
} from "./admin.wholesaler.schema.js";

const router = express.Router();

/* ================= STAGE 1 — CREATE BASIC ================= */
router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createWholesalerSchema),
  createWholesalerController,
);

/* ================= UPDATE BASIC ================= */
router.patch(
  "/:wholesalerId/basic",
  authenticate,
  authorize(ROLES.ADMIN),
  updateWholesalerBasicController,
);

router.get(
  "/bank-details",
  authenticate,
  authorize(ROLES.ADMIN),
  getAllUsersBankDetailsController,
);

/* ================= GET WHOLESALER BY ID ================= */
router.get(
  "/:wholesalerId",
  authenticate,
  authorize(ROLES.ADMIN),
  getWholesalerByIdController,
);

/* ================= GET ALL WHOLESALERS ================= */
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  findAllWholesalersController,
);

/* ================= STAGE 2 — UPLOAD DOCUMENTS ================= */
router.post(
  "/:wholesalerId/documents",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createWholesalerDocumentsSchema),
  createWholesalerDocumentsController,
);

/* ================= UPDATE DOCUMENTS (URL UPDATE) ================= */
router.patch(
  "/:wholesalerId/documents",
  authenticate,
  authorize(ROLES.ADMIN),
  updateWholesalerDocumentsController,
);

router.get(
  "/:wholesalerId/documents",
  authenticate,
  authorize(ROLES.ADMIN),
  getWholesalerDocumentsByWholesalerIdController,
);

/* ================= STAGE 4 — MANUAL WHOLESALER STATUS ONLY ================= */
router.patch(
  "/:wholesalerId/status",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateWholesalerStatusSchema),
  updateWholesalerStatusOnlyController,
);

/* ================= STAGE 5 — MANUAL DOCUMENT STATUS ONLY ================= */
router.patch(
  "/:wholesalerId/documents/status",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateWholesalerDocumentsStatusSchema),
  updateWholesalerDocumentsStatusController,
);

/* ================= STAGE 3 — FINAL VERIFY ================= */
router.patch(
  "/:wholesalerId/verify",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(verifyWholesalerSchema),
  verifyWholesalerController,
);

router.delete(
  "/:wholesalerId",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteWholesalerByIdController,
);

router.patch(
  "/:wholesalerId/edit-profile",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(editWholesalerBasicAndDocumentsSchema),
  editWholesalerBasicAndDocumentsController,
);

router.post(
  "/:userId/bank-details",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createWholesalerBankDetailsSchema),
  createWholesalerBankDetailsController,
);

router.get(
  "/:userId/bank-details",
  authenticate,
  authorize(ROLES.ADMIN),
  getWholesalerBankDetailsByUserIdController,
);

router.delete(
  "/:userId/bank-details",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteWholesalerBankDetailsController,
);

router.patch(
  "/:userId/bank-details",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(editWholesalerBankDetailsSchema),
  updateUserBankDetailsController,
);

export default router;
