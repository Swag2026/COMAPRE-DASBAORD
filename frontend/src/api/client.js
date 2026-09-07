import axios from "axios";

const api = axios.create({ baseURL: "/api" });

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

export default api;
