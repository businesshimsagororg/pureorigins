import { req } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, money, $ } from "../utils.js";
import { renderMetrics } from "../ui/metrics.js";
import { dataTable, emptyState } from "../ui/table.js";
import { toast } from "../ui/toast.js";

export async function loadReports() {
  const [sales, stock, customers] = await Promise.all([
    req("/admin/reports/sales"),
    req("/admin/reports/stock"),
    req("/admin/reports/customers")
  ]);
  state.reports = { sales, stock, customers };
  renderReports();
}

export function renderReports() {
  const { sales, stock, customers } = state.reports;
  if (!sales) return;

  renderMetrics("#reportCards", [
    { icon: "📊", label: "Total orders", value: sales.totalOrders || 0 },
    { icon: "৳", label: "Revenue", value: money(sales.totalRevenue || 0) },
    { icon: "🌿", label: "Products", value: stock?.totalProducts || 0 },
    { icon: "👤", label: "Registered customers", value: customers?.customers || 0 }
  ]);

  const orders = sales.orders || [];
  const byStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(byStatus));
  const chartEl = $("#revenueChart");
  if (chartEl) {
    chartEl.innerHTML = Object.keys(byStatus).length
      ? Object.entries(byStatus)
          .map(
            ([status, count]) => `
        <div class="bar"><strong>${escapeHtml(status)}</strong>
          <div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div>
          <span>${count}</span></div>`
          )
          .join("")
      : emptyState("No order data in sales report.");
  }

  const stockEl = $("#stockTable");
  if (stockEl) {
    const low = stock?.lowStock || [];
    stockEl.innerHTML = low.length
      ? dataTable(
          ["Product", "Stock", "Threshold"],
          low.map(p => `<tr><td>${escapeHtml(p.nameBn)}</td><td>${p.stockQuantity}</td><td>${p.lowStockThreshold}</td></tr>`)
        )
      : emptyState("No low-stock products.");
  }
}

export function mountReportsScreen(root) {
  root.innerHTML = `
    <div id="reportCards" class="metric-grid"></div>
    <div class="split">
      <div class="panel">
        <h2>Orders by status</h2>
        <p class="muted">From sales report API (excludes cancelled/returned/refunded revenue).</p>
        <div id="revenueChart" class="chart"></div>
      </div>
      <div class="panel">
        <h2>Low stock</h2>
        <div id="stockTable"></div>
      </div>
    </div>
  `;
  if (!state.reports.sales) {
    $("#reportCards").innerHTML = `<div class="empty-state">Loading reports…</div>`;
    loadReports().catch(e => toast.error(e.message));
  } else renderReports();
}
