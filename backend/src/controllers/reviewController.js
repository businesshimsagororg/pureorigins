import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createReview(req, res) {
  const { productId, rating, text, photoUrl } = req.body;
  const hasPurchased = await Order.findOne({ user: req.auth.sub, "orderItems.product": productId, status: "Delivered" });
  if (!hasPurchased) return res.status(403).json({ message: "Only verified buyers can review" });
  const review = await Review.create({ user: req.auth.sub, product: productId, rating, text, photoUrl });
  res.status(201).json({ review });
}

export async function listProductReviews(req, res) {
  const reviews = await Review.find({ product: req.params.id, status: "approved" }).sort({ createdAt: -1 });
  res.json({ reviews });
}

export async function adminListReviews(req, res) {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const reviews = await Review.find(filter)
    .populate("product", "nameBn nameEn slug")
    .populate("user", "name phone email")
    .sort({ createdAt: -1 });
  res.json({ reviews });
}

export async function adminReviewAction(req, res) {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found" });
  const stats = await Review.aggregate([
    { $match: { product: review.product, status: "approved" } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const s = stats[0] || { avg: 0, count: 0 };
  await Product.findByIdAndUpdate(review.product, { ratingAvg: s.avg, reviewsCount: s.count });
  res.json({ review });
}
