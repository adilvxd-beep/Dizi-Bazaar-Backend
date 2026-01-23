import express from "express";
import { createWholesalerController, createWholesalerDocumentsController, updateWholesalerController } from "./wholesalerUserWholesaler.controller.js";
import { createWholesalerSchema, updateWholesalerSchema } from "./wholesalerUserWholesaler.schema.js";
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


router.patch(
  "/",
  authenticate,
  validate(updateWholesalerSchema),
  updateWholesalerController
);
  
; 

export default router;
