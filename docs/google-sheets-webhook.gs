const SHEET_NAME = "Orders";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    const headers = [
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
      "Notes"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const itemsText = data.itemsText || (data.items || [])
      .map(item => `${item.productName || "Product"} ${item.variantWeight || ""} x ${item.quantity || 1}`)
      .join(", ");

    sheet.appendRow([
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
      data.subtotal || 0,
      data.deliveryCharge || 0,
      data.couponCode || "",
      data.couponDiscount || 0,
      data.total || 0,
      itemsText,
      data.notes || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
