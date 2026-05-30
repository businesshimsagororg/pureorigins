import { env } from "../config/env.js";

function orderPayload(order) {
  const items = (order.orderItems || []).map(item => ({
    productName: item.productName,
    variantWeight: item.variantWeight,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal
  }));

  const payload = {
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

  if (env.googleSheetWebhookSecret) {
    payload.secret = env.googleSheetWebhookSecret;
  }

  return payload;
}

function parseWebhookResponse(responseBody) {
  const trimmed = String(responseBody || "").trim();
  if (!trimmed) return { parsed: null, error: "Google Sheets webhook returned an empty response." };

  try {
    return { parsed: JSON.parse(trimmed), error: "" };
  } catch {
    return {
      parsed: null,
      error: "Google Sheets webhook did not return JSON. Check Apps Script deployment access is set to Anyone and the URL ends with /exec."
    };
  }
}

async function recordExportResult(order, result) {
  if (!order) return;

  order.integrations ||= {};
  order.integrations.googleSheets ||= {};
  order.integrations.googleSheets.status = result.status;
  order.integrations.googleSheets.attempts = (order.integrations.googleSheets.attempts || 0) + 1;
  order.integrations.googleSheets.attemptedAt = new Date();
  order.integrations.googleSheets.lastStatusCode = result.statusCode;
  order.integrations.googleSheets.lastError = result.ok ? "" : result.error || result.message || "";
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
    const headers = { "Content-Type": "application/json" };
    if (env.googleSheetWebhookSecret) {
      headers.Authorization = `Bearer ${env.googleSheetWebhookSecret}`;
      headers["X-Webhook-Secret"] = env.googleSheetWebhookSecret;
    }

    const webhookUrl = new URL(env.googleSheetWebhookUrl);
    if (env.googleSheetWebhookSecret) webhookUrl.searchParams.set("secret", env.googleSheetWebhookSecret);

    const response = await fetch(webhookUrl.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(orderPayload(order)),
      signal: controller.signal
    });
    const responseBody = await response.text().catch(() => "");

    const parsed = parseWebhookResponse(responseBody);

    if (!response.ok) {
      const result = {
        ok: false,
        status: "failed",
        statusCode: response.status,
        responseBody: responseBody.slice(0, 500),
        message: response.status === 401
          ? "Google Sheets webhook returned HTTP 401. Check WEBHOOK_SECRET, Authorization bearer token, X-Webhook-Secret, and Apps Script deployment access."
          : `Google Sheets webhook returned HTTP ${response.status}.`
      };
      await recordExportResult(order, result);
      return result;
    }

    if (parsed.error || parsed.parsed?.ok !== true) {
      const result = {
        ok: false,
        status: "failed",
        statusCode: response.status,
        responseBody: responseBody.slice(0, 500),
        error: parsed.error || parsed.parsed?.error || "Google Sheets webhook returned ok:false.",
        message: "Google Sheets order export failed."
      };
      await recordExportResult(order, result);
      return result;
    }

    const result = {
      ok: true,
      status: "success",
      statusCode: response.status,
      responseBody: responseBody.slice(0, 500),
      message: parsed.parsed.message || "Order exported to Google Sheets."
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
