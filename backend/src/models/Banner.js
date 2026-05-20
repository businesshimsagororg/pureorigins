import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  imageUrl: String,
  ctaText: String,
  ctaUrl: String,
  sortOrder: { type: Number, default: 100 },
  startsAt: Date,
  endsAt: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Banner", bannerSchema);
