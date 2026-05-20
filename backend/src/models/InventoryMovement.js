import mongoose from "mongoose";

const inventoryMovementSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantWeight: String,
  change: Number,
  reason: String,
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
}, { timestamps: true });

export default mongoose.model("InventoryMovement", inventoryMovementSchema);