import { state } from "../state.js";
import { escapeHtml, money, $ } from "../utils.js";
import { renderMetrics } from "../ui/metrics.js";
import { dataTable, emptyState } from "../ui/table.js";

export function renderCustomers() {
  const { customers } = state.reports;
  renderMetrics("#customerCards", [
    { icon: "👤", label: "Registered", value: customers?.customers || 0 },
    { icon: "🛒", label: "Active carts", value: customers?.activeCarts || 0 },
    { icon: "📞", label: "Order customers", value: new Set(state.orders.map(o => o.customerPhone)).size },
    {
      icon: "✓",
      label: "Delivered",
      value: state.orders.filter(o => o.status === "Delivered").length
    }
  ]);

  const customerMap = new Map();
  state.orders.forEach(order => {
    const key = order.customerPhone || order.customerName;
    const current = customerMap.get(key) || {
      name: order.customerName,
      phone: order.customerPhone,
      orders: 0,
      spent: 0
    };
    current.orders += 1;
    current.spent += order.total || 0;
    customerMap.set(key, current);
  });
  const top = [...customerMap.values()].sort((a, b) => b.spent - a.spent).slice(0, 20);
  const el = $("#customerInsights");
  if (!el) return;
  el.innerHTML = top.length
    ? dataTable(
        ["Customer", "Orders", "Spent", ""],
        top.map(c => `
      <tr>
        <td>${escapeHtml(c.name)}<br/><small>${escapeHtml(c.phone)}</small></td>
        <td>${c.orders}</td>
        <td>${money(c.spent)}</td>
        <td><button type="button" class="mini-btn" data-filter-orders-phone="${escapeHtml(c.phone)}">View orders</button></td>
      </tr>`)
      )
    : emptyState("No customer activity from loaded orders.");
}

export function mountCustomersScreen(root) {
  root.innerHTML = `
    <p class="muted panel-note">Customer metrics combine the customer report API with order data already loaded in this session.</p>
    <div id="customerCards" class="metric-grid"></div>
    <div class="panel">
      <h2>Top spenders</h2>
      <div id="customerInsights"></div>
    </div>
  `;
  root.querySelector("#customerInsights")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter-orders-phone]");
    if (!btn) return;
    const phone = btn.dataset.filterOrdersPhone;
    window.location.hash = "orders";
    document.dispatchEvent(new CustomEvent("admin:navigate", { detail: { screen: "orders", orderSearch: phone } }));
  });
  renderCustomers();
}
