import Order from "../models/Order.js";

export async function initiatePayment(order) {
  if (order.paymentMethod === "COD") return { redirectUrl: null, paymentStatus: "unpaid" };

  if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
    return { redirectUrl: null, paymentStatus: "pending", note: "Gateway credentials missing" };
  }

  const baseUrl = process.env.SSLCOMMERZ_LIVE === "true"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

  const successUrl = `${process.env.BACKEND_PUBLIC_URL || "http://localhost:5000"}/api/payments/sslcommerz/callback?result=success&orderId=${order._id}`;
  const failUrl = `${process.env.BACKEND_PUBLIC_URL || "http://localhost:5000"}/api/payments/sslcommerz/callback?result=failed&orderId=${order._id}`;

  return {
    redirectUrl: `${baseUrl}/gwprocess/v4/api.php?store_id=${process.env.SSLCOMMERZ_STORE_ID}&tran_id=${order._id}&success_url=${encodeURIComponent(successUrl)}&fail_url=${encodeURIComponent(failUrl)}`,
    paymentStatus: "pending"
  };
}

export async function handlePaymentCallback({ orderId, result, val_id }) {
  const order = await Order.findById(orderId);
  if (!order) return { ok: false, message: "Order not found" };

  if (result === "success") {
    order.paymentStatus = "paid";
    order.transactionRef = val_id || `ssl-${Date.now()}`;
    if (order.status === "Pending") {
      order.status = "Confirmed";
      order.statusHistory.push({ status: "Confirmed", note: "Payment callback success" });
    }
  } else {
    order.paymentStatus = "failed";
    order.statusHistory.push({ status: order.status, note: "Payment callback failed" });
  }

  await order.save();
  return { ok: true, order };
}