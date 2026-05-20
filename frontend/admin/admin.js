const API = "http://localhost:5000/api";
const out = document.getElementById("out");
const req = async (path, options = {}) => {
  const r = await fetch(`${API}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...options });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || "Request failed");
  return j;
};

document.getElementById("adminLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target));
  try { await req("/auth/login", { method: "POST", body: JSON.stringify(body) }); out.textContent = "Admin login successful"; } catch (e2) { out.textContent = e2.message; }
});

document.getElementById("loadOrders").addEventListener("click", async () => { try { const d = await req("/orders/admin/orders"); out.textContent = JSON.stringify(d.orders, null, 2); } catch (e) { out.textContent = e.message; } });
document.getElementById("loadSales").addEventListener("click", async () => { try { const d = await req("/admin/reports/sales"); out.textContent = JSON.stringify(d, null, 2); } catch (e) { out.textContent = e.message; } });