import Order from "../models/Order.js";

export async function initiatePayment(order) {
  if (order.paymentMethod === "COD") return { redirectUrl: null, paymentStatus: "unpaid" };
  if (["bKash", "Nagad", "Rocket"].includes(order.paymentMethod)) {
    return { redirectUrl: null, paymentStatus: "pending", transactionRef: order.transactionRef || null };
  }

  if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
    return { redirectUrl: null, paymentStatus: "pending", note: "Gateway credentials missing" };
  }

  const baseUrl = process.env.SSLCOMMERZ_LIVE === "true"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

  const backendUrl = process.env.BACKEND_PUBLIC_URL || "http://localhost:5000";
  const callbackUrl = `${backendUrl}/api/payments/sslcommerz/callback`;
  const tranId = order._id.toString();
  const payload = new URLSearchParams({
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: String(order.total),
    currency: "BDT",
    tran_id: tranId,
    success_url: callbackUrl,
    fail_url: callbackUrl,
    cancel_url: callbackUrl,
    ipn_url: `${backendUrl}/api/payments/sslcommerz/ipn`,
    cus_name: order.customerName,
    cus_email: order.customerEmail || "customer@pureorigins.bd",
    cus_add1: order.shippingAddress,
    cus_city: order.district || "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: order.customerPhone,
    shipping_method: "Courier",
    product_name: order.orderItems.map(item => item.productName).join(", ").slice(0, 255),
    product_category: "Wellness",
    product_profile: "physical-goods",
    value_a: tranId
  });

  const response = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.GatewayPageURL) {
    return {
      redirectUrl: null,
      paymentStatus: "pending",
      transactionRef: tranId,
      note: data.failedreason || "SSLCommerz session could not be created"
    };
  }

  return { redirectUrl: data.GatewayPageURL, paymentStatus: "pending", transactionRef: tranId };
}

export async function handlePaymentCallback(payload = {}) {
  const orderId = payload.orderId || payload.value_a || payload.tran_id;
  const result = String(payload.result || "").toLowerCase();
  const status = String(payload.status || "").toUpperCase();
  const valId = payload.val_id || payload.bank_tran_id || payload.tran_id;
  const order = await Order.findById(orderId);
  if (!order) return { ok: false, message: "Order not found" };

  if (result === "success" || status === "VALID" || status === "VALIDATED") {
    order.paymentStatus = "paid";
    order.transactionRef = valId || `ssl-${Date.now()}`;
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
