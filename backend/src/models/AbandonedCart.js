import mongoose from "mongoose";

const abandonedCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String, index: true },
  phone: String,
  email: String,
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantWeight: String,
    quantity: Number
  }],
  lastActiveAt: Date,
  reminderSentAt: Date,
  recovered: { type: Boolean, default: false }
}, { timestamps: true });

abandonedCartSchema.index({ user: 1, recovered: 1 });
abandonedCartSchema.index({ phone: 1, recovered: 1 });
abandonedCartSchema.index({ lastActiveAt: 1, reminderSentAt: 1, recovered: 1 });

export default mongoose.model("AbandonedCart", abandonedCartSchema);
