import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Order from "../src/models/Order.js";
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
  assert.equal(deliveryChargeByDistrict("Dhaka"), 60, "Dhaka delivery charge");
  assert.equal(deliveryChargeByDistrict("Chittagong"), 120, "outside Dhaka delivery charge");
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
}

async function testRouteContracts() {
  const source = await readSource("src/routes/orderRoutes.js");
  assert.match(source, /r\.post\("\/lookup",\s*lookupOrder\)/, "order lookup route should be registered before /:id");
}

async function testSeoContracts() {
  const appSource = await readSource("src/app.js");
  assert.match(appSource, /env\.frontendOrigin/, "backend sitemap should use FRONTEND_ORIGIN");
  assert.doesNotMatch(appSource, /pureorigins\.bd/, "backend sitemap should not use old placeholder domain");
}

await testOrderControllerContracts();
await testRouteContracts();
await testPaymentCallbackBehavior();
await testSeoContracts();
testCouponTotals();

console.log("Production checks passed: order creation, coupon totals, stock decrement, guest lookup, payment callback, SEO domain.");
