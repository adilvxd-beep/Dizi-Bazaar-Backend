import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./admin.categories.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants/roles.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "./admin.categories.schema.js";

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.ADMIN), getCategories);

router.post("/", authenticate, authorize(ROLES.ADMIN), validate(createCategorySchema), createCategory);

router.patch("/:id", authenticate, authorize(ROLES.ADMIN), validate(updateCategorySchema), updateCategory);

router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteCategory);


export default router;  