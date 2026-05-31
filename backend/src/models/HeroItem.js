import mongoose from "mongoose";

const heroItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sub: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: String, required: true },
  oldPrice: { type: String },
  save: { type: String },
  unit: { type: String },
  badge: { type: String },
  color: { type: String, default: "#1B4332" },
  accent: { type: String, default: "#C4972F" },
  img: { type: String, default: "🌿" },
  glow: { type: String, default: "rgba(27,67,50,0.35)" },
  isSunnah: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("HeroItem", heroItemSchema);
