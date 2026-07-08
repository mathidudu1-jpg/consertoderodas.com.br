import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

// Rota PÚBLICA — recebe agendamentos do site e grava no Supabase.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.customerName || "").trim();
  const phone = String(b.phone || "").trim();
  if (!name || !phone || !b.serviceId || !b.date || !b.time) {
    return NextResponse.json({ error: "campos" }, { status: 400 });
  }
  const { error } = await supabaseAdmin().from("appointments").insert({
    customer_name: name.slice(0, 120),
    phone: phone.slice(0, 40),
    vehicle: String(b.vehicle || "").slice(0, 120),
    service_id: String(b.serviceId).slice(0, 40),
    date: b.date,
    time: String(b.time).slice(0, 10),
    notes: String(b.notes || "").slice(0, 500),
    status: "pendente",
    source: "site",
  });
  if (error) return NextResponse.json({ error: "db" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
