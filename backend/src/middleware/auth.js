import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtAccessSecret, { expiresIn: env.jwtExpiresIn });
}

export function authRequired(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.auth = jwt.verify(token, env.jwtAccessSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired" });
  }
}

export function adminRequired(req, res, next) {
  if (req.auth?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  return next();
}