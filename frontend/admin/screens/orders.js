import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, money, dateText, shortId, statusPill, sheetStatus, debounce, $ } from "../utils.js";
import { dataTable, emptyState, skeletonTable } from "../ui/table.js";
import { openDrawer, closeDrawer, getDrawerEl } from "../ui/drawer.js";
import { toast } from "../ui/toast.js";

const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned", "Refunded"];
let orderFilters = { q: "", status: "", payment: "", sheet: "" };

export function orderDetailHtml(order) {
  const items = (order.orderItems || [])
    .map(
      item =>
        `<li>${escapeHtml(item.productName)} ${escapeHtml(item.variantWeight || "")} × ${item.quantity} — ${money(item.lineTotal || item.unitPrice * item.quantity)}</li>`
    )
    .join("");
  return `
    <dl class="detail-grid">
      <div><dt>Order</dt><dd>${shortId(order._id)} · ${dateText(order.createdAt)}</dd></div>
      <div><dt>Customer</dt><dd>${escapeHtml(order.customerName)}<br/>${escapeHtml(order.customerPhone)}</dd></div>
      <div><dt>Address</dt><dd>${escapeHtml(order.address || "")}<br/>${escapeHtml(order.district || "")} ${escapeHtml(order.upazila || "")}</dd></div>
      <div><dt>Payment</dt><dd>${escapeHtml(order.paymentMethod)} · ${statusPill(order.paymentStatus)}</dd></div>
      <div><dt>Total</dt><dd><strong>${money(order.total)}</strong> (sub ${money(order.subtotal)}, delivery ${money(order.deliveryCharge)})</dd></div>
      ${order.couponCode ? `<div><dt>Coupon</dt><dd>${escapeHtml(order.couponCode)} (−${money(order.couponDiscount)})</dd></div>` : ""}
      <div><dt>Sheet</dt><dd>${sheetStatus(order)}</dd></div>
      ${order.notes ? `<div class="full"><dt>Notes</dt><dd>${escapeHtml(order.notes)}</dd></div>` : ""}
    </dl>
    <h3>Items</h3>
    <ul class="detail-list">${items || "<li>No items</li>"}</ul>
    <div class="drawer-form">
      <label>Status
        <select id="drawerOrderStatus">${ORDER_STATUSES.map(s => `<option ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}</select>
      </label>
      <label>Tracking
        <input id="drawerOrderTrack" value="${escapeHtml(order.trackingNumber || "")}" placeholder="Tracking number"/>
      </label>
    </div>`;
}

export function openOrderDrawer(orderId) {
  const order = state.orders.find(o => o._id === orderId);
  if (!order) return;

  const footer = `
    <button type="button" class="secondary-btn" data-drawer-export-sheet>Export Sheet</button>
    <button type="button" class="primary-btn" data-drawer-save-order>Save changes</button>
  `;

  openDrawer({
    title: `Order ${shortId(order._id)}`,
    content: orderDetailHtml(order),
    footer
  });

  const overlay = getDrawerEl();
  overlay.querySelector("[data-drawer-save-order]")?.addEventListener("click", async () => {
    const status = overlay.querySelector("#drawerOrderStatus")?.value;
    const trackingNumber = overlay.querySelector("#drawerOrderTrack")?.value?.trim() || "";
    await withToast(
      req(`/orders/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: { status, trackingNumber, note: "Updated from admin dashboard" }
      }),
      "Order updated."
    );
    await loadOrders();
    closeDrawer();
  });
  overlay.querySelector("[data-drawer-export-sheet]")?.addEventListener("click", async () => {
    const { message, result } = await req(`/orders/admin/orders/${orderId}/export-sheet`, { method: "POST" });
    await loadOrders();
    if (result?.ok) toast.success(message || "Exported to Google Sheets.");
    else toast.error(message || result?.message || "Sheet export failed.");
    openOrderDrawer(orderId);
  });
}

function filteredOrders() {
  return state.orders.filter(order => {
    const q = orderFilters.q.toLowerCase();
    if (q) {
      const hay = `${order.customerName} ${order.customerPhone} ${order._id}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (orderFilters.status && order.status !== orderFilters.status) return false;
    if (orderFilters.payment && order.paymentStatus !== orderFilters.payment) return false;
    if (orderFilters.sheet) {
      const st = order.integrations?.googleSheets?.status || "pending";
      if (st !== orderFilters.sheet) return false;
    }
    return true;
  });
}

export function renderOrders(target = "#ordersTable", { limit = null, clickable = true } = {}) {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;

  let orders = filteredOrders();
  if (limit) orders = orders.slice(0, limit);

  if (!orders.length) {
    el.innerHTML = emptyState("No orders match your filters.");
    return;
  }

  const rows = orders.map(order => `
    <tr class="${clickable ? "row-clickable" : ""}" data-order-id="${order._id}">
      <td><strong>${shortId(order._id)}</strong><br/><small>${dateText(order.createdAt)}</small></td>
      <td>${escapeHtml(order.customerName)}<br/><small>${escapeHtml(order.customerPhone)}</small></td>
      <td>${money(order.total)}<br/><small>${escapeHtml(order.paymentMethod)}</small></td>
      <td>${statusPill(order.status)}</td>
      <td>${sheetStatus(order)}</td>
      <td><button type="button" class="mini-btn" data-open-order="${order._id}">Details</button></td>
    </tr>
  `);

  el.innerHTML = dataTable(["Order", "Customer", "Total", "Status", "Sheet", ""], rows);
}

export async function loadOrders() {
  const q = $("#orderSearch")?.value?.trim() || "";
  orderFilters.q = q;
  const { orders } = await req(`/orders/admin/orders${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  state.orders = orders;
  renderOrders();
}

export function mountOrdersScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar">
      <div class="search-wrap">
        <input id="orderSearch" class="search-input" placeholder="Search name or phone" value="${escapeHtml(orderFilters.q)}"/>
        <button type="button" class="search-clear" data-clear-order-search aria-label="Clear">×</button>
      </div>
      <div class="filter-chips" id="orderStatusChips"></div>
    </div>
    <div class="panel">
      <div class="panel-head">
        <h2>Orders</h2>
        <button type="button" class="ghost-btn" data-refresh-orders>Refresh</button>
      </div>
      <div id="ordersTable"></div>
    </div>
  `;

  const statusChips = root.querySelector("#orderStatusChips");
  const chips = [
    { key: "status", value: "", label: "All status" },
    ...ORDER_STATUSES.map(s => ({ key: "status", value: s, label: s })),
    { key: "sheet", value: "failed", label: "Sheet failed" },
    { key: "sheet", value: "success", label: "Exported" }
  ];

  statusChips.innerHTML = chips
    .map(c => {
      const active =
        (c.key === "status" && orderFilters.status === c.value && !orderFilters.sheet) ||
        (c.key === "sheet" && orderFilters.sheet === c.value);
      return `<button type="button" class="chip ${active ? "active" : ""}" data-filter-key="${c.key}" data-filter-value="${escapeHtml(c.value)}">${escapeHtml(c.label)}</button>`;
    })
    .join("");

  statusChips.addEventListener("click", e => {
    const chip = e.target.closest("[data-filter-key]");
    if (!chip) return;
    const key = chip.dataset.filterKey;
    const value = chip.dataset.filterValue;
    if (key === "status") {
      orderFilters.status = value;
      orderFilters.sheet = "";
    } else {
      orderFilters.sheet = value;
      orderFilters.status = "";
    }
    statusChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    renderOrders();
  });

  root.querySelector("[data-refresh-orders]")?.addEventListener("click", () => loadOrders().catch(e => toast.error(e.message)));
  root.querySelector("[data-clear-order-search]")?.addEventListener("click", () => {
    const input = root.querySelector("#orderSearch");
    input.value = "";
    orderFilters.q = "";
    loadOrders().catch(e => toast.error(e.message));
  });
  root.querySelector("#orderSearch")?.addEventListener(
    "input",
    debounce(() => loadOrders().catch(e => toast.error(e.message)), 350)
  );

  root.querySelector("#ordersTable")?.addEventListener("click", e => {
    const row = e.target.closest("[data-order-id]");
    const btn = e.target.closest("[data-open-order]");
    const id = btn?.dataset.openOrder || row?.dataset.orderId;
    if (id) openOrderDrawer(id);
  });

  if (!state.orders.length) {
    root.querySelector("#ordersTable").innerHTML = skeletonTable();
    loadOrders().catch(e => toast.error(e.message));
  } else {
    renderOrders();
  }
}
