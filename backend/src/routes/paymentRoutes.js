import express, { Router } from "express";
import { handlePaymentCallback } from "../services/paymentService.js";

const r = Router();
const sslcommerzBody = express.urlencoded({ extended: false });

async function sslcommerzCallback(req, res, next) {
  try {
    const data = await handlePaymentCallback({ ...req.query, ...req.body });
    if (!data.ok) return res.status(404).json(data);
    return res.json({ ok: true, orderId: data.order._id, paymentStatus: data.order.paymentStatus, status: data.order.status });
  } catch (err) {
    return next(err);
  }
}

r.get("/sslcommerz/callback", sslcommerzCallback);
r.post("/sslcommerz/callback", sslcommerzBody, sslcommerzCallback);
r.post("/sslcommerz/ipn", sslcommerzBody, sslcommerzCallback);

export default r;
