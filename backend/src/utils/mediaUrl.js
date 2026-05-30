import { env } from "../config/env.js";

function publicBaseUrl() {
  if (env.backendPublicUrl) return env.backendPublicUrl;
  if (env.nodeEnv === "production") return "https://pureorigins.onrender.com";
  return "";
}

export function resolvePublicMediaUrl(value = "") {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const base = publicBaseUrl().replace(/\/+$/, "");
  if (!base) return url.startsWith("/") ? url : `/${url}`;

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

export function normalizeImageList(images = []) {
  if (!Array.isArray(images)) return [];
  return images.map(resolvePublicMediaUrl).filter(Boolean);
}
