import { API, ADMIN_TOKEN_KEY } from "./config.js";
import { toast } from "./ui/toast.js";

export async function req(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers,
    body:
      options.body && !isFormData && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function withToast(promise, successMessage) {
  try {
    const result = await promise;
    if (successMessage) toast.success(successMessage);
    return result;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}
