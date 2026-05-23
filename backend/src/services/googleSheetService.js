import { env } from "../config/env.js";

function orderPayload(order) {
  return {
    orderId: order._id.toString(),
    createdAt: order.createdAt,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail || "",
    shippingAddress: order.shippingAddress,
    district: order.district,
    upazila: order.upazila,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.status,
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    couponCode: order.couponCode || "",
    couponDiscount: order.couponDiscount,
    total: order.total,
    notes: order.notes || "",
    items: (order.orderItems || []).map(item => ({
      productName: item.productName,
      variantWeight: item.variantWeight,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }))
  };
}

export async function exportOrderToGoogleSheet(order) {
  if (!env.googleSheetWebhookUrl) return { ok: false, skipped: true };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(env.googleSheetWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload(order)),
      signal: controller.signal
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    return { ok: true };
  } catch (error) {
    console.warn("Google Sheets order export failed", error.message);
    return { ok: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}
