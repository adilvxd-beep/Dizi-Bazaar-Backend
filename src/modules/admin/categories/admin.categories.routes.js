import express from "express";
import { getCategories, getCategory, createCategory, updateCategory, UpdateCategoryStatus, deleteCategory } from "./admin.categories.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "./admin.categories.schema.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.ADMIN), getCategories);

router.get("/:id", authenticate, authorize(ROLES.ADMIN), getCategory);

router.post("/", authenticate, authorize(ROLES.ADMIN), validate(createCategorySchema), createCategory);

router.patch("/:id", authenticate, authorize(ROLES.ADMIN), validate(updateCategorySchema), updateCategory);

router.patch("/:id/status", authenticate, authorize(ROLES.ADMIN), UpdateCategoryStatus);

router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteCategory);


export default router;  