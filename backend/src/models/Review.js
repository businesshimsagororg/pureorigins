import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },
  photoUrl: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);