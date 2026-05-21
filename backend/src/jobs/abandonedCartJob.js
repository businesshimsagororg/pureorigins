import cron from "node-cron";
import AbandonedCart from "../models/AbandonedCart.js";
import Notification from "../models/Notification.js";
import { sendSMS } from "../services/smsService.js";
import { sendEmail } from "../services/emailService.js";

export function startAbandonedCartJob() {
  cron.schedule("*/30 * * * *", async () => {
    const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const carts = await AbandonedCart.find({
      recovered: false,
      lastActiveAt: { $lte: cutoff },
      reminderSentAt: null,
      "items.0": { $exists: true }
    }).populate("items.product", "nameBn nameEn");

    for (const c of carts) {
      const productNames = c.items
        .map(item => item.product?.nameBn || item.product?.nameEn)
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
      const message = `PureOrigins-এ আপনার কার্টে ${productNames || "পণ্য"} অপেক্ষা করছে। অর্ডার সম্পন্ন করতে ফিরে আসুন।`;

      if (c.phone) {
        const sms = await sendSMS({ to: c.phone, message });
        await Notification.create({ type: "sms", recipient: c.phone, subject: "Abandoned cart reminder", message, status: sms.ok ? "sent" : "failed" });
      }

      if (c.email) {
        const email = await sendEmail({
          to: c.email,
          subject: "Your PureOrigins cart is waiting",
          html: `<p>${message}</p><p>Complete your order before stock changes.</p>`
        });
        await Notification.create({ type: "email", recipient: c.email, subject: "Abandoned cart reminder", message, status: email.ok ? "sent" : "failed" });
      }

      c.reminderSentAt = new Date();
      await c.save();
    }
  });
}
