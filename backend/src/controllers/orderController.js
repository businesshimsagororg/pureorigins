import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import InventoryMovement from "../models/InventoryMovement.js";
import User from "../models/User.js";
import { calcCouponDiscount, deliveryChargeByDistrict } from "../utils/pricing.js";
import { initiatePayment } from "../services/paymentService.js";
import { notifyOrderPlaced, notifyOrderStatus } from "../services/notificationService.js";

async function computeCartTotals(items) {
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) throw new Error("Invalid product in cart");
    const variant = product.variants.find(v => v.weight === item.variantWeight) || null;
    const unitPrice = variant ? variant.unitPrice : product.price;
    const available = variant ? variant.stockQuantity : product.stockQuantity;
    if (available < item.quantity) throw new Error(`${product.nameBn} out of stock`);
    const line = unitPrice * item.quantity;
    subtotal += line;
    orderItems.push({ product: product._id, productName: product.nameBn, variantWeight: item.variantWeight, price: unitPrice, quantity: item.quantity, subtotal: line });
  }
  return { subtotal, orderItems };
}

export async function createOrder(req, res) {
  const { customerName, customerPhone, shippingAddress, district, upazila, paymentMethod = "COD", couponCode, notes } = req.body;
  const cart = await Cart.findOne({ user: req.auth.sub });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart empty" });

  const { subtotal, orderItems } = await computeCartTotals(cart.items);
  const coupon = couponCode ? await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true }) : null;
  const couponDiscount = calcCouponDiscount(coupon, subtotal);
  const deliveryCharge = deliveryChargeByDistrict(district);
  const total = subtotal - couponDiscount + deliveryCharge;

  const order = await Order.create({
    user: req.auth.sub,
    customerName,
    customerPhone,
    shippingAddress,
    district,
    upazila,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "unpaid" : "pending",
    deliveryCharge,
    couponCode: coupon?.code,
    couponDiscount,
    subtotal,
    total,
    orderItems,
    notes,
    statusHistory: [{ status: "Pending", note: "Order placed", changedBy: req.auth.sub }]
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    const variant = product.variants.find(v => v.weight === item.variantWeight);
    if (variant) variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
    product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
    await product.save();
    await InventoryMovement.create({ product: product._id, variantWeight: item.variantWeight, change: -item.quantity, reason: "order_created", order: order._id });
  }

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  cart.items = [];
  cart.couponCode = undefined;
  await cart.save();

  const user = await User.findById(req.auth.sub).select("email");
  await notifyOrderPlaced({ customerPhone, customerEmail: user?.email, orderId: order._id.toString(), total });

  const payment = await initiatePayment(order);
  if (payment.paymentStatus && payment.paymentStatus !== order.paymentStatus) {
    order.paymentStatus = payment.paymentStatus;
    await order.save();
  }

  return res.status(201).json({ order, payment });
}

export async function myOrders(req, res) {
  const orders = await Order.find({ user: req.auth.sub }).sort({ createdAt: -1 });
  res.json({ orders });
}

export async function adminOrders(req, res) {
  const q = req.query.q || "";
  const filter = q ? { $or: [{ customerPhone: { $regex: q, $options: "i" } }, { customerName: { $regex: q, $options: "i" } }] } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json({ orders });
}

export async function updateOrderStatus(req, res) {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory.push({ status, note: note || "Status updated", changedBy: req.auth.sub });
  await order.save();

  const user = await User.findById(order.user).select("email");
  await notifyOrderStatus({ customerPhone: order.customerPhone, customerEmail: user?.email, orderId: order._id.toString(), status: order.status });

  res.json({ order });
}