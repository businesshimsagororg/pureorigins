import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:8080",
  cookieDomain: process.env.COOKIE_DOMAIN || "",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieSameSite: process.env.COOKIE_SAMESITE || "lax",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  ga4Id: process.env.GA4_ID || "",
  fbPixelId: process.env.FACEBOOK_PIXEL_ID || ""
};
