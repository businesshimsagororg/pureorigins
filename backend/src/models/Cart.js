import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantWeight: String,
  quantity: { type: Number, min: 1, default: 1 }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
  couponCode: String,
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);