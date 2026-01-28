import express from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";
import { fetchAllProducts } from "./controller.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.WHOLESALER), fetchAllProducts);

export default router;
