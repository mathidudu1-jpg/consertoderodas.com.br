import { NextResponse } from "next/server";
import { supabaseAdmin, isAdmin, mapCustomer, mapOrder, mapAppt } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const sb = supabaseAdmin();
  const [c, o, a] = await Promise.all([
    sb.from("customers").select("*").order("created_at", { ascending: false }),
    sb.from("orders").select("*").order("created_at", { ascending: false }),
    sb.from("appointments").select("*").order("created_at", { ascending: false }),
  ]);
  if (c.error || o.error || a.error) return NextResponse.json({ error: "db" }, { status: 500 });
  return NextResponse.json({
    customers: (c.data || []).map(mapCustomer),
    orders: (o.data || []).map(mapOrder),
    appointments: (a.data || []).map(mapAppt),
  });
}
