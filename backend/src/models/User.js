import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  name: String,
  phone: String,
  district: String,
  upazila: String,
  addressLine: String,
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);