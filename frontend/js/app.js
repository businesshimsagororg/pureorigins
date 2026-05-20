const API = "http://localhost:5000/api";

async function req(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function loadProducts(q = "") {
  const data = await req(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const el = document.getElementById("products");
  if (!el) return;
  el.innerHTML = data.products.map(p => `
    <article class="product">
      <h3>${p.nameBn}</h3>
      <p>${p.nameEn}</p>
      <p>৳${p.price}</p>
      <small>স্টক: ${p.stockQuantity}</small><br/>
      <button data-id="${p._id}" data-v="${p.variants?.[0]?.weight || "default"}">কার্টে যোগ করুন</button>
    </article>
  `).join("");
  el.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id, btn.dataset.v)));
}

async function loadBanners() {
  const { banners } = await req("/banners");
  const el = document.getElementById("banners");
  if (!el) return;
  el.innerHTML = banners.map(b => `<div class="card"><strong>${b.title || "স্পেশাল অফার"}</strong><p>${b.subtitle || ""}</p></div>`).join("");
}

async function addToCart(productId, variantWeight) {
  await req("/cart/items", { method: "POST", body: JSON.stringify({ productId, variantWeight, quantity: 1 }) });
  await loadCart();
}

async function loadCart() {
  const { cart } = await req("/cart");
  const el = document.getElementById("cart");
  if (!el) return;
  el.innerHTML = cart.items.map(i => `<div class="card">${i.product?.nameBn || i.product} (${i.variantWeight}) x ${i.quantity} <button data-id="${i._id}">রিমুভ</button></div>`).join("") || "কার্ট খালি";
  el.querySelectorAll("button").forEach(b => b.addEventListener("click", async () => {
    await req(`/cart/items/${b.dataset.id}`, { method: "DELETE" });
    await loadCart();
  }));
}

async function register(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  await req("/auth/register", { method: "POST", body: JSON.stringify(f) });
  alert("রেজিস্টার সফল");
}

async function login(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  await req("/auth/login", { method: "POST", body: JSON.stringify(f) });
  alert("লগইন সফল");
  await loadCart();
}

async function checkout(e) {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target));
  const data = await req("/orders", { method: "POST", body });
  const msg = document.getElementById("checkoutMsg");
  if (msg) msg.textContent = `Order ID: ${data.order._id}\nTotal: ৳${data.order.total}`;
  await loadCart();
}

async function myOrders() {
  const { orders } = await req("/orders/me");
  const el = document.getElementById("myOrders");
  if (el) el.textContent = JSON.stringify(orders, null, 2);
}

function on(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}

on("searchBtn", "click", () => loadProducts(document.getElementById("search")?.value || ""));
on("loadCartBtn", "click", loadCart);
on("registerForm", "submit", register);
on("loginForm", "submit", login);
on("checkoutForm", "submit", checkout);
on("myOrdersBtn", "click", myOrders);

window.PureOriginsAPI = { req, loadProducts, loadBanners, addToCart, loadCart, checkout, myOrders };

if (document.getElementById("banners")) loadBanners();
if (document.getElementById("products")) loadProducts();
