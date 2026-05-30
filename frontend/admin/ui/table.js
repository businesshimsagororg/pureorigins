import { escapeHtml } from "../utils.js";
import { state } from "../state.js";

export function emptyState(message, ctaHtml = "") {
  return `<div class="empty-state"><p>${escapeHtml(message)}</p>${ctaHtml}</div>`;
}

export function skeletonTable(rows = 5, cols = 5) {
  const head = `<tr>${Array(cols).fill("<th><span class='skel'></span></th>").join("")}</tr>`;
  const body = Array(rows)
    .fill(
      `<tr>${Array(cols)
        .fill("<td><span class='skel'></span></td>")
        .join("")}</tr>`
    )
    .join("");
  return `<div class="table-wrap table-loading"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

export function dataTable(headers, rows, { compact } = {}) {
  if (!rows.length) return "";
  const compactClass = compact ?? state.compactTables ? " table-compact" : "";
  return `<div class="table-wrap${compactClass}"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}
