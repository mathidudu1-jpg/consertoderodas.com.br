import { NextResponse } from "next/server";
import { supabaseAdmin, isAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

// Zera todas as tabelas (apenas admin).
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const sb = supabaseAdmin();
  await sb.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("appointments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("customers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  return NextResponse.json({ ok: true });
}
