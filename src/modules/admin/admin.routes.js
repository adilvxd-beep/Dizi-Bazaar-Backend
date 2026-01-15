import express from "express";
import businessCategoryRoutes from "./business_category/admin.business_categories.routes.js";
import categoryRoutes from "./categories/admin.categories.routes.js";
import orderRoutes from "./order/admin.order.routes.js";
import userRoutes from "./user/admin.user.routes.js";
import wholesaler from "./wholesalers/admin.wholesaler.routes.js";

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/business-categories", businessCategoryRoutes);
router.use("/categories", categoryRoutes);
router.use("/wholesalers", wholesaler);

export default router;
