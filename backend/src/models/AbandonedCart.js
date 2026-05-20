import mongoose from "mongoose";

const abandonedCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  phone: String,
  email: String,
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: Number }],
  lastActiveAt: Date,
  reminderSentAt: Date,
  recovered: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("AbandonedCart", abandonedCartSchema);