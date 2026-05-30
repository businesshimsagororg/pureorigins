import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, dateText, statusPill, couponSummary, toDateTimeLocal, $ } from "../utils.js";
import { dataTable, emptyState, skeletonTable } from "../ui/table.js";
import { openDrawer, closeDrawer, getDrawerEl } from "../ui/drawer.js";
import { confirmModal } from "../ui/modal.js";
import { toast } from "../ui/toast.js";

function couponFormHtml(coupon = null) {
  const c = coupon || {};
  return `
    <form id="couponDrawerForm" class="form-grid drawer-form">
      <input type="hidden" name="id" value="${escapeHtml(c._id || "")}"/>
      <label>Code<input name="code" value="${escapeHtml(c.code || "")}" required/></label>
      <label>Type<select name="type"><option value="percent" ${c.type !== "flat" ? "selected" : ""}>Percent</option><option value="flat" ${c.type === "flat" ? "selected" : ""}>Flat</option></select></label>
      <label>Value<input name="value" type="number" min="0" value="${c.value ?? ""}" required/></label>
      <label>Expiry<input name="expiryDate" type="date" value="${c.expiryDate?.slice(0, 10) || ""}" required/></label>
      <label>Usage limit<input name="usageLimit" type="number" min="0" value="${c.usageLimit ?? 0}"/></label>
      <label>Per user limit<input name="perUserUsageLimit" type="number" min="1" value="${c.perUserUsageLimit ?? 1}"/></label>
      <label>Minimum order<input name="minimumOrderAmount" type="number" min="0" value="${c.minimumOrderAmount ?? 0}"/></label>
      <label>Active<select name="isActive"><option value="true" ${c.isActive !== false ? "selected" : ""}>Active</option><option value="false" ${c.isActive === false ? "selected" : ""}>Inactive</option></select></label>
    </form>`;
}

function couponPayload(form) {
  const data = Object.fromEntries(new FormData(form));
  return {
    code: data.code.toUpperCase(),
    type: data.type,
    value: Number(data.value || 0),
    expiryDate: data.expiryDate,
    usageLimit: Number(data.usageLimit || 0),
    perUserUsageLimit: Number(data.perUserUsageLimit || 1),
    minimumOrderAmount: Number(data.minimumOrderAmount || 0),
    isActive: data.isActive === "true"
  };
}

export function openCouponDrawer(id = null) {
  const coupon = id ? state.coupons.find(c => c._id === id) : null;
  openDrawer({
    title: coupon ? "Edit coupon" : "Create coupon",
    content: couponFormHtml(coupon),
    footer: `<button type="button" class="primary-btn" data-save-coupon>Save coupon</button>`
  });
  getDrawerEl().querySelector("[data-save-coupon]")?.addEventListener("click", async () => {
    const form = getDrawerEl().querySelector("#couponDrawerForm");
    const cid = form.elements.id.value;
    await withToast(
      req(cid ? `/coupons/admin/coupons/${cid}` : "/coupons/admin/coupons", {
        method: cid ? "PUT" : "POST",
        body: couponPayload(form)
      }),
      "Coupon saved."
    );
    await loadCoupons();
    closeDrawer();
  });
}

export function renderCoupons() {
  const el = $("#couponsTable");
  if (!el) return;
  if (!state.coupons.length) {
    el.innerHTML = emptyState("No coupons yet.", `<button type="button" class="primary-btn" data-new-coupon>Create coupon</button>`);
    el.querySelector("[data-new-coupon]")?.addEventListener("click", () => openCouponDrawer());
    return;
  }
  const rows = state.coupons.map(coupon => `
    <tr>
      <td><strong>${escapeHtml(coupon.code)}</strong><br/><small>${escapeHtml(couponSummary(coupon))}</small></td>
      <td>${coupon.type === "percent" ? `${coupon.value}%` : "Flat"} · used ${coupon.usedCount || 0}/${coupon.usageLimit || "∞"}</td>
      <td>${dateText(coupon.expiryDate)}</td>
      <td>${statusPill(coupon.isActive ? "Active" : "Inactive", coupon.isActive)}</td>
      <td><div class="actions">
        <button type="button" class="mini-btn" data-edit-coupon="${coupon._id}">Edit</button>
        <button type="button" class="mini-btn" data-disable-coupon="${coupon._id}">Disable</button>
        <button type="button" class="mini-btn danger" data-delete-coupon="${coupon._id}">Delete</button>
      </div></td>
    </tr>
  `);
  el.innerHTML = dataTable(["Code", "Details", "Expiry", "Status", "Actions"], rows);
}

export async function loadCoupons() {
  const { coupons } = await req("/coupons/admin/coupons");
  state.coupons = coupons;
  renderCoupons();
}

export function mountCouponsScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar">
      <button type="button" class="primary-btn" data-new-coupon>+ Create coupon</button>
    </div>
    <div class="panel"><div id="couponsTable"></div></div>
  `;
  root.querySelector("[data-new-coupon]")?.addEventListener("click", () => openCouponDrawer());
  root.querySelector("#couponsTable")?.addEventListener("click", async e => {
    const edit = e.target.closest("[data-edit-coupon]");
    const disable = e.target.closest("[data-disable-coupon]");
    const del = e.target.closest("[data-delete-coupon]");
    if (edit) openCouponDrawer(edit.dataset.editCoupon);
    if (disable) {
      await withToast(
        req(`/coupons/admin/coupons/${disable.dataset.disableCoupon}`, { method: "PUT", body: { isActive: false } }),
        "Coupon disabled."
      );
      await loadCoupons();
    }
    if (del) {
      const ok = await confirmModal({ title: "Delete coupon?", message: "This cannot be undone.", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      await withToast(req(`/coupons/admin/coupons/${del.dataset.deleteCoupon}`, { method: "DELETE" }), "Coupon deleted.");
      await loadCoupons();
    }
  });
  if (!state.coupons.length) {
    root.querySelector("#couponsTable").innerHTML = skeletonTable(4, 5);
    loadCoupons().catch(err => toast.error(err.message));
  } else renderCoupons();
}
