import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Order from "../src/models/Order.js";
import { env } from "../src/config/env.js";
import { exportOrderToGoogleSheet } from "../src/services/googleSheetService.js";
import { handlePaymentCallback } from "../src/services/paymentService.js";
import { calcCouponDiscount, deliveryChargeByDistrict } from "../src/utils/pricing.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function readSource(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

function testCouponTotals() {
  assert.equal(calcCouponDiscount(null, 500), 0, "missing coupon should not discount");
  assert.equal(calcCouponDiscount({ type: "percent", value: 15 }, 1000), 150, "percent coupon total");
  assert.equal(calcCouponDiscount({ type: "flat", value: 700 }, 500), 500, "flat coupon cannot exceed subtotal");
  assert.equal(calcCouponDiscount({ type: "percent", value: 10, minimumOrderAmount: 1000 }, 900), 0, "minimum order should block coupon");
  assert.equal(deliveryChargeByDistrict("Dhaka", 500), 80, "Dhaka and outside Dhaka should use one delivery charge");
  assert.equal(deliveryChargeByDistrict("Chittagong", 500), 80, "outside Dhaka should use the same delivery charge");
  assert.equal(deliveryChargeByDistrict("Any District", 800), 0, "large orders should keep the free delivery rule");
}

async function testPaymentCallbackBehavior() {
  const originalFindById = Order.findById;

  const paidOrder = {
    paymentStatus: "pending",
    transactionRef: "",
    status: "Pending",
    statusHistory: [],
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    }
  };

  Order.findById = async () => paidOrder;
  const paidResult = await handlePaymentCallback({ tran_id: "507f1f77bcf86cd799439011", status: "VALID", val_id: "bank-123" });
  assert.equal(paidResult.ok, true, "successful callback returns ok");
  assert.equal(paidOrder.paymentStatus, "paid", "successful callback marks paid");
  assert.equal(paidOrder.status, "Confirmed", "successful callback confirms pending order");
  assert.equal(paidOrder.transactionRef, "bank-123", "successful callback stores transaction reference");
  assert.equal(paidOrder.saveCalled, true, "successful callback saves order");

  const failedOrder = {
    paymentStatus: "pending",
    transactionRef: "",
    status: "Pending",
    statusHistory: [],
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    }
  };

  Order.findById = async () => failedOrder;
  const failedResult = await handlePaymentCallback({ tran_id: "507f1f77bcf86cd799439011", status: "FAILED" });
  assert.equal(failedResult.ok, true, "failed callback still resolves known order");
  assert.equal(failedOrder.paymentStatus, "failed", "failed callback marks failed");
  assert.equal(failedOrder.statusHistory.at(-1)?.note, "Payment callback failed", "failed callback records history");
  assert.equal(failedOrder.saveCalled, true, "failed callback saves order");

  Order.findById = originalFindById;
}

async function testOrderControllerContracts() {
  const source = await readSource("src/controllers/orderController.js");

  assert.match(source, /Order\.create\(/, "order creation must persist to database");
  assert.match(source, /orderAccess:\s*\{\s*orderId:[\s\S]*token:/, "order response must include lookup token");
  assert.match(source, /InventoryMovement\.create\(/, "stock decrement should create inventory movement");
  assert.match(source, /stockQuantity\s*-\s*item\.quantity/, "order creation should decrement product or variant stock");
  assert.match(source, /GUEST_ORDER_SESSION_GRACE_MS/, "guest session lookup must be time-limited");
  assert.doesNotMatch(source, /hasGuestSession\s*=/, "guest access should not allow sessionId alone indefinitely");
  assert.match(source, /safeTokenMatch\(token,\s*order\.lookupToken\)/, "guest lookup should prefer secure lookup token");
  assert.match(source, /export async function lookupOrder/, "phone + order number lookup endpoint should exist");
  assert.match(source, /customerPhone:\s*phone/, "order lookup should be scoped to the customer phone number");
  assert.match(source, /await exportOrderToGoogleSheet\(order\)/, "order creation should wait for Google Sheets export status");
  assert.match(source, /export async function exportOrderToSheet/, "admin should be able to retry Google Sheets export");
}

async function testRouteContracts() {
  const source = await readSource("src/routes/orderRoutes.js");
  assert.match(source, /r\.post\("\/lookup",\s*lookupOrder\)/, "order lookup route should be registered before /:id");
  assert.match(source, /r\.post\("\/admin\/orders\/:id\/export-sheet"/, "admin sheet export retry route should exist");
}

async function testGoogleSheetContracts() {
  const source = await readSource("src/services/googleSheetService.js");
  assert.match(source, /GOOGLE_SHEET_WEBHOOK_URL is not configured/, "missing Google Sheet webhook should be visible");
  assert.match(source, /recordExportResult/, "Google Sheet export status should persist on the order");
  assert.match(source, /response\.text\(\)/, "Google Sheet webhook response should be captured for troubleshooting");
  assert.match(source, /parsed\.parsed\?\.ok !== true/, "Google Sheet export should require explicit ok:true from Apps Script");
  assert.match(source, /googleSheetWebhookSecret/, "Google Sheet export should support an optional webhook secret");
}

async function testGoogleSheetRuntimeBehavior() {
  const originalUrl = env.googleSheetWebhookUrl;
  const originalSecret = env.googleSheetWebhookSecret;
  const originalFetch = globalThis.fetch;

  const fakeOrder = () => ({
    _id: { toString: () => "507f1f77bcf86cd799439011" },
    createdAt: new Date("2026-05-23T00:00:00.000Z"),
    customerName: "Test Customer",
    customerPhone: "01711111111",
    shippingAddress: "Test address",
    district: "Dhaka",
    upazila: "Dhanmondi",
    paymentMethod: "COD",
    paymentStatus: "unpaid",
    status: "Pending",
    subtotal: 180,
    deliveryCharge: 80,
    couponDiscount: 0,
    total: 260,
    orderItems: [{ productName: "Kalonjira", variantWeight: "100g", quantity: 1, price: 180, subtotal: 180 }],
    integrations: {},
    markModified() {},
    async save() {}
  });

  try {
    env.googleSheetWebhookUrl = "https://script.google.com/macros/s/test/exec";
    env.googleSheetWebhookSecret = "sheet-secret";

    globalThis.fetch = async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.secret, "sheet-secret", "Google Sheet secret should be sent in webhook body");
      return new Response(JSON.stringify({ ok: true, message: "created" }), { status: 200 });
    };

    const successOrder = fakeOrder();
    const success = await exportOrderToGoogleSheet(successOrder);
    assert.equal(success.ok, true, "ok:true response should mark Google Sheet export successful");
    assert.equal(successOrder.integrations.googleSheets.status, "success", "success should persist on order");

    globalThis.fetch = async () => new Response(JSON.stringify({ ok: false, error: "bad secret" }), { status: 200 });
    const failedOrder = fakeOrder();
    const failed = await exportOrderToGoogleSheet(failedOrder);
    assert.equal(failed.ok, false, "ok:false response should mark Google Sheet export failed");
    assert.equal(failedOrder.integrations.googleSheets.status, "failed", "failure should persist on order");
    assert.match(failedOrder.integrations.googleSheets.lastError, /bad secret/, "Apps Script error should be visible");

    globalThis.fetch = async () => new Response("<html>Login</html>", { status: 200 });
    const htmlOrder = fakeOrder();
    const html = await exportOrderToGoogleSheet(htmlOrder);
    assert.equal(html.ok, false, "HTML login/error page should not be treated as exported");
    assert.match(htmlOrder.integrations.googleSheets.lastError, /did not return JSON/, "non-JSON response should explain deployment/access issue");
  } finally {
    env.googleSheetWebhookUrl = originalUrl;
    env.googleSheetWebhookSecret = originalSecret;
    globalThis.fetch = originalFetch;
  }
}

async function testContactContracts() {
  const appSource = await readSource("src/app.js");
  const routeSource = await readSource("src/routes/contactRoutes.js");
  const controllerSource = await readSource("src/controllers/contactController.js");

  assert.match(appSource, /app\.use\("\/api\/contact",\s*contactRoutes\)/, "contact route should be mounted");
  assert.match(routeSource, /r\.post\("\/",\s*createContactMessage\)/, "contact POST route should exist");
  assert.match(controllerSource, /ContactMessage\.create\(/, "contact messages should persist to database");
  assert.match(controllerSource, /sendEmail/, "contact messages should notify admin email when SMTP is configured");
}

async function testSeoContracts() {
  const appSource = await readSource("src/app.js");
  const robotsSource = await readFile(resolve(root, "../frontend/robots.txt"), "utf8");
  const sitemapSource = await readFile(resolve(root, "../frontend/sitemap.xml"), "utf8");

  assert.match(appSource, /env\.frontendOrigin/, "backend sitemap should use FRONTEND_ORIGIN");
  assert.doesNotMatch(appSource, /pureorigins\.bd/, "backend sitemap should not use old placeholder domain");
  assert.match(robotsSource, /Disallow:\s*\/admin\//, "frontend robots should block admin");
  assert.doesNotMatch(sitemapSource, /\/admin\/?<\/loc>/, "frontend sitemap should not list admin");
}

await testOrderControllerContracts();
await testRouteContracts();
await testGoogleSheetContracts();
await testGoogleSheetRuntimeBehavior();
await testContactContracts();
await testPaymentCallbackBehavior();
await testSeoContracts();
testCouponTotals();

console.log("Production checks passed: order creation, coupon totals, stock decrement, guest lookup, payment callback, Google Sheets, contact, SEO domain.");
