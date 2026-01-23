import express from "express";
import { createWholesalerController, createWholesalerDocumentsController } from "./wholesalerUserWholesaler.controller.js";
import { createWholesalerSchema } from "./wholesalerUserWholesaler.schema.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";

const router = express.Router();

router.post("/",
  authenticate,
  validate(createWholesalerSchema),
    createWholesalerController

);

router.post(
  "/:wholesalerId/documents",
  authenticate,
  createWholesalerDocumentsController
);


export default router;
