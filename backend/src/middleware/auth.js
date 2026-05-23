import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtAccessSecret, { expiresIn: env.jwtExpiresIn });
}

function tokenFromRequest(req) {
  const cookieToken = req.cookies?.accessToken;
  const authHeader = req.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  return cookieToken || bearerToken;
}

export function authRequired(req, res, next) {
  const token = tokenFromRequest(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.auth = jwt.verify(token, env.jwtAccessSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired" });
  }
}

export function optionalAuth(req, res, next) {
  const token = tokenFromRequest(req);
  if (!token) {
    req.auth = null;
    return next();
  }

  try {
    req.auth = jwt.verify(token, env.jwtAccessSecret);
  } catch {
    req.auth = null;
  }

  return next();
}

export function adminRequired(req, res, next) {
  if (req.auth?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  return next();
}
