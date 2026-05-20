import { Router } from "express";
import { adminOrders, createOrder, myOrders, updateOrderStatus } from "../controllers/orderController.js";
import { adminRequired, authRequired, optionalAuth } from "../middleware/auth.js";

const r = Router();
r.post("/", optionalAuth, createOrder);
r.get("/me", authRequired, myOrders);
r.get("/admin/orders", authRequired, adminRequired, adminOrders);
r.put("/admin/orders/:id/status", authRequired, adminRequired, updateOrderStatus);

export default r;
