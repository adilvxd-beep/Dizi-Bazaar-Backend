import express from "express";
import orderRoutes from "./order/retailer.order.routes.js";
import productVariantRoutes from "./product/productVariant.routes.js"
import retailerCategoriesRoutes from "./categories/retailerCategory.routes.js"
import profileRoutes from "./profile/retailer.profile.routes.js";

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/orders", orderRoutes);
router.use("/product-variants", productVariantRoutes)
router.use("/product", productVariantRoutes)
router.use("/categories", retailerCategoriesRoutes);



export default router;
