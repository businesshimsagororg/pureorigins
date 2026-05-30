import { state } from "../state.js";
import { money, $ } from "../utils.js";
import { renderMetrics } from "../ui/metrics.js";
import { renderOrders, openOrderDrawer } from "./orders.js";

export function renderDashboard() {
  const revenue = state.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = state.products.filter(
    p => Number(p.stockQuantity) <= Number(p.lowStockThreshold || 0)
  ).length;
  const pendingReviews = state.reviews.filter(r => r.status === "pending").length;
  const unreadMessages = state.messages.filter(m => (m.status || "new") === "new").length;

  renderMetrics("#summaryCards", [
    { icon: "📦", label: "Orders", value: state.orders.length, hint: "All time loaded" },
    { icon: "৳", label: "Revenue", value: money(revenue), hint: "From loaded orders" },
    { icon: "🌿", label: "Products", value: state.products.length },
    { icon: "⚠", label: "Low stock", value: lowStock, hint: lowStock ? "Check reports" : "OK" }
  ]);

  const quick = $("#dashboardQuick");
  if (quick) {
    quick.innerHTML = `
      <button type="button" class="chip" data-jump="reviews">Pending reviews (${pendingReviews})</button>
      <button type="button" class="chip" data-jump="messages">New messages (${unreadMessages})</button>
      <button type="button" class="chip" data-jump="reports">Low stock report</button>
    `;
  }

  renderOrders("#recentOrders", { limit: 6, clickable: true });
}

export function mountDashboardScreen(root) {
  root.innerHTML = `
    <div id="summaryCards" class="metric-grid"></div>
    <div class="quick-links" id="dashboardQuick"></div>
    <div class="panel">
      <div class="panel-head">
        <h2>Recent orders</h2>
        <button type="button" class="secondary-btn" data-jump="orders">View all</button>
      </div>
      <div id="recentOrders"></div>
    </div>
  `;

  root.querySelector("#recentOrders")?.addEventListener("click", e => {
    const id = e.target.closest("[data-order-id]")?.dataset.orderId || e.target.closest("[data-open-order]")?.dataset.openOrder;
    if (id) openOrderDrawer(id);
  });

  renderDashboard();
}
