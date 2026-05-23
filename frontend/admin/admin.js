const isLocalFrontend = ["127.0.0.1", "localhost", ""].includes(location.hostname);
const API = isLocalFrontend ? "http://localhost:5000/api" : "https://pureorigins.onrender.com/api";
const ADMIN_TOKEN_KEY = "pureorigins_admin_token";
const state = {
  user: null,
  products: [],
  categories: [],
  orders: [],
  coupons: [],
  reviews: [],
  banners: [],
  reports: { sales: null, stock: null, customers: null }
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function money(value = 0) {
  return `৳${Number(value || 0).toLocaleString("bn-BD")}`;
}

function dateText(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" });
}

function shortId(id = "") {
  return `#${String(id).slice(-8).toUpperCase()}`;
}

function setMessage(text = "", type = "") {
  const el = $("#statusMessage");
  el.textContent = text;
  el.className = `message ${type}`;
}

async function req(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData ? { ...(options.headers || {}) } : { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers,
    body: options.body && !isFormData && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  let data = {};
  try { data = await response.json(); } catch { data = {}; }
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

function showLogin(message = "") {
  $("#loginView").classList.remove("hidden");
  $("#adminView").classList.add("hidden");
  $("#loginMessage").textContent = message;
}

function showAdmin() {
  $("#loginView").classList.add("hidden");
  $("#adminView").classList.remove("hidden");
  $("#adminName").textContent = state.user?.name || "Admin";
  $("#adminRole").textContent = `role: ${state.user?.role || "admin"}`;
}

async function requireAdmin() {
  const { user } = await req("/auth/me");
  if (user?.role !== "admin") {
    throw new Error("This account is not an admin.");
  }
  state.user = user;
  showAdmin();
}

async function login(event) {
  event.preventDefault();
  $("#loginMessage").textContent = "";
  const body = Object.fromEntries(new FormData(event.target));
  try {
    const { user, accessToken } = await req("/auth/login", { method: "POST", body });
    if (user?.role !== "admin") {
      await req("/auth/logout", { method: "POST" }).catch(() => {});
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      showLogin("এই অ্যাকাউন্ট অ্যাডমিন নয়।");
      return;
    }
    if (accessToken) sessionStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    state.user = user;
    showAdmin();
    await refreshAll();
  } catch (error) {
    showLogin(error.message);
  }
}

async function logout() {
  await req("/auth/logout", { method: "POST" }).catch(() => {});
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  state.user = null;
  showLogin("Logged out.");
}

function switchScreen(screen) {
  $$(".nav-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.screen === screen));
  $$(".screen").forEach(panel => panel.classList.toggle("active", panel.id === `screen-${screen}`));
  $("#screenTitle").textContent = screen[0].toUpperCase() + screen.slice(1);
  setMessage("");
}

function table(headers, rows) {
  if (!rows.length) return `<div class="empty">No data found.</div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function statusPill(value, active = true) {
  const cls = !active || ["Cancelled", "Returned", "Refunded", "rejected"].includes(value) ? "bad" : ["Pending", "pending"].includes(value) ? "warn" : "ok";
  return `<span class="pill ${cls}">${escapeHtml(value)}</span>`;
}

async function loadProducts() {
  let products = [];
  try {
    ({ products } = await req("/products/admin/products"));
  } catch (error) {
    ({ products } = await req("/products"));
    setMessage("Backend is running an older build, so product list is using public API fallback.", "error");
  }
  state.products = products;
  const map = new Map();
  products.forEach(product => {
    if (product.category?._id) map.set(product.category._id, product.category);
  });
  state.categories = [...map.values()];
  renderCategoryOptions();
  renderProducts();
}

function renderCategoryOptions() {
  const select = $("#productForm select[name='category']");
  select.innerHTML = state.categories.map(category => `<option value="${category._id}">${escapeHtml(category.nameBn || category.nameEn)}</option>`).join("");
}

function renderProducts() {
  const query = $("#productSearch")?.value?.toLowerCase() || "";
  const products = state.products.filter(product => `${product.nameBn} ${product.nameEn} ${product.slug}`.toLowerCase().includes(query));
  $("#productsTable").innerHTML = table(["Product", "Price", "Stock", "Status", "Actions"], products.map(product => `
    <tr>
      <td><strong>${escapeHtml(product.nameBn)}</strong><br/><small>${escapeHtml(product.nameEn)} · ${escapeHtml(product.slug)}</small></td>
      <td>${money(product.price)}<br/><small>Old: ${money(product.oldPrice)}</small></td>
      <td>${product.stockQuantity}<br/><small>Low at ${product.lowStockThreshold}</small></td>
      <td>${statusPill(product.isActive ? "Active" : "Inactive", product.isActive)}</td>
      <td><div class="actions">
        <button class="mini-btn" data-edit-product="${product._id}">Edit</button>
        <button class="mini-btn danger" data-delete-product="${product._id}">Archive</button>
      </div></td>
    </tr>
  `));
}

function splitList(value) {
  return String(value || "").split(",").map(item => item.trim()).filter(Boolean);
}

function productPayload(form) {
  const data = Object.fromEntries(new FormData(form));
  const price = Number(data.price || 0);
  const oldPrice = Number(data.oldPrice || 0);
  const variants = String(data.variants || "").split(/\n+/).map(line => {
    const [weight, unitPrice, stockQuantity, sku] = line.split(",").map(part => part?.trim());
    if (!weight || !unitPrice || !stockQuantity || !sku) return null;
    return { weight, unitPrice: Number(unitPrice), stockQuantity: Number(stockQuantity), sku };
  }).filter(Boolean);
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
    images: String(data.images || "").split(/\n+/).map(item => item.trim()).filter(Boolean),
    variants
  };
}

async function saveProduct(event) {
  event.preventDefault();
  const id = event.target.elements.id.value;
  const payload = productPayload(event.target);
  await req(id ? `/products/admin/products/${id}` : "/products/admin/products", {
    method: id ? "PUT" : "POST",
    body: payload
  });
  resetProductForm();
  await loadProducts();
  setMessage("Product saved.");
}

function resetProductForm() {
  $("#productForm").reset();
  $("#productForm [name='id']").value = "";
  $("#productFormTitle").textContent = "Add Product";
  renderCategoryOptions();
}

function editProduct(id) {
  const product = state.products.find(item => item._id === id);
  if (!product) return;
  const form = $("#productForm");
  form.elements.id.value = product._id;
  form.elements.nameBn.value = product.nameBn || "";
  form.elements.nameEn.value = product.nameEn || "";
  form.elements.slug.value = product.slug || "";
  form.elements.category.value = product.category?._id || product.category || "";
  form.elements.price.value = product.price || 0;
  form.elements.oldPrice.value = product.oldPrice || "";
  form.elements.badge.value = product.badge || "";
  form.elements.stockQuantity.value = product.stockQuantity || 0;
  form.elements.lowStockThreshold.value = product.lowStockThreshold || 10;
  form.elements.isActive.value = String(product.isActive);
  form.elements.shortDescription.value = product.shortDescription || "";
  form.elements.description.value = product.description || "";
  form.elements.benefits.value = (product.benefits || []).join(", ");
  form.elements.ingredients.value = (product.ingredients || []).join(", ");
  form.elements.usageInstructions.value = (product.usageInstructions || []).join(", ");
  form.elements.tags.value = (product.tags || []).join(", ");
  form.elements.images.value = (product.images || []).join("\n");
  form.elements.variants.value = (product.variants || []).map(v => `${v.weight}, ${v.unitPrice}, ${v.stockQuantity}, ${v.sku}`).join("\n");
  $("#productFormTitle").textContent = "Edit Product";
  switchScreen("products");
}

async function uploadImages() {
  const input = $("#productImageUpload");
  if (!input.files.length) return setMessage("Choose image files first.", "error");
  const formData = new FormData();
  [...input.files].forEach(file => formData.append("images", file));
  const { urls } = await req("/uploads/product-images", { method: "POST", body: formData });
  const textarea = $("#productImages");
  textarea.value = [textarea.value, ...urls].filter(Boolean).join("\n");
  input.value = "";
  setMessage("Images uploaded.");
}

async function loadOrders() {
  const q = $("#orderSearch")?.value || "";
  const { orders } = await req(`/orders/admin/orders${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  state.orders = orders;
  renderOrders();
}

function renderOrders(target = "#ordersTable", limit = null) {
  const orders = limit ? state.orders.slice(0, limit) : state.orders;
  $(target).innerHTML = table(["Order", "Customer", "Items", "Total", "Status", "Tracking", "Actions"], orders.map(order => `
    <tr>
      <td><strong>${shortId(order._id)}</strong><br/><small>${dateText(order.createdAt)}</small></td>
      <td>${escapeHtml(order.customerName)}<br/><small>${escapeHtml(order.customerPhone)} · ${escapeHtml(order.district)}</small></td>
      <td>${(order.orderItems || []).map(item => `${escapeHtml(item.productName)} x ${item.quantity}`).join("<br/>")}</td>
      <td>${money(order.total)}<br/><small>${escapeHtml(order.paymentMethod)} · ${escapeHtml(order.paymentStatus)}</small></td>
      <td><select data-order-status="${order._id}">
        ${["Pending","Confirmed","Packed","Shipped","Delivered","Cancelled","Returned","Refunded"].map(status => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}
      </select></td>
      <td><input class="small-input" data-order-track="${order._id}" value="${escapeHtml(order.trackingNumber || "")}" placeholder="Tracking number"/></td>
      <td><button class="mini-btn" data-save-order="${order._id}">Save</button></td>
    </tr>
  `));
}

async function saveOrderStatus(id) {
  const status = $(`[data-order-status="${id}"]`).value;
  const trackingNumber = $(`[data-order-track="${id}"]`).value.trim();
  await req(`/orders/admin/orders/${id}/status`, { method: "PUT", body: { status, trackingNumber, note: "Updated from admin dashboard" } });
  await loadOrders();
  setMessage("Order updated.");
}

async function loadCoupons() {
  const { coupons } = await req("/coupons/admin/coupons");
  state.coupons = coupons;
  renderCoupons();
}

function renderCoupons() {
  $("#couponsTable").innerHTML = table(["Code", "Discount", "Usage", "Expiry", "Status", "Actions"], state.coupons.map(coupon => `
    <tr>
      <td><strong>${escapeHtml(coupon.code)}</strong></td>
      <td>${coupon.type === "percent" ? `${coupon.value}%` : money(coupon.value)}<br/><small>Min: ${money(coupon.minimumOrderAmount)}</small></td>
      <td>${coupon.usedCount || 0}/${coupon.usageLimit || "∞"}<br/><small>User limit: ${coupon.perUserUsageLimit}</small></td>
      <td>${dateText(coupon.expiryDate)}</td>
      <td>${statusPill(coupon.isActive ? "Active" : "Inactive", coupon.isActive)}</td>
      <td><div class="actions">
        <button class="mini-btn" data-edit-coupon="${coupon._id}">Edit</button>
        <button class="mini-btn" data-disable-coupon="${coupon._id}">Disable</button>
        <button class="mini-btn danger" data-delete-coupon="${coupon._id}">Delete</button>
      </div></td>
    </tr>
  `));
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

async function saveCoupon(event) {
  event.preventDefault();
  const id = event.target.elements.id.value;
  await req(id ? `/coupons/admin/coupons/${id}` : "/coupons/admin/coupons", { method: id ? "PUT" : "POST", body: couponPayload(event.target) });
  resetCouponForm();
  await loadCoupons();
  setMessage("Coupon saved.");
}

function resetCouponForm() {
  $("#couponForm").reset();
  $("#couponForm [name='id']").value = "";
  $("#couponFormTitle").textContent = "Create coupon";
}

function editCoupon(id) {
  const coupon = state.coupons.find(item => item._id === id);
  if (!coupon) return;
  const form = $("#couponForm");
  form.elements.id.value = coupon._id;
  form.elements.code.value = coupon.code;
  form.elements.type.value = coupon.type;
  form.elements.value.value = coupon.value;
  form.elements.expiryDate.value = coupon.expiryDate?.slice(0, 10) || "";
  form.elements.usageLimit.value = coupon.usageLimit || 0;
  form.elements.perUserUsageLimit.value = coupon.perUserUsageLimit || 1;
  form.elements.minimumOrderAmount.value = coupon.minimumOrderAmount || 0;
  form.elements.isActive.value = String(coupon.isActive);
  $("#couponFormTitle").textContent = "Edit coupon";
  switchScreen("coupons");
}

async function loadReviews() {
  const status = $("#reviewFilter")?.value || "";
  let reviews = [];
  try {
    ({ reviews } = await req(`/reviews/admin/reviews${status ? `?status=${status}` : ""}`));
  } catch (error) {
    reviews = [];
    setMessage("Review admin API is not available until the backend is restarted with the latest code.", "error");
  }
  state.reviews = reviews;
  renderReviews();
}

function renderReviews() {
  $("#reviewsTable").innerHTML = table(["Product", "Customer", "Rating", "Text", "Status", "Actions"], state.reviews.map(review => `
    <tr>
      <td>${escapeHtml(review.product?.nameBn || review.product)}</td>
      <td>${escapeHtml(review.user?.name || "-")}<br/><small>${escapeHtml(review.user?.phone || review.user?.email || "")}</small></td>
      <td>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</td>
      <td>${escapeHtml(review.text)}</td>
      <td>${statusPill(review.status)}</td>
      <td><div class="actions">
        <button class="mini-btn" data-review-action="${review._id}" data-status="approved">Approve</button>
        <button class="mini-btn danger" data-review-action="${review._id}" data-status="rejected">Reject</button>
      </div></td>
    </tr>
  `));
}

async function reviewAction(id, status) {
  await req(`/reviews/admin/reviews/${id}`, { method: "PUT", body: { status } });
  await loadReviews();
  setMessage("Review updated.");
}

async function loadBanners() {
  const { banners } = await req("/banners/admin/banners");
  state.banners = banners;
  renderBanners();
}

function renderBanners() {
  $("#bannersTable").innerHTML = table(["Banner", "Schedule", "Order", "Status", "Actions"], state.banners.map(banner => `
    <tr>
      <td><strong>${escapeHtml(banner.title || "-")}</strong><br/><small>${escapeHtml(banner.subtitle || "")}</small></td>
      <td>${dateText(banner.startsAt)}<br/><small>to ${dateText(banner.endsAt)}</small></td>
      <td>${banner.sortOrder ?? 100}</td>
      <td>${statusPill(banner.isActive ? "Active" : "Inactive", banner.isActive)}</td>
      <td><div class="actions">
        <button class="mini-btn" data-edit-banner="${banner._id}">Edit</button>
        <button class="mini-btn" data-toggle-banner="${banner._id}">${banner.isActive ? "Disable" : "Enable"}</button>
        <button class="mini-btn danger" data-delete-banner="${banner._id}">Delete</button>
      </div></td>
    </tr>
  `));
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
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

async function saveBanner(event) {
  event.preventDefault();
  const id = event.target.elements.id.value;
  await req(id ? `/banners/admin/banners/${id}` : "/banners/admin/banners", { method: id ? "PUT" : "POST", body: bannerPayload(event.target) });
  resetBannerForm();
  await loadBanners();
  setMessage("Banner saved.");
}

function resetBannerForm() {
  $("#bannerForm").reset();
  $("#bannerForm [name='id']").value = "";
  $("#bannerFormTitle").textContent = "Create banner";
}

function editBanner(id) {
  const banner = state.banners.find(item => item._id === id);
  if (!banner) return;
  const form = $("#bannerForm");
  form.elements.id.value = banner._id;
  form.elements.title.value = banner.title || "";
  form.elements.subtitle.value = banner.subtitle || "";
  form.elements.imageUrl.value = banner.imageUrl || "";
  form.elements.ctaText.value = banner.ctaText || "";
  form.elements.ctaUrl.value = banner.ctaUrl || "";
  form.elements.sortOrder.value = banner.sortOrder ?? 100;
  form.elements.startsAt.value = toDateTimeLocal(banner.startsAt);
  form.elements.endsAt.value = toDateTimeLocal(banner.endsAt);
  form.elements.isActive.value = String(banner.isActive);
  $("#bannerFormTitle").textContent = "Edit banner";
  switchScreen("banners");
}

async function loadReports() {
  const [sales, stock, customers] = await Promise.all([
    req("/admin/reports/sales"),
    req("/admin/reports/stock"),
    req("/admin/reports/customers")
  ]);
  state.reports = { sales, stock, customers };
  renderReports();
}

function renderMetrics(target, metrics) {
  $(target).innerHTML = metrics.map(metric => `<div class="metric"><span>${metric.label}</span><strong>${metric.value}</strong></div>`).join("");
}

function renderReports() {
  const { sales, stock, customers } = state.reports;
  renderMetrics("#reportCards", [
    { label: "Total orders", value: sales?.totalOrders || 0 },
    { label: "Revenue", value: money(sales?.totalRevenue || 0) },
    { label: "Products", value: stock?.totalProducts || 0 },
    { label: "Customers", value: customers?.customers || 0 }
  ]);
  renderMetrics("#customerCards", [
    { label: "Registered customers", value: customers?.customers || 0 },
    { label: "Active carts", value: customers?.activeCarts || 0 },
    { label: "Order customers", value: new Set(state.orders.map(order => order.customerPhone)).size },
    { label: "Delivered orders", value: state.orders.filter(order => order.status === "Delivered").length }
  ]);

  const statusCounts = state.orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(statusCounts));
  $("#salesChart").innerHTML = Object.entries(statusCounts).map(([status, count]) => `
    <div class="bar"><strong>${status}</strong><div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div><span>${count}</span></div>
  `).join("") || `<div class="empty">No order data yet.</div>`;

  $("#stockTable").innerHTML = table(["Product", "Stock", "Threshold"], (stock?.lowStock || []).map(product => `
    <tr><td>${escapeHtml(product.nameBn)}</td><td>${product.stockQuantity}</td><td>${product.lowStockThreshold}</td></tr>
  `));

  const customerMap = new Map();
  state.orders.forEach(order => {
    const key = order.customerPhone || order.customerName;
    const current = customerMap.get(key) || { name: order.customerName, phone: order.customerPhone, orders: 0, spent: 0 };
    current.orders += 1;
    current.spent += order.total || 0;
    customerMap.set(key, current);
  });
  const customersTable = [...customerMap.values()].sort((a, b) => b.spent - a.spent).slice(0, 20);
  $("#customerInsights").innerHTML = table(["Customer", "Orders", "Spent"], customersTable.map(customer => `
    <tr><td>${escapeHtml(customer.name)}<br/><small>${escapeHtml(customer.phone)}</small></td><td>${customer.orders}</td><td>${money(customer.spent)}</td></tr>
  `));
}

function renderDashboard() {
  const revenue = state.orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const lowStock = state.products.filter(product => Number(product.stockQuantity) <= Number(product.lowStockThreshold || 0)).length;
  renderMetrics("#summaryCards", [
    { label: "Orders", value: state.orders.length },
    { label: "Revenue", value: money(revenue) },
    { label: "Products", value: state.products.length },
    { label: "Low stock", value: lowStock }
  ]);
  renderOrders("#recentOrders", 6);
}

async function refreshAll() {
  setMessage("Loading dashboard...");
  await Promise.all([loadProducts(), loadOrders(), loadCoupons(), loadReviews(), loadBanners()]);
  await loadReports();
  renderDashboard();
  setMessage("");
}

async function handleClick(event) {
  const target = event.target.closest("button");
  if (!target) return;
  try {
    if (target.dataset.screen) switchScreen(target.dataset.screen);
    if (target.dataset.jump) switchScreen(target.dataset.jump);
    if (target.id === "logoutBtn") await logout();
    if (target.id === "resetProductForm") resetProductForm();
    if (target.id === "uploadImagesBtn") await uploadImages();
    if (target.dataset.editProduct) editProduct(target.dataset.editProduct);
    if (target.dataset.deleteProduct) { await req(`/products/admin/products/${target.dataset.deleteProduct}`, { method: "DELETE" }); await loadProducts(); setMessage("Product archived."); }
    if (target.dataset.saveOrder) await saveOrderStatus(target.dataset.saveOrder);
    if (target.id === "resetCouponForm") resetCouponForm();
    if (target.dataset.editCoupon) editCoupon(target.dataset.editCoupon);
    if (target.dataset.disableCoupon) { await req(`/coupons/admin/coupons/${target.dataset.disableCoupon}`, { method: "PUT", body: { isActive: false } }); await loadCoupons(); }
    if (target.dataset.deleteCoupon) { await req(`/coupons/admin/coupons/${target.dataset.deleteCoupon}`, { method: "DELETE" }); await loadCoupons(); }
    if (target.dataset.reviewAction) await reviewAction(target.dataset.reviewAction, target.dataset.status);
    if (target.id === "resetBannerForm") resetBannerForm();
    if (target.dataset.editBanner) editBanner(target.dataset.editBanner);
    if (target.dataset.toggleBanner) {
      const banner = state.banners.find(item => item._id === target.dataset.toggleBanner);
      await req(`/banners/admin/banners/${target.dataset.toggleBanner}`, { method: "PUT", body: { isActive: !banner.isActive } });
      await loadBanners();
    }
    if (target.dataset.deleteBanner) { await req(`/banners/admin/banners/${target.dataset.deleteBanner}`, { method: "DELETE" }); await loadBanners(); }
  } catch (error) {
    setMessage(error.message, "error");
  }
}

$("#adminLogin").addEventListener("submit", login);
$("#productForm").addEventListener("submit", saveProduct);
$("#couponForm").addEventListener("submit", saveCoupon);
$("#bannerForm").addEventListener("submit", saveBanner);
$("#productSearch").addEventListener("input", renderProducts);
$("#orderSearch").addEventListener("input", () => loadOrders().catch(error => setMessage(error.message, "error")));
$("#reviewFilter").addEventListener("change", () => loadReviews().catch(error => setMessage(error.message, "error")));
document.addEventListener("click", handleClick);

(async function init() {
  try {
    await requireAdmin();
    await refreshAll();
  } catch {
    showLogin("");
  }
})();
