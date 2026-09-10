import axios from "axios";

const ADMIN_KEY_STORAGE = "storeops-admin-key";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Admin-only endpoints (product writes, order reads/writes, dashboard) check
// this header server-side. Public storefront calls simply ignore it.
api.interceptors.request.use((config) => {
  const key = localStorage.getItem(ADMIN_KEY_STORAGE);
  if (key) config.headers["x-admin-key"] = key;
  return config;
});

export const AuthAPI = {
  login: (password) => api.post("/auth/login", { password }).then((r) => r.data),
};

export const DashboardAPI = {
  summary: () => api.get("/dashboard/summary").then((r) => r.data),
};

export const ProductAPI = {
  list: (params) => api.get("/products", { params }).then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
  categories: () => api.get("/products/categories").then((r) => r.data),
  create: (data) => api.post("/products", data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  adjustStock: (id, delta) => api.patch(`/products/${id}/stock`, { delta }).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const OrderAPI = {
  list: (params) => api.get("/orders", { params }).then((r) => r.data),
  place: (data) => api.post("/orders", data).then((r) => r.data),
  setStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
  setPayment: (id, paymentStatus) =>
    api.patch(`/orders/${id}/payment`, { paymentStatus }).then((r) => r.data),
};

export const ADMIN_KEY_STORAGE_KEY = ADMIN_KEY_STORAGE;
export default api;
