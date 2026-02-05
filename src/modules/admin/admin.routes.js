import express from "express";
import businessCategoryRoutes from "./business_category/admin.business_categories.routes.js";
import categoryRoutes from "./categories/admin.categories.routes.js";
import orderRoutes from "./order/admin.order.routes.js";
import userRoutes from "./user/admin.user.routes.js";
import wholesaler from "./wholesalers/admin.wholesaler.routes.js";
import productsRoute from "./products/admin.products.routes.js";
import jobPostsRoutes from "./job_posts/routes.js";
import customField from "./custom_field/customField.route.js";

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/job-posts", jobPostsRoutes);
router.use("/business-categories", businessCategoryRoutes);
router.use("/categories", categoryRoutes);
router.use("/wholesalers", wholesaler);
router.use("/products", productsRoute);
router.use("/custom-fields", customField);

export default router;
