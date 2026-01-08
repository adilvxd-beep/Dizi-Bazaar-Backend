import express from "express";
import { getUsers, createUser, login } from "./admin.user.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";
import { createUserSchema, loginSchema } from "./admin.user.schema.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.get("/", authenticate, authorize(ROLES.ADMIN), getUsers);
router.post("/", validate(createUserSchema), createUser);

export default router;
