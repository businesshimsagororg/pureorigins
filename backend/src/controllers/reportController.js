import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

export async function salesReport(req, res) {
  const orders = await Order.find({ status: { $nin: ["Cancelled", "Returned", "Refunded"] } });
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  res.json({ totalOrders: orders.length, totalRevenue, orders });
}

export async function stockReport(req, res) {
  const products = await Product.find().select("nameBn stockQuantity lowStockThreshold variants");
  const lowStock = products.filter(p => p.stockQuantity <= p.lowStockThreshold);
  res.json({ totalProducts: products.length, lowStock });
}

export async function customerReport(req, res) {
  const customers = await User.countDocuments({ role: "customer" });
  const activeCarts = await Cart.countDocuments({ "items.0": { $exists: true } });
  res.json({ customers, activeCarts });
}