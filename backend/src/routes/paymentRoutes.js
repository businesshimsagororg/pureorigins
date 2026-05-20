import { Router } from "express";
import { handlePaymentCallback } from "../services/paymentService.js";

const r = Router();

r.get("/sslcommerz/callback", async (req, res, next) => {
  try {
    const { orderId, result, val_id } = req.query;
    const data = await handlePaymentCallback({ orderId, result, val_id });
    if (!data.ok) return res.status(404).json(data);
    return res.json({ ok: true, orderId, paymentStatus: data.order.paymentStatus, status: data.order.status });
  } catch (err) {
    return next(err);
  }
});

export default r;