import { req, withToast } from "../api.js";
import { state } from "../state.js";
import { escapeHtml, money, statusPill, splitList, debounce, $ } from "../utils.js";
import { dataTable, emptyState, skeletonTable } from "../ui/table.js";
import { openDrawer, closeDrawer, getDrawerEl } from "../ui/drawer.js";
import { confirmModal } from "../ui/modal.js";
import { toast } from "../ui/toast.js";

let editingId = null;
let variantRows = [];

function renderCategoryOptions(selected = "") {
  return state.categories
    .map(
      c =>
        `<option value="${c._id}" ${c._id === selected ? "selected" : ""}>${escapeHtml(c.nameBn || c.nameEn)}</option>`
    )
    .join("");
}

function productPayloadFromForm(form) {
  const data = Object.fromEntries(new FormData(form));
  const price = Number(data.price || 0);
  const oldPrice = Number(data.oldPrice || 0);
  const variants = variantRows.length
    ? variantRows
    : String(data.variantsFallback || "")
        .split(/\n+/)
        .map(line => {
          const [weight, unitPrice, stockQuantity, sku] = line.split(",").map(p => p?.trim());
          if (!weight || !unitPrice || !stockQuantity || !sku) return null;
          return { weight, unitPrice: Number(unitPrice), stockQuantity: Number(stockQuantity), sku };
        })
        .filter(Boolean);

  return {
    nameBn: data.nameBn,
    nameEn: data.nameEn,
    slug: data.slug,
    category: data.category,
    price,
    oldPrice,
    discountPercent: oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0,
    badge: data.badge,
    stockQuantity: Number(data.stockQuantity || 0),
    lowStockThreshold: Number(data.lowStockThreshold || 10),
    isActive: data.isActive === "true",
    shortDescription: data.shortDescription,
    description: data.description,
    benefits: splitList(data.benefits),
    ingredients: splitList(data.ingredients),
    usageInstructions: splitList(data.usageInstructions),
    tags: splitList(data.tags),
    images: String(data.images || "")
      .split(/\n+/)
      .map(i => i.trim())
      .filter(Boolean),
    variants
  };
}

function productFormHtml(product = null) {
  const p = product || {};
  variantRows = (p.variants || []).map(v => ({ ...v }));
  const images = (p.images || []).join("\n");

  return `
    <form id="productDrawerForm" class="form-grid drawer-form">
      <input type="hidden" name="id" value="${escapeHtml(p._id || "")}"/>
      <label>বাংলা নাম<input name="nameBn" value="${escapeHtml(p.nameBn || "")}" required/></label>
      <label>English name<input name="nameEn" value="${escapeHtml(p.nameEn || "")}" required/></label>
      <label>Slug<input name="slug" value="${escapeHtml(p.slug || "")}" placeholder="auto-if-empty"/></label>
      <label>Category<select name="category" required>${renderCategoryOptions(p.category?._id || p.category || "")}</select></label>
      <label>Price<input name="price" type="number" min="0" value="${p.price ?? ""}" required/></label>
      <label>Old price<input name="oldPrice" type="number" min="0" value="${p.oldPrice ?? ""}"/></label>
      <label>Badge<input name="badge" value="${escapeHtml(p.badge || "")}"/></label>
      <label>Stock<input name="stockQuantity" type="number" min="0" value="${p.stockQuantity ?? 0}" required/></label>
      <label>Low stock alert<input name="lowStockThreshold" type="number" min="0" value="${p.lowStockThreshold ?? 10}"/></label>
      <label>Active<select name="isActive"><option value="true" ${p.isActive !== false ? "selected" : ""}>Active</option><option value="false" ${p.isActive === false ? "selected" : ""}>Inactive</option></select></label>
      <label class="full">Short description<input name="shortDescription" value="${escapeHtml(p.shortDescription || "")}"/></label>
      <label class="full">Description<textarea name="description" rows="3" required>${escapeHtml(p.description || "")}</textarea></label>
      <label class="full">Benefits (comma)<input name="benefits" value="${escapeHtml((p.benefits || []).join(", "))}"/></label>
      <label class="full">Ingredients (comma)<input name="ingredients" value="${escapeHtml((p.ingredients || []).join(", "))}"/></label>
      <label class="full">Usage (comma)<input name="usageInstructions" value="${escapeHtml((p.usageInstructions || []).join(", "))}"/></label>
      <label class="full">Tags (comma)<input name="tags" value="${escapeHtml((p.tags || []).join(", "))}"/></label>
      <label class="full">Image URLs<textarea name="images" id="productImages" rows="3">${escapeHtml(images)}</textarea></label>
      <div id="imagePreview" class="image-preview full"></div>
      <div class="upload-row full">
        <input id="productImageUpload" type="file" multiple accept="image/*"/>
        <button type="button" class="secondary-btn" data-upload-images>Upload images</button>
      </div>
      <div class="full">
        <div class="panel-head"><h3>Variants</h3><button type="button" class="mini-btn" data-add-variant>+ Row</button></div>
        <div id="variantEditor"></div>
      </div>
      <input type="hidden" name="variantsFallback"/>
    </form>`;
}

function renderVariantEditor() {
  const el = getDrawerEl()?.querySelector("#variantEditor");
  if (!el) return;
  if (!variantRows.length) {
    el.innerHTML = `<p class="muted">No variants. Click + Row to add.</p>`;
    return;
  }
  el.innerHTML = `
    <table class="variant-table"><thead><tr><th>Weight</th><th>Price</th><th>Stock</th><th>SKU</th><th></th></tr></thead>
    <tbody>${variantRows
      .map(
        (v, i) => `
      <tr>
        <td><input data-v-weight="${i}" value="${escapeHtml(v.weight || "")}"/></td>
        <td><input data-v-price="${i}" type="number" value="${v.unitPrice ?? ""}"/></td>
        <td><input data-v-stock="${i}" type="number" value="${v.stockQuantity ?? ""}"/></td>
        <td><input data-v-sku="${i}" value="${escapeHtml(v.sku || "")}"/></td>
        <td><button type="button" class="mini-btn danger" data-remove-variant="${i}">×</button></td>
      </tr>`
      )
      .join("")}</tbody></table>`;
}

function syncVariantsFromDom() {
  const overlay = getDrawerEl();
  if (!overlay) return;
  variantRows = variantRows.map((v, i) => ({
    weight: overlay.querySelector(`[data-v-weight="${i}"]`)?.value || v.weight,
    unitPrice: Number(overlay.querySelector(`[data-v-price="${i}"]`)?.value || v.unitPrice),
    stockQuantity: Number(overlay.querySelector(`[data-v-stock="${i}"]`)?.value || v.stockQuantity),
    sku: overlay.querySelector(`[data-v-sku="${i}"]`)?.value || v.sku
  }));
}

function renderImagePreview() {
  const overlay = getDrawerEl();
  const urls = (overlay?.querySelector("#productImages")?.value || "")
    .split(/\n+/)
    .map(u => u.trim())
    .filter(Boolean);
  const preview = overlay?.querySelector("#imagePreview");
  if (preview) {
    preview.innerHTML = urls.length
      ? urls.map(u => `<img src="${escapeHtml(u)}" alt="" loading="lazy"/>`).join("")
      : "";
  }
}

export function openProductDrawer(id = null) {
  const product = id ? state.products.find(p => p._id === id) : null;
  editingId = id;

  openDrawer({
    title: product ? "Edit product" : "Add product",
    content: productFormHtml(product),
    footer: `<button type="button" class="primary-btn" data-save-product>Save product</button>`
  });

  const overlay = getDrawerEl();
  renderVariantEditor();
  renderImagePreview();

  overlay.querySelector("#productImages")?.addEventListener("input", renderImagePreview);

  overlay.querySelector("[data-add-variant]")?.addEventListener("click", () => {
    syncVariantsFromDom();
    variantRows.push({ weight: "", unitPrice: 0, stockQuantity: 0, sku: "" });
    renderVariantEditor();
  });

  overlay.addEventListener("click", e => {
    if (e.target.matches("[data-remove-variant]")) {
      syncVariantsFromDom();
      variantRows.splice(Number(e.target.dataset.removeVariant), 1);
      renderVariantEditor();
    }
  });

  overlay.querySelector("[data-upload-images]")?.addEventListener("click", async () => {
    const input = overlay.querySelector("#productImageUpload");
    if (!input?.files?.length) return toast.error("Choose image files first.");
    const formData = new FormData();
    [...input.files].forEach(f => formData.append("images", f));
    const { urls } = await req("/uploads/product-images", { method: "POST", body: formData });
    const ta = overlay.querySelector("#productImages");
    ta.value = [ta.value, ...urls].filter(Boolean).join("\n");
    input.value = "";
    renderImagePreview();
    toast.success("Images uploaded.");
  });

  overlay.querySelector("[data-save-product]")?.addEventListener("click", async () => {
    syncVariantsFromDom();
    const form = overlay.querySelector("#productDrawerForm");
    const pid = form.elements.id.value;
    const payload = productPayloadFromForm(form);
    await withToast(
      req(pid ? `/products/admin/products/${pid}` : "/products/admin/products", {
        method: pid ? "PUT" : "POST",
        body: payload
      }),
      "Product saved."
    );
    await loadProducts();
    closeDrawer();
  });
}

export function renderProducts() {
  const el = $("#productsTable");
  if (!el) return;
  const query = $("#productSearch")?.value?.toLowerCase() || "";
  const products = state.products.filter(p =>
    `${p.nameBn} ${p.nameEn} ${p.slug}`.toLowerCase().includes(query)
  );

  if (!products.length) {
    el.innerHTML = emptyState("No products found.", `<button type="button" class="primary-btn" data-new-product>Add product</button>`);
    el.querySelector("[data-new-product]")?.addEventListener("click", () => openProductDrawer());
    return;
  }

  const rows = products.map(product => `
    <tr>
      <td><strong>${escapeHtml(product.nameBn)}</strong><br/><small>${escapeHtml(product.slug)}</small></td>
      <td>${money(product.price)}</td>
      <td>${product.stockQuantity}</td>
      <td>${statusPill(product.isActive ? "Active" : "Inactive", product.isActive)}</td>
      <td><div class="actions">
        <button type="button" class="mini-btn" data-edit-product="${product._id}">Edit</button>
        <button type="button" class="mini-btn danger" data-delete-product="${product._id}">Archive</button>
      </div></td>
    </tr>
  `);
  el.innerHTML = dataTable(["Product", "Price", "Stock", "Status", "Actions"], rows);
}

export async function loadProducts() {
  let products = [];
  try {
    ({ products } = await req("/products/admin/products"));
  } catch {
    ({ products } = await req("/products"));
    toast.error("Using public product API fallback (older backend).");
  }
  state.products = products;
  const map = new Map();
  products.forEach(p => {
    if (p.category?._id) map.set(p.category._id, p.category);
  });
  state.categories = [...map.values()];
  renderProducts();
}

export function mountProductsScreen(root) {
  root.innerHTML = `
    <div class="screen-toolbar">
      <div class="search-wrap">
        <input id="productSearch" class="search-input" placeholder="Search products"/>
        <button type="button" class="search-clear" data-clear-product-search aria-label="Clear">×</button>
      </div>
      <button type="button" class="primary-btn" data-new-product>+ Add product</button>
    </div>
    <div class="panel">
      <div id="productsTable"></div>
    </div>
  `;

  root.querySelector("[data-new-product]")?.addEventListener("click", () => openProductDrawer());
  root.querySelector("[data-clear-product-search]")?.addEventListener("click", () => {
    root.querySelector("#productSearch").value = "";
    renderProducts();
  });
  root.querySelector("#productSearch")?.addEventListener("input", debounce(renderProducts, 250));

  root.querySelector("#productsTable")?.addEventListener("click", async e => {
    const edit = e.target.closest("[data-edit-product]");
    const del = e.target.closest("[data-delete-product]");
    if (edit) openProductDrawer(edit.dataset.editProduct);
    if (del) {
      const ok = await confirmModal({
        title: "Archive product?",
        message: "This will hide the product from the storefront.",
        confirmLabel: "Archive",
        danger: true
      });
      if (!ok) return;
      await withToast(req(`/products/admin/products/${del.dataset.deleteProduct}`, { method: "DELETE" }), "Product archived.");
      await loadProducts();
    }
  });

  if (!state.products.length) {
    root.querySelector("#productsTable").innerHTML = skeletonTable();
    loadProducts().catch(err => toast.error(err.message));
  } else {
    renderProducts();
  }
}
