import { NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { prisma } from "@/lib/prisma";
import { isValidNipFormat } from "@/lib/nip-validation";

/** Sesión actual (cookie JWT) para el cliente sin depender solo del SSR. */
export async function GET() {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const u = await prisma.user.findUnique({
    where: { id: p.id },
    select: { nip: true },
  });
  const hasNip = Boolean(u?.nip && isValidNipFormat(u.nip));
  return NextResponse.json({ id: p.id, nombre: p.nombre, tipo: p.tipo, hasNip });
}

/** Establecer o cambiar el NIP de eliminación de archivos (4 dígitos). */
export async function PATCH(req: Request) {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const nipRaw = typeof body === "object" && body !== null && "nip" in body ? (body as { nip: unknown }).nip : undefined;
  const nip = typeof nipRaw === "string" ? nipRaw.trim() : "";
  if (!isValidNipFormat(nip)) {
    return NextResponse.json({ error: "El NIP debe ser exactamente 4 dígitos numéricos" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: p.id },
    data: { nip },
  });

  return NextResponse.json({ ok: true, hasNip: true });
}
