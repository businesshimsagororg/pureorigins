import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: String,
  variantWeight: String,
  price: Number,
  quantity: Number,
  subtotal: Number
}, { _id: true });

const statusLogSchema = new mongoose.Schema({
  status: String,
  note: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  guestSessionId: { type: String, index: true },
  lookupToken: { type: String, index: true },
  customerName: String,
  customerPhone: String,
  shippingAddress: String,
  district: String,
  upazila: String,
  paymentMethod: { type: String, enum: ["COD", "SSLCommerz", "bKash", "Nagad", "Rocket"], default: "COD" },
  paymentStatus: { type: String, enum: ["unpaid", "pending", "paid", "failed", "refunded"], default: "unpaid" },
  transactionRef: String,
  deliveryCharge: { type: Number, default: 0 },
  couponCode: String,
  couponDiscount: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  orderItems: [orderItemSchema],
  status: { type: String, enum: ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned", "Refunded"], default: "Pending" },
  statusHistory: [statusLogSchema],
  trackingNumber: String,
  notes: String
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
