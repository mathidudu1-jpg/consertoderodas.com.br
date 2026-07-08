import { NextResponse } from "next/server";
import { supabaseAdmin, isAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

async function nextCode(sb: ReturnType<typeof supabaseAdmin>) {
  const { count } = await sb.from("orders").select("*", { count: "exact", head: true });
  const year = new Date().getFullYear();
  return `OS-${year}-${String((count || 0) + 1).padStart(3, "0")}`;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.customerName) return NextResponse.json({ error: "nome obrigatório" }, { status: 400 });
  const sb = supabaseAdmin();

  // acha ou cria o cliente por nome
  let customerId: string | null = null;
  const found = await sb.from("customers").select("id,phone").ilike("name", b.customerName).limit(1).maybeSingle();
  if (found.data) {
    customerId = found.data.id;
    if (b.phone && !found.data.phone) await sb.from("customers").update({ phone: b.phone }).eq("id", customerId);
  } else {
    const ins = await sb.from("customers").insert({ name: b.customerName, phone: b.phone || "", vehicle: b.vehicle || "", plate: b.plate || "" }).select("id").single();
    customerId = ins.data?.id ?? null;
  }

  const due = new Date();
  due.setDate(due.getDate() + (Number(b.dueDays) || 0));
  const { error } = await sb.from("orders").insert({
    code: await nextCode(sb), customer_id: customerId, customer_name: b.customerName,
    vehicle: b.vehicle || "", plate: b.plate || "", wheels: Number(b.wheels) || 1,
    service_id: b.serviceId, stage: 1, status: "aguardando", value: Number(b.value) || 0,
    tech: b.tech || "", due_at: due.toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (b.apptId) await sb.from("appointments").update({ status: "concluido" }).eq("id", b.apptId);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ error: "id" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  const map: Record<string, string> = { customerName: "customer_name", serviceId: "service_id", dueAt: "due_at" };
  for (const k of ["customerName", "vehicle", "plate", "wheels", "serviceId", "stage", "status", "value", "tech", "notes", "dueAt"]) {
    if (k in b) patch[map[k] || k] = b[k];
  }
  const { error } = await supabaseAdmin().from("orders").update(patch).eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id" }, { status: 400 });
  const { error } = await supabaseAdmin().from("orders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
