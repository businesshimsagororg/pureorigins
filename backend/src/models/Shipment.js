import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  provider: { type: String, enum: ["Pathao", "Steadfast", "RedX", "Manual"], default: "Manual" },
  trackingNumber: String,
  trackingUrl: String,
  status: { type: String, default: "created" }
}, { timestamps: true });

export default mongoose.model("Shipment", shipmentSchema);