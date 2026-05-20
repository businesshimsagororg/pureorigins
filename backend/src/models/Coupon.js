import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ["percent", "flat"], required: true },
  value: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 0 },
  perUserUsageLimit: { type: Number, default: 1 },
  minimumOrderAmount: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);