import express from "express";
import * as controller from "./tutorials.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";

const router = express.Router();

// Public route to get tutorials by role (e.g. for registration pages)
router.get("/role/:role", controller.getTutorialsByRole);

// Admin-only routes
router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/", controller.getTutorials);
router.post("/", controller.createTutorial);
router.patch("/:id", controller.updateTutorial);
router.delete("/:id", controller.deleteTutorial);

export default router;
