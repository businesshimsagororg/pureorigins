import { Router } from "express";
import { adminListProducts, createProduct, deleteProduct, getProductBySlug, listProducts, updateProduct } from "../controllers/productController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/", listProducts);
r.get("/admin/products", authRequired, adminRequired, adminListProducts);
r.get("/:slug", getProductBySlug);
r.post("/admin/products", authRequired, adminRequired, createProduct);
r.put("/admin/products/:id", authRequired, adminRequired, updateProduct);
r.delete("/admin/products/:id", authRequired, adminRequired, deleteProduct);

export default r;
