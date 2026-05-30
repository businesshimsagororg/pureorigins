import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, statusPill, $ } from "../utils.js";
import { dataTable, emptyState, skeletonTable } from "../ui/table.js";
import { confirmModal } from "../ui/modal.js";
import { toast } from "../ui/toast.js";

export function renderReviews() {
  const el = $("#reviewsTable");
  if (!el) return;
  if (!state.reviews.length) {
    el.innerHTML = emptyState("No reviews match this filter.");
    return;
  }
  const rows = state.reviews.map(review => `
    <tr class="review-row">
      <td>${escapeHtml(review.product?.nameBn || review.product || "-")}</td>
      <td>${escapeHtml(review.user?.name || "-")}<br/><small>${escapeHtml(review.user?.phone || review.user?.email || "")}</small></td>
      <td>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</td>
      <td class="review-text">${escapeHtml(review.text)}</td>
      <td>${statusPill(review.status)}</td>
      <td><div class="actions">
        <button type="button" class="mini-btn" data-review-action="${review._id}" data-status="approved">Approve</button>
        <button type="button" class="mini-btn danger" data-review-action="${review._id}" data-status="rejected">Reject</button>
      </div></td>
    </tr>
  `);
  el.innerHTML = dataTable(["Product", "Customer", "Rating", "Review", "Status", "Actions"], rows);
}

export async function loadReviews() {
  const status = $("#reviewFilter")?.value || "";
  let reviews = [];
  try {
    ({ reviews } = await req(`/reviews/admin/reviews${status ? `?status=${status}` : ""}`));
  } catch {
    reviews = [];
    toast.error("Review admin API unavailable — restart backend with latest code.");
  }
  state.reviews = reviews;
  renderReviews();
}

export function mountReviewsScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar">
      <select id="reviewFilter" class="search-input">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
    <div class="panel"><div id="reviewsTable"></div></div>
  `;
  root.querySelector("#reviewFilter")?.addEventListener("change", () => loadReviews().catch(e => toast.error(e.message)));
  root.querySelector("#reviewsTable")?.addEventListener("click", async e => {
    const btn = e.target.closest("[data-review-action]");
    if (!btn) return;
    const status = btn.dataset.status;
    if (status === "rejected") {
      const ok = await confirmModal({ title: "Reject review?", message: "This review will be hidden.", confirmLabel: "Reject", danger: true });
      if (!ok) return;
    }
    await withToast(req(`/reviews/admin/reviews/${btn.dataset.reviewAction}`, { method: "PUT", body: { status } }), "Review updated.");
    await loadReviews();
  });
  if (!state.reviews.length) {
    root.querySelector("#reviewsTable").innerHTML = skeletonTable();
    loadReviews().catch(e => toast.error(e.message));
  } else renderReviews();
}
