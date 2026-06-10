import express from "express";
import { getProfile, updateProfile } from "./retailer.profile.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.RETAILER));

router.get("/", getProfile);
router.patch("/", updateProfile);

export default router;
