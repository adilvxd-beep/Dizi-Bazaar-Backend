import express from "express";
import {
  findAllCategoriesForRetailerController,
} from "./retailerCategory.controller.js";

const router = express.Router();

router.get(
  "/",
  findAllCategoriesForRetailerController
);

export default router;
