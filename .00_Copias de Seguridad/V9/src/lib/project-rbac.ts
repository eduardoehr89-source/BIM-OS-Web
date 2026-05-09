import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/** Solo cuentas con `tipo === "ADMIN"` en la sesión (incluye Admin Supremo con JWT normalizado). */
export async function requireAdminSession(): Promise<
  { ok: true; userId: string } | { ok: false; response: Response }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const payload = await verifyToken(token);
  if (!payload?.id || payload.tipo !== "ADMIN") {
    return { ok: false, response: new Response("Unauthorized", { status: 403 }) };
  }
  return { ok: true, userId: payload.id };
}
