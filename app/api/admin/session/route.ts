import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminToken, safeEqual, ADMIN_COOKIE } from "@/lib/adminToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value || "";
  const authed = !!cookie && safeEqual(cookie, adminToken());
  return NextResponse.json({ authed });
}
