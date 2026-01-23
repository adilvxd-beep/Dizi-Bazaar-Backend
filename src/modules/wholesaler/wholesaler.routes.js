import express from "express";
import orderRoutes from "./order/wholesaler.order.routes.js";
import inventoryRoutes from "./inventory/wholesaler.inventory.routes.js";
import wholesaler from "./userWholesaler/wholesalerUserWholesaler.routes.js";


const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/", wholesaler);

export default router;
