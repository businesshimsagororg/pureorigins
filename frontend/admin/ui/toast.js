const STACK_ID = "toastStack";

function ensureStack() {
  let stack = document.getElementById(STACK_ID);
  if (!stack) {
    stack = document.createElement("div");
    stack.id = STACK_ID;
    stack.className = "toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  return stack;
}

function show(message, type = "info") {
  const stack = ensureStack();
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.textContent = message;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 4200);
}

export const toast = {
  success: msg => show(msg, "success"),
  error: msg => show(msg, "error"),
  info: msg => show(msg, "info")
};
