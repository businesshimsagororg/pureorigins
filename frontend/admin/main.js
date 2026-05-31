import { ADMIN_TOKEN_KEY } from "./config.js";
import { req } from "./api.js";
import { state, setState } from "./state.js";
import { $, $$ } from "./utils.js";
import { toast } from "./ui/toast.js";
import { closeDrawer } from "./ui/drawer.js";
import { closeModal } from "./ui/modal.js";

import { mountDashboardScreen, renderDashboard } from "./screens/dashboard.js";
import { loadProducts, mountProductsScreen } from "./screens/products.js";
import { loadOrders, mountOrdersScreen, setOrderSearchQuery } from "./screens/orders.js";
import { renderProducts } from "./screens/products.js";
import { loadCoupons, mountCouponsScreen } from "./screens/coupons.js";
import { loadReviews, mountReviewsScreen } from "./screens/reviews.js";
import { loadBanners, mountBannersScreen } from "./screens/banners.js";
import { loadReports, mountReportsScreen } from "./screens/reports.js";
import { mountCustomersScreen, renderCustomers } from "./screens/customers.js";
import { loadMessages, mountMessagesScreen } from "./screens/messages.js";
import { loadHeroItems, mountHeroScreen } from "./screens/hero.js";

const SCREENS = {
  dashboard: { title: "Dashboard", mount: mountDashboardScreen },
  products: { title: "Products", mount: mountProductsScreen },
  orders: { title: "Orders", mount: mountOrdersScreen },
  coupons: { title: "Coupons", mount: mountCouponsScreen },
  reviews: { title: "Reviews", mount: mountReviewsScreen },
  banners: { title: "Banners", mount: mountBannersScreen },
  hero: { title: "Hero Settings", mount: mountHeroScreen },
  reports: { title: "Reports", mount: mountReportsScreen },
  customers: { title: "Customers", mount: mountCustomersScreen },
  messages: { title: "Messages", mount: mountMessagesScreen }
};

const NAV = [
  { type: "heading", label: "Overview" },
  { id: "dashboard", label: "Dashboard", icon: "◉" },
  { type: "heading", label: "Catalog & sales" },
  { id: "products", label: "Products", icon: "🌿" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "coupons", label: "Coupons", icon: "🏷" },
  { type: "heading", label: "Content & customers" },
  { id: "hero", label: "Hero Settings", icon: "✨" },
  { id: "reviews", label: "Reviews", icon: "★" },
  { id: "banners", label: "Banners", icon: "🖼" },
  { id: "customers", label: "Customers", icon: "👤" },
  { id: "messages", label: "Messages", icon: "✉" },
  { type: "heading", label: "Insights" },
  { id: "reports", label: "Reports", icon: "📊" }
];

function showLogin(message = "") {
  $("#loginView")?.classList.remove("hidden");
  $("#adminView")?.classList.add("hidden");
  const msg = $("#loginMessage");
  if (msg) {
    msg.textContent = message;
    msg.className = message ? "login-message error" : "login-message";
  }
}

function showAdmin() {
  $("#loginView")?.classList.add("hidden");
  $("#adminView")?.classList.remove("hidden");
  $("#adminName").textContent = state.user?.name || "Admin";
  $("#adminRole").textContent = `role: ${state.user?.role || "admin"}`;
}

async function requireAdmin() {
  const { user } = await req("/auth/me");
  if (user?.role !== "admin") throw new Error("This account is not an admin.");
  setState({ user });
  showAdmin();
}

async function login(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  btn?.setAttribute("disabled", "true");
  btn?.classList.add("loading");
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
    setState({ user });
    showAdmin();
    await refreshAll({ silent: true });
    const hash = location.hash.replace("#", "");
    switchScreen(hash && SCREENS[hash] ? hash : "dashboard");
    toast.success("Welcome back.");
  } catch (error) {
    showLogin(error.message);
  } finally {
    btn?.removeAttribute("disabled");
    btn?.classList.remove("loading");
  }
}

async function logout() {
  await req("/auth/logout", { method: "POST" }).catch(() => {});
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  setState({ user: null });
  closeDrawer();
  closeModal();
  showLogin("Logged out.");
}

async function mountScreen(screen) {
  const root = $(`#screen-${screen}`);
  if (!root) return;
  root.innerHTML = `<div class="screen-loading">Loading…</div>`;
  const def = SCREENS[screen];
  await def.mount(root);
}

export function switchScreen(screen) {
  if (!SCREENS[screen]) screen = "dashboard";
  setState({ currentScreen: screen });
  location.hash = screen;

  $$(".nav-tab").forEach(tab => {
    const active = tab.dataset.screen === screen;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-current", active ? "page" : "false");
  });

  $$(".screen").forEach(panel => panel.classList.toggle("active", panel.id === `screen-${screen}`));
  $("#screenTitle").textContent = SCREENS[screen].title;
  document.title = `${SCREENS[screen].title} · PureOrigins Admin`;

  closeDrawer();
  closeMobileNav();
  mountScreen(screen);

  if (screen === "dashboard" && state.orders.length) renderDashboard();
  if (screen === "customers" && state.reports.customers) renderCustomers();
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  $("#navOverlay")?.classList.add("hidden");
}

function openMobileNav() {
  document.body.classList.add("nav-open");
  $("#navOverlay")?.classList.remove("hidden");
}

function toggleSidebarCollapse() {
  document.body.classList.toggle("sidebar-collapsed");
  try {
    localStorage.setItem("admin_sidebar_collapsed", document.body.classList.contains("sidebar-collapsed") ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export async function refreshAll({ silent = false } = {}) {
  if (!silent) toast.info("Syncing data…");
  await Promise.all([loadProducts(), loadOrders(), loadCoupons(), loadReviews(), loadBanners(), loadMessages(), loadHeroItems()]);
  await loadReports();
  if (!silent) toast.success("Dashboard updated.");
}

function bindShell() {
  const nav = $("#adminNav");
  nav.innerHTML = NAV.map(item => {
    if (item.type === "heading") {
      return `<p class="nav-heading">${item.label}</p>`;
    }
    return `<button type="button" class="nav-tab" data-screen="${item.id}" title="${item.label}"><span class="nav-icon" aria-hidden="true">${item.icon}</span><span class="nav-label">${item.label}</span></button>`;
  }).join("");

  nav.addEventListener("click", e => {
    const tab = e.target.closest("[data-screen]");
    if (tab) switchScreen(tab.dataset.screen);
  });

  $("#menuBtn")?.addEventListener("click", openMobileNav);
  $("#navOverlay")?.addEventListener("click", closeMobileNav);
  $("#sidebarCollapse")?.addEventListener("click", toggleSidebarCollapse);
  $("#logoutBtn")?.addEventListener("click", () => logout().catch(e => toast.error(e.message)));
  $("#compactTables")?.addEventListener("change", e => {
    setState({ compactTables: e.target.checked });
    document.body.classList.toggle("compact-tables", e.target.checked);
  });

  document.addEventListener("click", e => {
    if (e.target.closest("[data-jump]")) {
      switchScreen(e.target.closest("[data-jump]").dataset.jump);
    }
  });

  document.addEventListener("admin:navigate", e => {
    const { screen, orderSearch } = e.detail || {};
    if (screen) switchScreen(screen);
    if (orderSearch) {
      setTimeout(() => {
        const input = $("#orderSearch");
        if (input) {
          input.value = orderSearch;
          loadOrders().catch(err => toast.error(err.message));
        }
      }, 100);
    }
  });

  $("#togglePassword")?.addEventListener("click", () => {
    const input = $("#loginPassword");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
  });

  try {
    if (localStorage.getItem("admin_sidebar_collapsed") === "1") {
      document.body.classList.add("sidebar-collapsed");
    }
  } catch {
    /* ignore */
  }

  const globalSearch = $("#globalSearch");
  document.addEventListener("keydown", e => {
    if (e.key !== "/" || !state.user) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
    e.preventDefault();
    globalSearch?.focus();
  });

  globalSearch?.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const q = globalSearch.value.trim();
    if (!q) return;
    const screen = q.replace(/\D/g, "").length >= 6 ? "orders" : "products";
    switchScreen(screen);
    setTimeout(() => {
      if (screen === "orders") {
        setOrderSearchQuery(q);
        const input = $("#orderSearch");
        if (input) input.value = q;
        loadOrders().catch(err => toast.error(err.message));
      } else {
        const input = $("#productSearch");
        if (input) input.value = q;
        renderProducts();
      }
      globalSearch.value = "";
    }, 120);
  });
}

function initHashRouting() {
  window.addEventListener("hashchange", () => {
    const screen = location.hash.replace("#", "");
    if (SCREENS[screen] && state.user) switchScreen(screen);
  });
}

(async function init() {
  bindShell();
  initHashRouting();
  $("#adminLogin")?.addEventListener("submit", login);

  try {
    await requireAdmin();
    await refreshAll({ silent: true });
    const hash = location.hash.replace("#", "");
    switchScreen(hash && SCREENS[hash] ? hash : "dashboard");
  } catch {
    showLogin("");
  }
})();
