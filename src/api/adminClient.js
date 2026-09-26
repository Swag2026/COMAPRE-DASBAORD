import axios from "axios";

// Deliberately a SEPARATE axios instance from api/client.js. The secret
// settings page has to keep working even when the normal staff login is
// broken (that's the exact scenario it exists for), so it must not share
// the staff auth interceptors/token/logout-on-401 behavior in
// AuthContext.jsx. Same backend, same baseURL, independent auth.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const adminApi = axios.create({ baseURL });

const ADMIN_TOKEN_KEY = "swag_admin_token";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function adminLogin(password) {
  const { data } = await adminApi.post("/admin/login", { password });
  setAdminToken(data.token);
  return data;
}

export async function getAdminConfig() {
  const { data } = await adminApi.get("/admin/config");
  return data;
}

export async function saveAdminConfig(payload) {
  const { data } = await adminApi.put("/admin/config", payload);
  return data;
}

export async function testAdminSystem(key) {
  const { data } = await adminApi.post("/admin/test-system", { key });
  return data;
}

export async function testAdminLogin({ url, db, username, password }) {
  const { data } = await adminApi.post("/admin/test-login", { url, db, username, password });
  return data;
}

export default adminApi;
