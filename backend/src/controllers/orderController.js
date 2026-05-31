import crypto from "crypto";
import bcrypt from "bcryptjs";
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
import { exportOrderToGoogleSheet } from "../services/googleSheetService.js";

const GUEST_ORDER_SESSION_GRACE_MS = 15 * 60 * 1000;

function orderPayload(order) {
  return {
    _id: order._id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    district: order.district,
    upazila: order.upazila,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    transactionRef: order.transactionRef,
    deliveryCharge: order.deliveryCharge,
    couponDiscount: order.couponDiscount,
    subtotal: order.subtotal,
    total: order.total,
    orderItems: order.orderItems,
    status: order.status,
    statusHistory: order.statusHistory,
    trackingNumber: order.trackingNumber,
    integrations: order.integrations || {},
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

function safeTokenMatch(providedToken, storedToken) {
  if (!providedToken || !storedToken) return false;
  const provided = Buffer.from(String(providedToken));
  const stored = Buffer.from(String(storedToken));
  return provided.length === stored.length && crypto.timingSafeEqual(provided, stored);
}

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

async function ensureCustomerAccount({ customerName, customerPhone, customerEmail, district, upazila, shippingAddress }) {
  const phone = String(customerPhone || "").trim();
  if (!/^01[3-9]\d{8}$/.test(phone)) return null;

  let user = await User.findOne({ phone });
  if (user && user.role !== "customer") return null;
  if (!user) {
    const emailInUse = customerEmail ? await User.exists({ email: String(customerEmail).trim().toLowerCase() }) : null;
    const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
    try {
      user = await User.create({
        name: customerName || phone,
        phone,
        email: emailInUse ? undefined : customerEmail,
        passwordHash,
        role: "customer",
        addresses: [{
          label: "Default",
          name: customerName,
          phone,
          district,
          upazila,
          addressLine: shippingAddress,
          isDefault: true
        }]
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      user = await User.findOne({ phone, role: "customer" });
    }
  } else {
    let changed = false;
    if (customerName && user.name !== customerName) {
      user.name = customerName;
      changed = true;
    }
    if (customerEmail && !user.email) {
      const emailInUse = await User.exists({ email: String(customerEmail).trim().toLowerCase(), _id: { $ne: user._id } });
      if (!emailInUse) {
        user.email = customerEmail;
        changed = true;
      }
    }
    const hasAddress = user.addresses.some(address => address.addressLine === shippingAddress && address.phone === phone);
    if (shippingAddress && !hasAddress) {
      user.addresses.push({ label: "Checkout", name: customerName, phone, district, upazila, addressLine: shippingAddress, isDefault: !user.addresses.length });
      changed = true;
    }
    if (changed) await user.save();
  }

  return user?._id || null;
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
  const deliveryCharge = deliveryChargeByDistrict(district, subtotal);
  const total = subtotal - couponDiscount + deliveryCharge;
  const lookupToken = crypto.randomBytes(24).toString("hex");
  const customerUserId = req.auth?.sub || await ensureCustomerAccount({ customerName, customerPhone, customerEmail, district, upazila, shippingAddress });

  const order = await Order.create({
    user: customerUserId,
    guestSessionId: abandonedCartSessionId,
    lookupToken,
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
  if (customerUserId) recoveredFilters.push({ user: customerUserId });
  if (customerPhone) recoveredFilters.push({ phone: customerPhone });
  if (abandonedCartSessionId) recoveredFilters.push({ sessionId: abandonedCartSessionId });
  if (recoveredFilters.length) {
    await AbandonedCart.updateMany(
      { recovered: false, $or: recoveredFilters },
      { $set: { recovered: true, reminderSentAt: new Date(), lastActiveAt: new Date() } }
    );
  }

  if (customerUserId) {
    await Order.updateMany(
      { customerPhone, $or: [{ user: { $exists: false } }, { user: null }] },
      { $set: { user: customerUserId } }
    );
  }

  const user = customerUserId ? await User.findById(customerUserId).select("email") : null;
  await notifyOrderPlaced({ customerPhone, customerEmail: user?.email || customerEmail, orderId: order._id.toString(), total });

  const payment = await initiatePayment(order);
  if (payment.paymentStatus && payment.paymentStatus !== order.paymentStatus) {
    order.paymentStatus = payment.paymentStatus;
    await order.save();
  }
  const sheetExport = await exportOrderToGoogleSheet(order);
  if (!sheetExport.ok) {
    console.warn(`Order ${order._id} was created but Google Sheets export did not complete: ${sheetExport.message || sheetExport.error || "unknown error"}`);
  }

  return res.status(201).json({
    order: orderPayload(order),
    orderAccess: { orderId: order._id.toString(), token: lookupToken },
    payment
  });
}

export async function myOrders(req, res) {
  const orders = await Order.find({ user: req.auth.sub }).sort({ createdAt: -1 });
  res.json({ orders: orders.map(orderPayload) });
}

export async function lookupOrder(req, res) {
  const phone = String(req.body.phone || "").trim();
  const rawOrderId = String(req.body.orderId || "").trim();
  const normalizedOrderId = rawOrderId.replace(/^#?PO-/i, "").replace(/[^a-f0-9]/gi, "").toLowerCase();

  if (!/^01[3-9]\d{8}$/.test(phone) || normalizedOrderId.length < 6) {
    return res.status(400).json({ message: "Valid phone and order number are required" });
  }

  let order = null;
  if (/^[a-f0-9]{24}$/i.test(normalizedOrderId)) {
    order = await Order.findOne({ _id: normalizedOrderId, customerPhone: phone });
  } else {
    const recentOrders = await Order.find({ customerPhone: phone }).sort({ createdAt: -1 }).limit(50);
    order = recentOrders.find(item => item._id.toString().slice(-8).toLowerCase() === normalizedOrderId.slice(-8));
  }

  if (!order) return res.status(404).json({ message: "Order not found for this phone number" });

  res.json({ order: orderPayload(order) });
}

export async function getOrder(req, res) {
  const { token, sessionId } = req.query;
  if (!/^[a-f0-9]{24}$/i.test(String(req.params.id))) {
    return res.status(404).json({ message: "Order not found" });
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const isOwner = req.auth?.sub && order.user?.toString() === req.auth.sub;
  const isAdmin = req.auth?.role === "admin";
  const hasToken = safeTokenMatch(token, order.lookupToken);
  const isGuestSessionFresh = order.createdAt && (Date.now() - new Date(order.createdAt).getTime()) <= GUEST_ORDER_SESSION_GRACE_MS;
  const hasRecentGuestSession = sessionId && order.guestSessionId && String(sessionId) === String(order.guestSessionId) && isGuestSessionFresh;

  if (!isOwner && !isAdmin && !hasToken && !hasRecentGuestSession) {
    return res.status(403).json({ message: "Order access denied" });
  }

  res.json({ order: orderPayload(order) });
}

export async function adminOrders(req, res) {
  const q = req.query.q || "";
  const filter = q ? { $or: [{ customerPhone: { $regex: q, $options: "i" } }, { customerName: { $regex: q, $options: "i" } }] } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json({ orders });
}

export async function exportOrderToSheet(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const result = await exportOrderToGoogleSheet(order);
  const refreshedOrder = await Order.findById(order._id);

  res.json({
    message: result.message || (result.ok ? "Order exported to Google Sheets." : "Google Sheets export failed."),
    result,
    order: refreshedOrder
  });
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

  const sheetExport = await exportOrderToGoogleSheet(order);
  if (!sheetExport.ok && !sheetExport.skipped) {
    console.warn(`Order ${order._id} status saved but Google Sheets sync failed: ${sheetExport.message || sheetExport.error || "unknown error"}`);
  }

  res.json({
    order: orderPayload(order),
    sheetExport: {
      ok: sheetExport.ok,
      skipped: Boolean(sheetExport.skipped),
      message: sheetExport.message || (sheetExport.ok ? "Order synced to Google Sheets." : "Google Sheets sync failed.")
    }
  });
}
