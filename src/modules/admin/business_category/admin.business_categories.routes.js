import express from "express";  
import { getBusinessCategories, createBusinessCategory, updateBusinessCategory, updateBusinessCategoryStatus, deleteBusinessCategory } from "./admin.business_categories.controller.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";  
import { authorize } from "../../../shared/middlewares/role.middleware.js";  
import { ROLES } from "../../../shared/constants/roles.js";  
import { validate } from "../../../shared/middlewares/validate.middleware.js";  
import { createBusinessCategorySchema } from "./admin.business_categories.schema.js";           

const router = express.Router();

router.get("/", authenticate, authorize(ROLES.ADMIN), getBusinessCategories);  
router.post("/", authenticate, authorize(ROLES.ADMIN), validate(createBusinessCategorySchema), createBusinessCategory);
router.put("/:id", authenticate, authorize(ROLES.ADMIN), updateBusinessCategory);
router.patch("/:id/status", authenticate, authorize(ROLES.ADMIN), updateBusinessCategoryStatus);
router.delete("/:id", authenticate, authorize(ROLES.ADMIN), deleteBusinessCategory);



export default router;