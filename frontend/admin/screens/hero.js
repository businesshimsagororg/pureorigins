import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, statusPill, $, $$ } from "../utils.js";
import { dataTable, emptyState, skeletonTable } from "../ui/table.js";
import { openDrawer, closeDrawer, getDrawerEl } from "../ui/drawer.js";
import { confirmModal } from "../ui/modal.js";
import { toast } from "../ui/toast.js";

function heroFormHtml(item = null) {
  const h = item || {};
  return `
    <div class="hero-preview" style="padding: 16px; border-radius: 12px; background: #0a0f0c; color: white; margin-bottom: 24px; border: 1px solid #ffffff15">
      <div style="font-size: 24px; color: ${h.accent || '#C4972F'}">${escapeHtml(h.name || 'Product Name')}</div>
      <div style="font-size: 14px; opacity: 0.6">${escapeHtml(h.sub || 'Sub Name')}</div>
      <div style="font-size: 32px; margin-top: 8px">${h.img || '🌿'} ৳${escapeHtml(h.price || '0')}</div>
    </div>
    <form id="heroDrawerForm" class="form-grid drawer-form">
      <input type="hidden" name="id" value="${escapeHtml(h._id || "")}"/>
      <label>Name (Bengali)<input name="name" value="${escapeHtml(h.name || "")}" required/></label>
      <label>Sub Name (English)<input name="sub" value="${escapeHtml(h.sub || "")}" required/></label>
      <label>Slug<input name="slug" value="${escapeHtml(h.slug || "")}" required/></label>
      <label>Price<input name="price" value="${escapeHtml(h.price || "")}" required/></label>
      <label>Old Price<input name="oldPrice" value="${escapeHtml(h.oldPrice || "")}"/></label>
      <label>Save Amount<input name="save" value="${escapeHtml(h.save || "")}"/></label>
      <label>Unit<input name="unit" value="${escapeHtml(h.unit || "১০০গ্রাম")}"/></label>
      <label>Badge<input name="badge" value="${escapeHtml(h.badge || "")}"/></label>
      <label>Color (Hex)<input name="color" type="color" value="${escapeHtml(h.color || "#1B4332")}"/></label>
      <label>Accent (Hex)<input name="accent" type="color" value="${escapeHtml(h.accent || "#C4972F")}"/></label>
      <label>Emoji/Icon<input name="img" value="${escapeHtml(h.img || "🌿")}"/></label>
      <label>Sort Order<input name="sortOrder" type="number" value="${h.sortOrder ?? 100}"/></label>
      <label class="full">
        <input type="checkbox" name="isSunnah" value="true" ${h.isSunnah ? "checked" : ""}/>
        Is Sunnah Product
      </label>
      <label>Status<select name="isActive">
        <option value="true" ${h.isActive !== false ? "selected" : ""}>Active</option>
        <option value="false" ${h.isActive === false ? "selected" : ""}>Inactive</option>
      </select></label>
    </form>`;
}

function heroPayload(form) {
  const data = Object.fromEntries(new FormData(form));
  return {
    name: data.name,
    sub: data.sub,
    slug: data.slug,
    price: data.price,
    oldPrice: data.oldPrice || "",
    save: data.save || "",
    unit: data.unit || "",
    badge: data.badge || "",
    color: data.color || "#1B4332",
    accent: data.accent || "#C4972F",
    img: data.img || "🌿",
    isSunnah: data.isSunnah === "true",
    sortOrder: Number(data.sortOrder || 100),
    isActive: data.isActive === "true"
  };
}

export function openHeroDrawer(id = null) {
  const item = id ? state.heroItems.find(h => h._id === id) : null;
  openDrawer({
    title: item ? "Edit Hero Item" : "Create Hero Item",
    content: heroFormHtml(item),
    footer: `<button type="button" class="primary-btn" data-save-hero>Save Hero Item</button>`
  });
  const overlay = getDrawerEl();
  
  overlay.querySelector("[data-save-hero]")?.addEventListener("click", async () => {
    const form = overlay.querySelector("#heroDrawerForm");
    const hid = form.elements.id.value;
    await withToast(
      req(hid ? `/admin/hero/${hid}` : "/admin/hero", { method: hid ? "PUT" : "POST", body: heroPayload(form) }),
      "Hero item saved."
    );
    await loadHeroItems();
    closeDrawer();
  });
}

export function renderHeroItems() {
  const el = $("#heroTable");
  if (!el) return;
  if (!state.heroItems.length) {
    el.innerHTML = emptyState("No hero items.", `<button type="button" class="primary-btn" data-new-hero>Add Hero Item</button>`);
    el.querySelector("[data-new-hero]")?.addEventListener("click", () => openHeroDrawer());
    return;
  }
  const rows = state.heroItems.map(h => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:20px">${h.img || ''}</span>
          <div>
            <strong>${escapeHtml(h.name || "-")}</strong><br/>
            <small>${escapeHtml(h.sub || "")}</small>
          </div>
        </div>
      </td>
      <td>৳${h.price}</td>
      <td>${h.sortOrder ?? 100}</td>
      <td>${statusPill(h.isActive ? "Active" : "Inactive", h.isActive)}</td>
      <td><div class="actions">
        <button type="button" class="mini-btn" data-edit-hero="${h._id}">Edit</button>
        <button type="button" class="mini-btn danger" data-delete-hero="${h._id}">Delete</button>
      </div></td>
    </tr>
  `);
  el.innerHTML = dataTable(["Product", "Price", "Order", "Status", "Actions"], rows);
}

export async function loadHeroItems() {
  const { items } = await req("/admin/hero");
  state.heroItems = items;
  renderHeroItems();
}

export function mountHeroScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar"><button type="button" class="primary-btn" data-new-hero>+ Add Hero Item</button></div>
    <div class="panel"><div id="heroTable"></div></div>
  `;
  root.querySelector("[data-new-hero]")?.addEventListener("click", () => openHeroDrawer());
  root.querySelector("#heroTable")?.addEventListener("click", async e => {
    const edit = e.target.closest("[data-edit-hero]");
    const del = e.target.closest("[data-delete-hero]");
    if (edit) openHeroDrawer(edit.dataset.editHero);
    if (del) {
      const ok = await confirmModal({ title: "Delete Hero Item?", message: "Remove this from hero carousel permanently.", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      await withToast(req(`/admin/hero/${del.dataset.deleteHero}`, { method: "DELETE" }), "Hero item deleted.");
      await loadHeroItems();
    }
  });
  if (!state.heroItems.length) {
    root.querySelector("#heroTable").innerHTML = skeletonTable();
    loadHeroItems().catch(e => toast.error(e.message));
  } else renderHeroItems();
}
