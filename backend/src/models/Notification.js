import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["email", "sms", "system"], required: true },
  recipient: String,
  subject: String,
  message: String,
  status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);