import { Router } from "express";
import { addCartItem, deleteCartItem, getCart, trackAbandonedCart, updateCartItem } from "../controllers/cartController.js";
import { authRequired, optionalAuth } from "../middleware/auth.js";

const r = Router();
r.get("/", authRequired, getCart);
r.post("/abandoned", optionalAuth, trackAbandonedCart);
r.post("/items", authRequired, addCartItem);
r.put("/items/:id", authRequired, updateCartItem);
r.delete("/items/:id", authRequired, deleteCartItem);

export default r;
