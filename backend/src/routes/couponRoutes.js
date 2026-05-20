import { Router } from "express";
import { adminCreateCoupon, adminDeleteCoupon, adminListCoupons, adminUpdateCoupon, validateCoupon } from "../controllers/couponController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();
r.post("/validate", validateCoupon);
r.get("/admin/coupons", authRequired, adminRequired, adminListCoupons);
r.post("/admin/coupons", authRequired, adminRequired, adminCreateCoupon);
r.put("/admin/coupons/:id", authRequired, adminRequired, adminUpdateCoupon);
r.delete("/admin/coupons/:id", authRequired, adminRequired, adminDeleteCoupon);

export default r;