import express from "express";
import * as controller from "./operations.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/shifts", controller.getShifts);
router.post("/shifts", controller.createShift);
router.patch("/shifts/:id", controller.updateShift);
router.delete("/shifts/:id", controller.deleteShift);

router.get("/ranges", controller.getRanges);
router.post("/ranges", controller.createRange);
router.patch("/ranges/:id", controller.updateRange);
router.delete("/ranges/:id", controller.deleteRange);

export default router;
