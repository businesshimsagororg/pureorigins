import cron from "node-cron";
import AbandonedCart from "../models/AbandonedCart.js";
import { sendSMS } from "../services/smsService.js";

export function startAbandonedCartJob() {
  cron.schedule("*/30 * * * *", async () => {
    const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const carts = await AbandonedCart.find({ recovered: false, lastActiveAt: { $lte: cutoff }, reminderSentAt: null });
    for (const c of carts) {
      if (c.phone) await sendSMS({ to: c.phone, message: "????? PureOrigins ????? ???????? ???? ??? ?????? ??????? ?????" });
      c.reminderSentAt = new Date();
      await c.save();
    }
  });
}