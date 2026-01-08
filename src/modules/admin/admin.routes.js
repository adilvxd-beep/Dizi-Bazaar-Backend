import express from "express";
import orderRoutes from "./order/admin.order.routes.js";
import userRoutes from "./user/admin.user.routes.js";

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

export default router;
