import express from "express";
import { 
  createWholesalerController, 
  createWholesalerDocumentsController, 
  updateWholesalerController, 
  createWholesalerBankDetailsController, 
  getWholesalerBankDetailsController,
  updateWholesalerBankDetailsController,
  deleteWholesalerBankDetailsController,
} from "./wholesalerUserWholesaler.controller.js";
import { createWholesalerSchema, updateWholesalerSchema, updateWholesalerBankDetailsSchema } from "./wholesalerUserWholesaler.schema.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";

const router = express.Router();

router.post("/",
  authenticate,
  validate(createWholesalerSchema),
    createWholesalerController

);

router.post(
  "/documents",
  authenticate,
  createWholesalerDocumentsController
);

router.post(
  "/bank-details",
  authenticate,
  createWholesalerBankDetailsController
);  


router.patch(
  "/",
  authenticate,
  validate(updateWholesalerSchema),
  updateWholesalerController
);
  
router.get(
  "/bank-details",
  authenticate,
  getWholesalerBankDetailsController
);

router.patch(
  "/bank-details",
  authenticate,
  validate(updateWholesalerBankDetailsSchema),
  updateWholesalerBankDetailsController
);

router.delete(
  "/bank-details",
  authenticate,
  deleteWholesalerBankDetailsController
);


export default router;
