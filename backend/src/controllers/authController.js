import crypto from "crypto";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { signToken } from "../middleware/auth.js";
import { env } from "../config/env.js";
import { sendSMS } from "../services/smsService.js";

function cookieOptions(req) {
  const host = req.hostname || "";
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "::1";
  const domain = env.cookieDomain && !isLocalHost ? env.cookieDomain : undefined;

  return {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    domain
  };
}

function setAuthCookie(req, res, token) {
  res.cookie("accessToken", token, {
    ...cookieOptions(req),
    maxAge: 7 * 24 * 3600 * 1000
  });
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, phone, email, password } = req.body;
  const exists = await User.findOne({ $or: [{ phone }, ...(email ? [{ email }] : [])] });
  if (exists) return res.status(409).json({ message: "User already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, phone, email, passwordHash });
  const token = signToken(user);
  setAuthCookie(req, res, token);
  res.status(201).json({ user: { id: user._id, name: user.name, role: user.role } });
}

export async function login(req, res) {
  const { phoneOrEmail, password } = req.body;
  const user = await User.findOne({ $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail?.toLowerCase() }] });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken(user);
  setAuthCookie(req, res, token);
  res.json({
    user: { id: user._id, name: user.name, role: user.role },
    ...(user.role === "admin" ? { accessToken: token } : {})
  });
}

export async function requestPhoneLogin(req, res) {
  const phone = String(req.body.phone || "").trim();
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return res.status(400).json({ message: "Valid Bangladeshi phone number required" });
  }

  const user = await User.findOne({ phone, role: "customer", isActive: true });
  if (!user) {
    return res.status(404).json({ message: "No customer account found for this phone. Please place an order first." });
  }

  const code = String(crypto.randomInt(100000, 1000000));
  user.phoneLoginCodeHash = await bcrypt.hash(code, 10);
  user.phoneLoginCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const sms = await sendSMS({
    to: phone,
    message: `PureOrigins login code: ${code}. This code expires in 10 minutes.`
  });

  res.json({
    message: sms.ok ? "Login code sent to your phone." : "Login code created. SMS gateway is not configured.",
    ...(env.nodeEnv !== "production" ? { devCode: code } : {})
  });
}

export async function verifyPhoneLogin(req, res) {
  const phone = String(req.body.phone || "").trim();
  const code = String(req.body.code || "").trim();
  if (!/^01[3-9]\d{8}$/.test(phone) || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ message: "Valid phone and 6-digit code required" });
  }

  const user = await User.findOne({ phone, role: "customer", isActive: true });
  if (!user || !user.phoneLoginCodeHash || !user.phoneLoginCodeExpiresAt || user.phoneLoginCodeExpiresAt < new Date()) {
    return res.status(401).json({ message: "Login code expired. Please request a new code." });
  }

  const ok = await bcrypt.compare(code, user.phoneLoginCodeHash);
  if (!ok) return res.status(401).json({ message: "Invalid login code" });

  user.phoneLoginCodeHash = undefined;
  user.phoneLoginCodeExpiresAt = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);
  setAuthCookie(req, res, token);
  res.json({ user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
}

export async function logout(req, res) {
  res.clearCookie("accessToken", cookieOptions(req));
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  const user = await User.findById(req.auth.sub).select("name email phone role");
  res.json({ user });
}

export async function ensureAdminSeed() {
  const existing = await User.findOne({ email: env.adminEmail });
  if (existing) return;
  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  const user = await User.create({ name: "PureOrigins Admin", phone: env.adminPhone || "01900000000", email: env.adminEmail, passwordHash, role: "admin" });
  await Admin.create({ user: user._id, permissions: ["all"] });
}
