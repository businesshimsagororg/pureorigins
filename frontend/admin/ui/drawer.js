let activeDrawer = null;
let previousFocus = null;

function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  container.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  });
}

export function closeDrawer() {
  activeDrawer?.remove();
  activeDrawer = null;
  document.body.classList.remove("drawer-open");
  previousFocus?.focus?.();
  previousFocus = null;
}

export function openDrawer({ title, content, footer = "" }) {
  closeDrawer();
  previousFocus = document.activeElement;
  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  overlay.innerHTML = `
    <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
      <header class="drawer-head">
        <h2 id="drawerTitle">${title}</h2>
        <button type="button" class="icon-btn" data-drawer-close aria-label="Close">×</button>
      </header>
      <div class="drawer-body">${content}</div>
      ${footer ? `<footer class="drawer-foot">${footer}</footer>` : ""}
    </div>
  `;
  const close = () => closeDrawer();
  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });
  overlay.querySelector("[data-drawer-close]").addEventListener("click", close);
  document.addEventListener(
    "keydown",
    e => {
      if (e.key === "Escape") close();
    },
    { once: true }
  );
  document.body.appendChild(overlay);
  document.body.classList.add("drawer-open");
  activeDrawer = overlay;
  const panel = overlay.querySelector(".drawer-panel");
  panel?.setAttribute("tabindex", "-1");
  panel?.focus();
  trapFocus(panel || overlay);
  return overlay;
}

export function getDrawerEl() {
  return activeDrawer;
}
