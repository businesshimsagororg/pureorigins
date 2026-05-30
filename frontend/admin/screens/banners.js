import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, dateText, statusPill, toDateTimeLocal, $ } from "../utils.js";
import { dataTable, emptyState, skeletonTable } from "../ui/table.js";
import { openDrawer, closeDrawer, getDrawerEl } from "../ui/drawer.js";
import { confirmModal } from "../ui/modal.js";
import { toast } from "../ui/toast.js";

function bannerPreview(b) {
  if (!b?.imageUrl) return `<div class="banner-preview empty-preview">No image URL</div>`;
  return `<div class="banner-preview" style="background-image:url('${escapeHtml(b.imageUrl)}')"><div class="banner-preview-text"><strong>${escapeHtml(b.title || "")}</strong><p>${escapeHtml(b.subtitle || "")}</p>${b.ctaText ? `<span class="pill ok">${escapeHtml(b.ctaText)}</span>` : ""}</div></div>`;
}

function bannerFormHtml(banner = null) {
  const b = banner || {};
  return `
    ${bannerPreview(b)}
    <form id="bannerDrawerForm" class="form-grid drawer-form">
      <input type="hidden" name="id" value="${escapeHtml(b._id || "")}"/>
      <label>Title<input name="title" value="${escapeHtml(b.title || "")}" required/></label>
      <label>Sort order<input name="sortOrder" type="number" value="${b.sortOrder ?? 100}"/></label>
      <label class="full">Subtitle<input name="subtitle" value="${escapeHtml(b.subtitle || "")}"/></label>
      <label class="full">Image URL<input name="imageUrl" value="${escapeHtml(b.imageUrl || "")}"/></label>
      <label>CTA text<input name="ctaText" value="${escapeHtml(b.ctaText || "")}"/></label>
      <label>CTA URL<input name="ctaUrl" value="${escapeHtml(b.ctaUrl || "")}"/></label>
      <label>Starts at<input name="startsAt" type="datetime-local" value="${toDateTimeLocal(b.startsAt)}"/></label>
      <label>Ends at<input name="endsAt" type="datetime-local" value="${toDateTimeLocal(b.endsAt)}"/></label>
      <label>Active<select name="isActive"><option value="true" ${b.isActive !== false ? "selected" : ""}>Active</option><option value="false" ${b.isActive === false ? "selected" : ""}>Inactive</option></select></label>
    </form>`;
}

function bannerPayload(form) {
  const data = Object.fromEntries(new FormData(form));
  return {
    title: data.title,
    subtitle: data.subtitle,
    imageUrl: data.imageUrl,
    ctaText: data.ctaText,
    ctaUrl: data.ctaUrl,
    sortOrder: Number(data.sortOrder || 100),
    startsAt: data.startsAt || null,
    endsAt: data.endsAt || null,
    isActive: data.isActive === "true"
  };
}

export function openBannerDrawer(id = null) {
  const banner = id ? state.banners.find(b => b._id === id) : null;
  openDrawer({
    title: banner ? "Edit banner" : "Create banner",
    content: bannerFormHtml(banner),
    footer: `<button type="button" class="primary-btn" data-save-banner>Save banner</button>`
  });
  const overlay = getDrawerEl();
  const updatePreview = () => {
    const form = overlay.querySelector("#bannerDrawerForm");
    const data = Object.fromEntries(new FormData(form));
    const prev = overlay.querySelector(".banner-preview");
    if (prev) prev.outerHTML = bannerPreview(data);
  };
  overlay.querySelector("#bannerDrawerForm")?.addEventListener("input", updatePreview);
  overlay.querySelector("[data-save-banner]")?.addEventListener("click", async () => {
    const form = overlay.querySelector("#bannerDrawerForm");
    const bid = form.elements.id.value;
    await withToast(
      req(bid ? `/banners/admin/banners/${bid}` : "/banners/admin/banners", { method: bid ? "PUT" : "POST", body: bannerPayload(form) }),
      "Banner saved."
    );
    await loadBanners();
    closeDrawer();
  });
}

export function renderBanners() {
  const el = $("#bannersTable");
  if (!el) return;
  if (!state.banners.length) {
    el.innerHTML = emptyState("No banners.", `<button type="button" class="primary-btn" data-new-banner>Add banner</button>`);
    el.querySelector("[data-new-banner]")?.addEventListener("click", () => openBannerDrawer());
    return;
  }
  const rows = state.banners.map(banner => `
    <tr>
      <td><strong>${escapeHtml(banner.title || "-")}</strong><br/><small>${escapeHtml(banner.subtitle || "")}</small></td>
      <td>${dateText(banner.startsAt)} — ${dateText(banner.endsAt)}</td>
      <td>${banner.sortOrder ?? 100}</td>
      <td>${statusPill(banner.isActive ? "Active" : "Inactive", banner.isActive)}</td>
      <td><div class="actions">
        <button type="button" class="mini-btn" data-edit-banner="${banner._id}">Edit</button>
        <button type="button" class="mini-btn" data-toggle-banner="${banner._id}">${banner.isActive ? "Disable" : "Enable"}</button>
        <button type="button" class="mini-btn danger" data-delete-banner="${banner._id}">Delete</button>
      </div></td>
    </tr>
  `);
  el.innerHTML = dataTable(["Banner", "Schedule", "Order", "Status", "Actions"], rows);
}

export async function loadBanners() {
  const { banners } = await req("/banners/admin/banners");
  state.banners = banners;
  renderBanners();
}

export function mountBannersScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar"><button type="button" class="primary-btn" data-new-banner>+ Add banner</button></div>
    <div class="panel"><div id="bannersTable"></div></div>
  `;
  root.querySelector("[data-new-banner]")?.addEventListener("click", () => openBannerDrawer());
  root.querySelector("#bannersTable")?.addEventListener("click", async e => {
    const edit = e.target.closest("[data-edit-banner]");
    const toggle = e.target.closest("[data-toggle-banner]");
    const del = e.target.closest("[data-delete-banner]");
    if (edit) openBannerDrawer(edit.dataset.editBanner);
    if (toggle) {
      const banner = state.banners.find(b => b._id === toggle.dataset.toggleBanner);
      await withToast(
        req(`/banners/admin/banners/${toggle.dataset.toggleBanner}`, { method: "PUT", body: { isActive: !banner.isActive } }),
        "Banner updated."
      );
      await loadBanners();
    }
    if (del) {
      const ok = await confirmModal({ title: "Delete banner?", message: "Remove this banner permanently.", confirmLabel: "Delete", danger: true });
      if (!ok) return;
      await withToast(req(`/banners/admin/banners/${del.dataset.deleteBanner}`, { method: "DELETE" }), "Banner deleted.");
      await loadBanners();
    }
  });
  if (!state.banners.length) {
    root.querySelector("#bannersTable").innerHTML = skeletonTable();
    loadBanners().catch(e => toast.error(e.message));
  } else renderBanners();
}
