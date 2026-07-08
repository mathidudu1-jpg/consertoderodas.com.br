import { NextResponse } from "next/server";
import { supabaseAdmin, isAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.customerName || !b.date || !b.time) return NextResponse.json({ error: "campos" }, { status: 400 });
  const { error } = await supabaseAdmin().from("appointments").insert({
    customer_name: b.customerName, phone: b.phone || "", vehicle: b.vehicle || "",
    service_id: b.serviceId, date: b.date, time: b.time, status: b.status || "confirmado",
    notes: b.notes || "", source: "manual",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.id || !b.status) return NextResponse.json({ error: "id/status" }, { status: 400 });
  const { error } = await supabaseAdmin().from("appointments").update({ status: b.status }).eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
