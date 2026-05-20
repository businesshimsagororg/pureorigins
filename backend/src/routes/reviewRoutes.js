import { Router } from "express";
import { adminReviewAction, createReview, listProductReviews } from "../controllers/reviewController.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const r = Router();
r.post("/", authRequired, createReview);
r.get("/products/:id/reviews", listProductReviews);
r.put("/admin/reviews/:id", authRequired, adminRequired, adminReviewAction);

export default r;