const listeners = new Map();

export const state = {
  user: null,
  products: [],
  categories: [],
  orders: [],
  coupons: [],
  reviews: [],
  banners: [],
  messages: [],
  reports: { sales: null, stock: null, customers: null },
  currentScreen: "dashboard",
  compactTables: false,
  loading: false
};

export function on(event, handler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(handler);
  return () => listeners.get(event)?.delete(handler);
}

export function emit(event, payload) {
  listeners.get(event)?.forEach(handler => handler(payload));
}

export function setState(patch) {
  Object.assign(state, patch);
  emit("change", patch);
}
