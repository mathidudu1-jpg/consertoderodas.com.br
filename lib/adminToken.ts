import crypto from "node:crypto";

// Token derivado da senha (env) — usado como valor do cookie httpOnly.
// Sem a senha, não é possível forjar o cookie.
export function adminToken() {
  const secret = process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update(secret + "::rll-admin-v1").digest("hex");
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export const ADMIN_COOKIE = "rll_admin";
