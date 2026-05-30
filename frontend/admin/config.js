const ADMIN_TOKEN_KEY = "pureorigins_admin_token";
const API_STORAGE_KEY = "pureorigins_api_override";

export { ADMIN_TOKEN_KEY, API_STORAGE_KEY };

export function resolveApiBase() {
  const meta = document.querySelector('meta[name="pureorigins-api"]')?.content?.trim();
  if (meta) return meta.replace(/\/$/, "");

  const params = new URLSearchParams(location.search);
  const queryApi = params.get("api");
  if (queryApi) {
    const normalized = queryApi.replace(/\/$/, "");
    try {
      localStorage.setItem(API_STORAGE_KEY, normalized);
    } catch {
      /* ignore */
    }
    return normalized;
  }

  try {
    const stored = localStorage.getItem(API_STORAGE_KEY);
    if (stored) return stored.replace(/\/$/, "");
  } catch {
    /* ignore */
  }

  const host = location.hostname;
  if (["127.0.0.1", "localhost", ""].includes(host)) {
    return "http://localhost:5000/api";
  }

  if (location.origin && !location.origin.startsWith("file:")) {
    return `${location.origin}/api`;
  }

  return "https://pureorigins.onrender.com/api";
}

export const API = resolveApiBase();
