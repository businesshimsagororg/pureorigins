import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  subject: { type: String, trim: true, required: true },
  message: { type: String, trim: true, required: true },
  status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  source: { type: String, default: "website" },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

export default mongoose.model("ContactMessage", contactMessageSchema);
