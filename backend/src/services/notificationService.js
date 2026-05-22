import Notification from "../models/Notification.js";
import { sendSMS } from "./smsService.js";
import { sendEmail } from "./emailService.js";

export async function notifyOrderPlaced({ customerPhone, customerEmail, orderId, total }) {
  const smsText = `আপনার PureOrigins অর্ডার (${orderId}) গ্রহণ করা হয়েছে। মোট: ৳${total}. ধন্যবাদ।`;
  const sms = await sendSMS({ to: customerPhone, message: smsText });
  await Notification.create({ type: "sms", recipient: customerPhone, subject: "Order placed", message: smsText, status: sms.ok ? "sent" : "failed" });

  if (customerEmail) {
    const subject = `PureOrigins Order Confirmation #${orderId}`;
    const html = `<p>Thank you for your order.</p><p>Order: ${orderId}</p><p>Total: ৳${total}</p>`;
    const email = await sendEmail({ to: customerEmail, subject, html });
    await Notification.create({ type: "email", recipient: customerEmail, subject, message: `Order ${orderId}`, status: email.ok ? "sent" : "failed" });
  }

  if (process.env.ADMIN_EMAIL) {
    const subject = `New PureOrigins order #${orderId}`;
    const html = `<p>A new order has been placed.</p><p>Order: ${orderId}</p><p>Customer phone: ${customerPhone}</p><p>Total: BDT ${total}</p>`;
    const adminEmail = await sendEmail({ to: process.env.ADMIN_EMAIL, subject, html });
    await Notification.create({ type: "email", recipient: process.env.ADMIN_EMAIL, subject, message: `New order ${orderId}`, status: adminEmail.ok ? "sent" : "failed" });
  }
}

export async function notifyOrderStatus({ customerPhone, customerEmail, orderId, status }) {
  const smsText = `আপনার PureOrigins অর্ডার ${orderId} এখন: ${status}`;
  const sms = await sendSMS({ to: customerPhone, message: smsText });
  await Notification.create({ type: "sms", recipient: customerPhone, subject: "Order status", message: smsText, status: sms.ok ? "sent" : "failed" });

  if (customerEmail) {
    const subject = `Order ${orderId} is now ${status}`;
    const html = `<p>Your order status changed to <strong>${status}</strong>.</p>`;
    const email = await sendEmail({ to: customerEmail, subject, html });
    await Notification.create({ type: "email", recipient: customerEmail, subject, message: status, status: email.ok ? "sent" : "failed" });
  }
}
