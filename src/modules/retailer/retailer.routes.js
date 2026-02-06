import express from "express";
import orderRoutes from "./order/retailer.order.routes.js";
import productVariantRoutes from "./product/productVariant.routes.js"
import retailerCategoriesRoutes from "./categories/retailerCategory.routes.js"

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/product-variants", productVariantRoutes)
router.use("/product", productVariantRoutes)
router.use("/categories", retailerCategoriesRoutes);



export default router;
