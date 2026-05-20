import { Router } from "express";
import { createProduct, deleteProduct, getProductBySlug, listProducts, updateProduct } from "../controllers/productController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/", listProducts);
r.get("/:slug", getProductBySlug);
r.post("/admin/products", authRequired, adminRequired, createProduct);
r.put("/admin/products/:id", authRequired, adminRequired, updateProduct);
r.delete("/admin/products/:id", authRequired, adminRequired, deleteProduct);

export default r;