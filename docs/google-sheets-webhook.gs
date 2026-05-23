const SHEET_NAME = "Orders";

const HEADERS = [
  "Created At",
  "Order ID",
  "Customer Name",
  "Phone",
  "Address",
  "District",
  "Upazila",
  "Payment Method",
  "Payment Status",
  "Order Status",
  "Subtotal",
  "Delivery Charge",
  "Coupon Code",
  "Coupon Discount",
  "Total",
  "Items",
  "Notes",
  "Last Synced At"
];

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  return spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (existing.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function findOrderRow(sheet, orderId) {
  if (!orderId || sheet.getLastRow() < 2) return 0;
  const orderIds = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  const index = orderIds.findIndex(row => String(row[0]) === String(orderId));
  return index === -1 ? 0 : index + 2;
}

function toItemsText(data) {
  if (data.itemsText) return data.itemsText;
  return (data.items || [])
    .map(item => `${item.productName || "Product"} ${item.variantWeight || ""} x ${item.quantity || 1}`)
    .join(", ");
}

function orderRow(data) {
  return [
    data.createdAt || new Date().toISOString(),
    data.orderId || "",
    data.customerName || "",
    data.customerPhone || "",
    data.shippingAddress || "",
    data.district || "",
    data.upazila || "",
    data.paymentMethod || "",
    data.paymentStatus || "",
    data.orderStatus || "",
    Number(data.subtotal || 0),
    Number(data.deliveryCharge || 0),
    data.couponCode || "",
    Number(data.couponDiscount || 0),
    Number(data.total || 0),
    toItemsText(data),
    data.notes || "",
    new Date().toISOString()
  ];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");

    if (expectedSecret && data.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized Google Sheets webhook request." });
    }

    if (!data.orderId) {
      return jsonResponse({ ok: false, error: "Missing orderId." });
    }

    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaderRow(sheet);

    const row = orderRow(data);
    const existingRow = findOrderRow(sheet, data.orderId);

    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
      return jsonResponse({ ok: true, action: "updated", row: existingRow, message: "Order updated in Google Sheets." });
    }

    sheet.appendRow(row);
    return jsonResponse({ ok: true, action: "created", row: sheet.getLastRow(), message: "Order exported to Google Sheets." });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}
