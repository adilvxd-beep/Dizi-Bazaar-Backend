import {createWholesalerController, updateWholesalerDocumentsController} from './admin.wholesaler.controller.js';
import express from 'express';
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import {createWholesalerSchema, updateWholesalerDocumentsSchema} from './admin.wholesaler.schema.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  (req, res, next) => {
    console.log("✅ ROUTE HIT: POST /api/admin/wholesalers");
    next();
  },
  validate(createWholesalerSchema),
  createWholesalerController
);
router.patch('/:wholesalerId/documents',authenticate,authorize(ROLES.ADMIN),validate(updateWholesalerDocumentsSchema),updateWholesalerDocumentsController);

export default router;  

