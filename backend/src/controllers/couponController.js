import Coupon from "../models/Coupon.js";
import { calcCouponDiscount } from "../utils/pricing.js";

export async function validateCoupon(req, res) {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon || coupon.expiryDate < new Date()) return res.status(400).json({ valid: false, message: "Invalid coupon" });
  const discount = calcCouponDiscount(coupon, Number(subtotal || 0));
  res.json({ valid: true, coupon, discount });
}

export async function adminCreateCoupon(req, res) { const coupon = await Coupon.create(req.body); res.status(201).json({ coupon }); }
export async function adminListCoupons(req, res) { const coupons = await Coupon.find().sort({ createdAt: -1 }); res.json({ coupons }); }
export async function adminUpdateCoupon(req, res) { const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ coupon }); }
export async function adminDeleteCoupon(req, res) { await Coupon.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); }