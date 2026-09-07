import axios from "axios";

// In Docker (nginx reverse-proxies /api) this stays relative. On Vercel
// there's no reverse proxy, so set VITE_API_URL in the Vercel project's
// environment variables to the backend's public HTTPS URL, e.g.
// https://dashboard-api.swag.sa/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

export async function getSystems() {
  const { data } = await api.get("/systems");
  return data;
}

export async function getTotalStock({ codes = "", exact = false } = {}) {
  const { data } = await api.get("/total-stock", { params: { codes, exact } });
  return data;
}

export async function getBranchStock({ codes = "", exact = false } = {}) {
  const { data } = await api.get("/branch-stock", { params: { codes, exact } });
  return data;
}

export async function getReorder({ targetDays = 30, reorderPoint = 10 } = {}) {
  const { data } = await api.get("/reorder", {
    params: { target_days: targetDays, reorder_point: reorderPoint },
  });
  return data;
}

export async function getTransfers() {
  const { data } = await api.get("/transfers");
  return data;
}

export function exportTotalCsv(codes = "") {
  return api.get("/export/total-stock.csv", { params: { codes }, responseType: "blob" });
}
export function exportTotalXlsx(codes = "") {
  return api.get("/export/total-stock.xlsx", { params: { codes }, responseType: "blob" });
}
export function exportBranchCsv(codes = "") {
  return api.get("/export/branch-stock.csv", { params: { codes }, responseType: "blob" });
}
export function exportBranchXlsx(codes = "") {
  return api.get("/export/branch-stock.xlsx", { params: { codes }, responseType: "blob" });
}
export function exportBranchMatrix(codes = "") {
  return api.get("/export/branch-matrix.xlsx", { params: { codes }, responseType: "blob" });
}
export function exportReorderCsv(params = {}) {
  return api.get("/export/reorder.csv", { params, responseType: "blob" });
}
export function exportReorderXlsx(params = {}) {
  return api.get("/export/reorder.xlsx", { params, responseType: "blob" });
}
export function exportTransfersCsv() {
  return api.get("/export/transfers.csv", { responseType: "blob" });
}
export function exportTransfersXlsx() {
  return api.get("/export/transfers.xlsx", { responseType: "blob" });
}

export async function extractCodes(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/extract-codes", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function clearServerCache() {
  const { data } = await api.post("/cache/clear");
  return data;
}

export default api;
