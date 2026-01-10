import express from "express";
import cors from "cors";
import adminRoutes from "./modules/admin/admin.routes.js";
import wholesalerRoutes from "./modules/wholesaler/wholesaler.routes.js";
import retailerRoutes from "./modules/retailer/retailer.routes.js";
import deliveryRoutes from "./modules/delivery/delivery.routes.js";
import agentRoutes from "./modules/agent/agent.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./shared/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/wholesaler", wholesalerRoutes);
app.use("/api/retailer", retailerRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Dizi Bazaar Backend" });
});

app.use(errorHandler);

export default app;
