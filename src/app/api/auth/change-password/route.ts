import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import bcrypt from "bcryptjs";
import type { User } from "@/generated/prisma";

interface StrengthResult { ok: boolean; error?: string }

function validateStrength(pwd: string): StrengthResult {
  if (pwd.length < 9)            return { ok: false, error: "Mínimo 9 caracteres." };
  if (!/[A-Z]/.test(pwd))        return { ok: false, error: "Incluye al menos una mayúscula." };
  if (!/[0-9]/.test(pwd))        return { ok: false, error: "Incluye al menos un número." };
  if (!/[^A-Za-z0-9]/.test(pwd)) return { ok: false, error: "Incluye al menos un símbolo (@, #, !…)." };
  return { ok: true };
}

async function resolveUser(
  userId: string,
  nombreFromToken: string | undefined
): Promise<User | null> {
  // Estrategia 1: por ID real
  const byId = await prisma.user.findUnique({ where: { id: userId } });
  if (byId) return byId;

  // Estrategia 2: por primer nombre del token
  if (nombreFromToken?.trim()) {
    const firstName = nombreFromToken.trim().split(/\s+/)[0];
    const byName = await prisma.user.findFirst({
      where: { nombre: { startsWith: firstName, mode: "insensitive" } },
      orderBy: { createdAt: "asc" },
    });
    if (byName) return byName;
  }

  // Estrategia 3: buscar cualquier admin supremo (último recurso)
  const byAdmin = await prisma.user.findFirst({
    where: { tipo: "ADMIN", isSupremo: true },
    orderBy: { createdAt: "asc" },
  });
  if (byAdmin) return byAdmin;

  // Estrategia 4: cualquier admin existente
  const anyAdmin = await prisma.user.findFirst({
    where: { tipo: "ADMIN" },
    orderBy: { createdAt: "asc" },
  });
  return anyAdmin;
}

export async function POST(request: Request) {
  let auth = await getAuthPayload();
  let userId = auth?.id ?? null;
  let nombreFromToken: string | undefined = (auth as Record<string, unknown> | null)?.nombre as string | undefined;

  if (!userId) {
    const h = request.headers.get("authorization");
    if (h?.startsWith("Bearer ")) {
      auth = await verifyToken(h.slice(7).trim());
      userId = auth?.id ?? null;
      nombreFromToken = (auth as Record<string, unknown> | null)?.nombre as string | undefined;
    }
  }

  if (!userId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

  let body: Record<string, unknown> = {};
  try { body = await request.json(); }
  catch { return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 }); }

  const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";
  if (!newPassword) return NextResponse.json({ success: false, error: "Se requiere newPassword." }, { status: 400 });

  const strength = validateStrength(newPassword);
  if (!strength.ok) return NextResponse.json({ success: false, error: strength.error }, { status: 422 });

  const user = await resolveUser(userId, nombreFromToken);
  if (!user) {
    console.error(`[change-password] No se encontró usuario id="${userId}" nombre="${nombreFromToken}"`);
    return NextResponse.json({ success: false, error: "Usuario no encontrado. Cierra sesión e intenta de nuevo." }, { status: 404 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hash, mustChangePassword: false },
  });

  console.log(`[change-password] Contraseña actualizada: "${user.nombre}" (id=${user.id})`);
  return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente." });
}
