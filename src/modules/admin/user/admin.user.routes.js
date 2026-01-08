import express from "express";
import { getUsers, createUser } from "./admin.user.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.ADMIN), getUsers);
router.post("/", authenticate, authorize(ROLES.ADMIN), createUser);

export default router;
