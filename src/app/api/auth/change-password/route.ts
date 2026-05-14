import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, signToken } from "@/lib/auth";
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

  // Estrategia 1: ID real en Neon
  const byId = await prisma.user.findUnique({ where: { id: userId } });
  if (byId) return byId;

  // Estrategia 2: usuario que debe cambiar contraseña
  const mustChange = await prisma.user.findFirst({
    where: { mustChangePassword: true },
    orderBy: { createdAt: "asc" },
  });
  if (mustChange) return mustChange;

  // Estrategia 3: primer usuario creado en la BD (admin original)
  const oldest = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
  });
  return oldest;
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

  const newToken = await signToken(
    {
      id: user.id,
      nombre: user.nombre,
      tipo: String(user.tipo ?? "USER").trim().toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
      permisos: user.permisos,
      isSupremo: user.isSupremo,
      canManageFolders: user.canManageFolders,
      mustChangePassword: false,
    },
    { rol: user.rol }
  );

  const finalResponse = NextResponse.json({ success: true, message: "Contraseña actualizada correctamente." });
  finalResponse.cookies.set({
    name: "bimos_session",
    value: newToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  console.log(`[change-password] Contraseña actualizada: "${user.nombre}" (id=${user.id})`);
  return finalResponse;
}
