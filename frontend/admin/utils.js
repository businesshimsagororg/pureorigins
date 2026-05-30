import { API } from "./config.js";

export const $ = selector => document.querySelector(selector);
export const $$ = selector => [...document.querySelectorAll(selector)];

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

export function money(value = 0) {
  return `৳${Number(value || 0).toLocaleString("bn-BD")}`;
}

export function dateText(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" });
}

export function shortId(id = "") {
  return `#${String(id).slice(-8).toUpperCase()}`;
}

export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function splitList(value) {
  return String(value || "").split(",").map(item => item.trim()).filter(Boolean);
}

export function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function statusPill(value, active = true) {
  const cls = !active || ["Cancelled", "Returned", "Refunded", "rejected", "archived"].includes(value)
    ? "bad"
    : ["Pending", "pending", "new"].includes(value)
      ? "warn"
      : "ok";
  return `<span class="pill ${cls}">${escapeHtml(value)}</span>`;
}

export function sheetStatus(order) {
  const sheet = order.integrations?.googleSheets || {};
  const status = sheet.status || "pending";
  const labelMap = {
    success: "Exported",
    failed: "Failed",
    not_configured: "No webhook",
    pending: "Not sent"
  };
  const note = sheet.lastError || "";
  return `${statusPill(labelMap[status] || status, status === "success")}${note ? `<br/><small>${escapeHtml(note)}</small>` : ""}`;
}

export function resolveMediaUrl(url = "") {
  const value = String(url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const origin = API.replace(/\/api\/?$/, "");
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}

export function couponSummary(coupon) {
  const discount = coupon.type === "percent" ? `${coupon.value}%` : money(coupon.value);
  const min = Number(coupon.minimumOrderAmount || 0);
  return `${discount} off${min > 0 ? `, min ${money(min)}` : ""}`;
}
