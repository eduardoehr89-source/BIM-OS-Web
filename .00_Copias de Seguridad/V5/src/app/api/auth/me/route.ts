import { NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/comunicaciones-auth";

/** Sesión actual (cookie JWT) para el cliente sin depender solo del SSR. */
export async function GET() {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ id: p.id, nombre: p.nombre, tipo: p.tipo });
}
