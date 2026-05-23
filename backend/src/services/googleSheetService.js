import { env } from "../config/env.js";

function orderPayload(order) {
  const items = (order.orderItems || []).map(item => ({
    productName: item.productName,
    variantWeight: item.variantWeight,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal
  }));

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
    items,
    itemsText: items.map(item => `${item.productName || "Product"} ${item.variantWeight || ""} x ${item.quantity || 1}`).join(", ")
  };
}

async function recordExportResult(order, result) {
  if (!order) return;

  order.integrations ||= {};
  order.integrations.googleSheets ||= {};
  order.integrations.googleSheets.status = result.status;
  order.integrations.googleSheets.attempts = (order.integrations.googleSheets.attempts || 0) + 1;
  order.integrations.googleSheets.attemptedAt = new Date();
  order.integrations.googleSheets.lastStatusCode = result.statusCode;
  order.integrations.googleSheets.lastError = result.error || result.message || "";
  order.integrations.googleSheets.responseBody = result.responseBody || "";
  if (result.ok) order.integrations.googleSheets.exportedAt = new Date();

  order.markModified?.("integrations");
  await order.save();
}

export async function exportOrderToGoogleSheet(order) {
  if (!env.googleSheetWebhookUrl) {
    const result = {
      ok: false,
      skipped: true,
      status: "not_configured",
      message: "GOOGLE_SHEET_WEBHOOK_URL is not configured in Render."
    };
    await recordExportResult(order, result);
    return result;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(env.googleSheetWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload(order)),
      signal: controller.signal
    });
    const responseBody = await response.text().catch(() => "");

    if (!response.ok) {
      const result = {
        ok: false,
        status: "failed",
        statusCode: response.status,
        responseBody: responseBody.slice(0, 500),
        message: `Google Sheets webhook returned HTTP ${response.status}.`
      };
      await recordExportResult(order, result);
      return result;
    }

    const result = {
      ok: true,
      status: "success",
      statusCode: response.status,
      responseBody: responseBody.slice(0, 500),
      message: "Order exported to Google Sheets."
    };
    await recordExportResult(order, result);
    return result;
  } catch (error) {
    const result = {
      ok: false,
      status: "failed",
      error: error.name === "AbortError" ? "Google Sheets webhook timed out after 6 seconds." : error.message,
      message: "Google Sheets order export failed."
    };
    console.warn("Google Sheets order export failed", result.error);
    await recordExportResult(order, result);
    return result;
  } finally {
    clearTimeout(timeout);
  }
}
