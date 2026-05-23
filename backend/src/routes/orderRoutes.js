import { Router } from "express";
import { adminOrders, createOrder, exportOrderToSheet, getOrder, lookupOrder, myOrders, updateOrderStatus } from "../controllers/orderController.js";
import { adminRequired, authRequired, optionalAuth } from "../middleware/auth.js";

const r = Router();
r.post("/", optionalAuth, createOrder);
r.post("/lookup", lookupOrder);
r.get("/me", authRequired, myOrders);
r.get("/admin/orders", authRequired, adminRequired, adminOrders);
r.post("/admin/orders/:id/export-sheet", authRequired, adminRequired, exportOrderToSheet);
r.put("/admin/orders/:id/status", authRequired, adminRequired, updateOrderStatus);
r.get("/:id", optionalAuth, getOrder);

export default r;
