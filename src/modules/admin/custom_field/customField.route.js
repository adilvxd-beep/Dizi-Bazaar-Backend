import express from "express";
import {
  createCustomFieldDefinition,
  getCustomFieldDefinitions,
  getCustomFieldDefinition,
  getCustomFieldDefinitionsByModule,
  updateCustomFieldDefinition,
  deleteCustomFieldDefinition,
} from "./customField.controller.js";

import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

/**
 * READ
 */
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  getCustomFieldDefinitions,
);

router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  getCustomFieldDefinition,
);

router.get(
  "/module/:module",
  authenticate,
  authorize(ROLES.ADMIN),
  getCustomFieldDefinitionsByModule,
);

/**
 * CREATE
 */
router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  createCustomFieldDefinition,
);

/**
 * UPDATE
 */
router.put(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  updateCustomFieldDefinition,
);

/**
 * DELETE
 */
router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteCustomFieldDefinition,
);

export default router;
