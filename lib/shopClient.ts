"use client";
import type { ShopData } from "./shop";

async function req(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.error || "erro");
  return r.json();
}

export async function apiGetData(): Promise<ShopData> {
  const j = await req("/api/admin/data");
  return { customers: j.customers, orders: j.orders, appointments: j.appointments, version: 2 };
}
export const apiCreateOrder = (body: Record<string, unknown>) => req("/api/admin/order", { method: "POST", body: JSON.stringify(body) });
export const apiUpdateOrder = (body: Record<string, unknown>) => req("/api/admin/order", { method: "PATCH", body: JSON.stringify(body) });
export const apiDeleteOrder = (id: string) => req(`/api/admin/order?id=${encodeURIComponent(id)}`, { method: "DELETE" });
export const apiCreateAppt = (body: Record<string, unknown>) => req("/api/admin/appointment", { method: "POST", body: JSON.stringify(body) });
export const apiUpdateAppt = (id: string, status: string) => req("/api/admin/appointment", { method: "PATCH", body: JSON.stringify({ id, status }) });
export const apiReset = () => req("/api/admin/reset", { method: "POST" });
