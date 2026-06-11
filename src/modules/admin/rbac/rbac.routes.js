import express from "express";
import * as controller from "./rbac.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/roles", controller.getRoles);
router.post("/roles", controller.createRole);
router.patch("/roles/:id", controller.updateRole);
router.delete("/roles/:id", controller.deleteRole);

router.get("/permissions", controller.getPermissions);

export default router;
