import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { signToken } from "../middleware/auth.js";
import { env } from "../config/env.js";

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
  res.json({ user: { id: user._id, name: user.name, role: user.role } });
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
  const user = await User.create({ name: "PureOrigins Admin", phone: "01700000000", email: env.adminEmail, passwordHash, role: "admin" });
  await Admin.create({ user: user._id, permissions: ["all"] });
}
