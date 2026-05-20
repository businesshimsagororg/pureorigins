import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nameBn: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);