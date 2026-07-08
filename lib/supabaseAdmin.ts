import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { adminToken, safeEqual, ADMIN_COOKIE } from "./adminToken";

// Client com service_role — SOMENTE no servidor. Bypassa RLS.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) throw new Error("Supabase env não configurada");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function isAdmin() {
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value || "";
  return !!cookie && safeEqual(cookie, adminToken());
}

/* ---- mapeamento DB (snake) <-> app (camel) ---- */
export type DBOrder = {
  id: string; code: string; customer_id: string | null; customer_name: string;
  vehicle: string; plate: string; wheels: number; service_id: string; stage: number;
  status: string; value: number; tech: string; notes: string | null; created_at: string; due_at: string | null;
};
export type DBAppt = {
  id: string; customer_name: string; phone: string; vehicle: string; service_id: string;
  date: string; time: string; status: string; notes: string | null; source: string; created_at: string;
};
export type DBCustomer = { id: string; name: string; phone: string; vehicle: string; plate: string; created_at: string };

export const mapOrder = (o: DBOrder) => ({
  id: o.id, code: o.code, customerId: o.customer_id || "", customerName: o.customer_name,
  vehicle: o.vehicle || "", plate: o.plate || "", wheels: o.wheels, serviceId: o.service_id,
  stage: o.stage, status: o.status, value: Number(o.value), tech: o.tech || "",
  notes: o.notes || "", createdAt: o.created_at, dueAt: o.due_at || o.created_at,
});
export const mapAppt = (a: DBAppt) => ({
  id: a.id, customerName: a.customer_name, phone: a.phone || "", vehicle: a.vehicle || "",
  serviceId: a.service_id, date: a.date, time: a.time, status: a.status,
  notes: a.notes || "", source: a.source, createdAt: a.created_at,
});
export const mapCustomer = (c: DBCustomer) => ({
  id: c.id, name: c.name, phone: c.phone || "", vehicle: c.vehicle || "", plate: c.plate || "", since: c.created_at,
});
