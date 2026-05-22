import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import InventoryMovement from "../models/InventoryMovement.js";
import User from "../models/User.js";
import AbandonedCart from "../models/AbandonedCart.js";
import { calcCouponDiscount, deliveryChargeByDistrict } from "../utils/pricing.js";
import { initiatePayment } from "../services/paymentService.js";
import { notifyOrderPlaced, notifyOrderStatus } from "../services/notificationService.js";

async function computeCartTotals(items) {
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const productId = item.product || item.productId;
    const quantity = Number(item.quantity || item.qty || 1);
    const product = await Product.findById(productId);
    if (!product || !product.isActive) throw new Error("Invalid product in cart");
    const variant = product.variants.find(v => v.weight === item.variantWeight) || null;
    const unitPrice = variant ? variant.unitPrice : product.price;
    const available = variant ? variant.stockQuantity : product.stockQuantity;
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Invalid item quantity");
    if (available < quantity) throw new Error(`${product.nameBn} out of stock`);
    const line = unitPrice * quantity;
    subtotal += line;
    orderItems.push({ product: product._id, productName: product.nameBn, variantWeight: item.variantWeight, price: unitPrice, quantity, subtotal: line });
  }
  return { subtotal, orderItems };
}

function normalizePaymentMethod(method = "COD") {
  const value = String(method).trim().toLowerCase();
  if (value === "bkash") return "bKash";
  if (value === "nagad") return "Nagad";
  if (value === "rocket") return "Rocket";
  if (value === "sslcommerz" || value === "ssl") return "SSLCommerz";
  return "COD";
}

export async function createOrder(req, res) {
  const {
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    district,
    upazila,
    paymentMethod = "COD",
    transactionRef,
    couponCode,
    notes,
    abandonedCartSessionId,
    items = []
  } = req.body;

  const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
  const bodyItems = Array.isArray(items)
    ? items.map(item => ({
        product: item.product || item.productId,
        variantWeight: item.variantWeight,
        quantity: item.quantity || item.qty
      }))
    : [];

  const cart = req.auth?.sub ? await Cart.findOne({ user: req.auth.sub }) : null;
  const sourceItems = bodyItems.length > 0 ? bodyItems : cart?.items || [];
  if (!sourceItems.length) return res.status(400).json({ message: "Cart empty" });

  const { subtotal, orderItems } = await computeCartTotals(sourceItems);
  const coupon = couponCode ? await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true }) : null;
  const couponDiscount = calcCouponDiscount(coupon, subtotal);
  const deliveryCharge = deliveryChargeByDistrict(district);
  const total = subtotal - couponDiscount + deliveryCharge;

  const order = await Order.create({
    user: req.auth?.sub,
    customerName,
    customerPhone,
    shippingAddress,
    district,
    upazila,
    paymentMethod: normalizedPaymentMethod,
    paymentStatus: normalizedPaymentMethod === "COD" ? "unpaid" : "pending",
    transactionRef,
    deliveryCharge,
    couponCode: coupon?.code,
    couponDiscount,
    subtotal,
    total,
    orderItems,
    notes,
    statusHistory: [{ status: "Pending", note: "Order placed", ...(req.auth?.sub ? { changedBy: req.auth.sub } : {}) }]
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

  if (cart) {
    cart.items = [];
    cart.couponCode = undefined;
    await cart.save();
  }

  const recoveredFilters = [];
  if (req.auth?.sub) recoveredFilters.push({ user: req.auth.sub });
  if (customerPhone) recoveredFilters.push({ phone: customerPhone });
  if (abandonedCartSessionId) recoveredFilters.push({ sessionId: abandonedCartSessionId });
  if (recoveredFilters.length) {
    await AbandonedCart.updateMany(
      { recovered: false, $or: recoveredFilters },
      { $set: { recovered: true, reminderSentAt: new Date(), lastActiveAt: new Date() } }
    );
  }

  const user = req.auth?.sub ? await User.findById(req.auth.sub).select("email") : null;
  await notifyOrderPlaced({ customerPhone, customerEmail: user?.email || customerEmail, orderId: order._id.toString(), total });

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
