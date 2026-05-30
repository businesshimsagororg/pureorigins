import { escapeHtml } from "../utils.js";

export function metricCards(metrics) {
  return metrics
    .map(
      m => `
    <div class="metric-card">
      <span class="metric-icon" aria-hidden="true">${m.icon || "◆"}</span>
      <div class="metric-body">
        <span class="metric-label">${escapeHtml(m.label)}</span>
        <strong class="metric-value">${escapeHtml(String(m.value))}</strong>
        ${m.hint ? `<small class="metric-hint">${escapeHtml(m.hint)}</small>` : ""}
      </div>
    </div>`
    )
    .join("");
}

export function renderMetrics(target, metrics) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el) el.innerHTML = metricCards(metrics);
}
