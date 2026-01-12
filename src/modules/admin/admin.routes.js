import express from "express";
import businessCategoryRoutes from "./business_category/admin.business_categories.routes.js";
import orderRoutes from "./order/admin.order.routes.js";
import userRoutes from "./user/admin.user.routes.js";

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/business-categories", businessCategoryRoutes);

export default router;
