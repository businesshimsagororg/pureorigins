import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label: String,
  name: String,
  phone: String,
  district: String,
  upazila: String,
  addressLine: String,
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);