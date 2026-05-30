import { escapeHtml } from "../utils.js";

let activeModal = null;

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

export function closeModal() {
  activeModal?.remove();
  activeModal = null;
  document.body.classList.remove("modal-open");
}

export function confirmModal({ title, message, confirmLabel = "Confirm", danger = false }) {
  return new Promise(resolve => {
    closeModal();
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <h2 id="modalTitle">${escapeHtml(title)}</h2>
        <p class="modal-message">${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button type="button" class="ghost-btn" data-modal-cancel>Cancel</button>
          <button type="button" class="${danger ? "danger-btn" : "primary-btn"}" data-modal-confirm>${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `;
    const onKey = e => {
      if (e.key === "Escape") {
        closeModal();
        resolve(false);
      }
    };
    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        closeModal();
        resolve(false);
      }
    });
    overlay.querySelector("[data-modal-cancel]").addEventListener("click", () => {
      closeModal();
      resolve(false);
    });
    overlay.querySelector("[data-modal-confirm]").addEventListener("click", () => {
      closeModal();
      resolve(true);
    });
    document.addEventListener("keydown", onKey, { once: true });
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");
    activeModal = overlay;
    trapFocus(overlay);
    overlay.querySelector("[data-modal-confirm]")?.focus();
  });
}
