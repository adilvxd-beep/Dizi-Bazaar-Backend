import express from "express";
import orderRoutes from "./order/wholesaler.order.routes.js";
import inventoryRoutes from "./inventory/wholesaler.inventory.routes.js";

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
