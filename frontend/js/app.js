const API = "http://localhost:5000/api";

async function req(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) throw new Error((await res.json()).message || "Request failed");
  return res.json();
}

async function loadProducts(q = "") {
  const data = await req(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const el = document.getElementById("products");
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
  el.innerHTML = banners.map(b => `<div class="card"><strong>${b.title || "স্পেশাল অফার"}</strong><p>${b.subtitle || ""}</p></div>`).join("");
}

async function addToCart(productId, variantWeight) {
  await req("/cart/items", { method: "POST", body: JSON.stringify({ productId, variantWeight, quantity: 1 }) });
  await loadCart();
}

async function loadCart() {
  const { cart } = await req("/cart");
  const el = document.getElementById("cart");
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
  const data = await req("/orders", { method: "POST", body: JSON.stringify(body) });
  document.getElementById("checkoutMsg").textContent = `Order ID: ${data.order._id}\nTotal: ৳${data.order.total}`;
  await loadCart();
}

async function myOrders() {
  const { orders } = await req("/orders/me");
  document.getElementById("myOrders").textContent = JSON.stringify(orders, null, 2);
}

document.getElementById("searchBtn").addEventListener("click", () => loadProducts(document.getElementById("search").value));
document.getElementById("loadCartBtn").addEventListener("click", loadCart);
document.getElementById("registerForm").addEventListener("submit", register);
document.getElementById("loginForm").addEventListener("submit", login);
document.getElementById("checkoutForm").addEventListener("submit", checkout);
document.getElementById("myOrdersBtn").addEventListener("click", myOrders);

loadBanners();
loadProducts();
