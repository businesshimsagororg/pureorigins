import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true },
  barcode: String
}, { _id: true });

const productSchema = new mongoose.Schema({
  nameBn: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  benefits: [String],
  ingredients: [String],
  usageInstructions: [String],
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  discountPercent: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  tags: [String],
  images: [String],
  badge: String,
  stockQuantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  ratingAvg: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  variants: [variantSchema]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);