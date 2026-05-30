let activeDrawer = null;
let previousFocus = null;

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
  overlay.querySelector(".drawer-panel")?.focus();
  return overlay;
}

export function getDrawerEl() {
  return activeDrawer;
}
