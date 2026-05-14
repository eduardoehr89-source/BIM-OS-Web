import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionPayload, signToken } from "@/lib/auth";
import type { AuthPayload } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { validateNewPassword } from "@/lib/password-policy";
import type { User } from "@/generated/prisma";
import { NUCLEAR_EDUARDO_PLACEHOLDER_USER_ID } from "@/lib/nuclear-eduardo-fallback";

/** Ruta canónica: `src/app/api/auth/change-password/route.ts` (fuera de grupos como `(auth)`). */

function clearBimosSession(response: NextResponse): void {
  response.cookies.set({
    name: "bimos_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Resuelve fila User en Neon: 1) id del JWT, 2) nombre del token (insensible a mayúsculas),
 * 3) primer token del nombre (= "eduardo"/"Eduardo"), 4) si id es el de bypass de emergencia, contains "Eduardo".
 */
async function resolveUserForPasswordChange(payload: AuthPayload): Promise<User | null> {
  const byId = await prisma.user.findUnique({ where: { id: payload.id } });
  if (byId) return byId;

  const nombre = payload.nombre?.trim();
  if (nombre) {
    const byNombreToken = await prisma.user.findFirst({
      where: { nombre: { equals: nombre, mode: "insensitive" } },
    });
    if (byNombreToken) return byNombreToken;

    const first = nombre.toLowerCase().split(/\s+/).filter(Boolean)[0];
    if (first) {
      const byFirst = await prisma.user.findFirst({
        where: {
          OR: [
            { nombre: { equals: first, mode: "insensitive" } },
            { nombre: { startsWith: first, mode: "insensitive" } },
          ],
        },
        orderBy: { nombre: "asc" },
      });
      if (byFirst) return byFirst;
    }
  }

  if (payload.id === NUCLEAR_EDUARDO_PLACEHOLDER_USER_ID) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { nombre: { contains: "eduardo", mode: "insensitive" } },
          { nombre: { contains: "Eduardo", mode: "insensitive" } },
        ],
      },
      orderBy: { nombre: "asc" },
    });
  }

  return null;
}

/** POST /api/auth/change-password */
export async function POST(request: Request) {
  const jsonFail = (status: number, error: string) => {
    const res = NextResponse.json({ success: false, error }, { status });
    clearBimosSession(res);
    return res;
  };

  try {
    const payload = await getSessionPayload();
    if (!payload?.id) {
      return jsonFail(401, "No autorizado");
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const fromNew = body.newPassword;
    const fromLegacy = body.password;
    const newPassword =
      typeof fromNew === "string" ? fromNew.trim() : typeof fromLegacy === "string" ? fromLegacy.trim() : "";

    if (!newPassword || !validateNewPassword(newPassword)) {
      return jsonFail(400, "Contraseña inválida");
    }

    let existing = await resolveUserForPasswordChange(payload);

    if (!existing) {
      return jsonFail(404, "Usuario no encontrado");
    }

    const hashed = bcrypt.hashSync(newPassword, 10);

    const user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        password: hashed,
        mustChangePassword: false,
      },
    });

    const rawTipo = String(user.tipo ?? "")
      .trim()
      .toUpperCase();
    const isAdmin = rawTipo === "ADMIN";

    const token = await signToken(
      {
        id: user.id,
        nombre: user.nombre,
        tipo: isAdmin ? "ADMIN" : "USER",
        permisos: user.permisos,
        isSupremo: user.isSupremo,
        canManageFolders: isAdmin ? true : user.canManageFolders,
        mustChangePassword: false,
      },
      { rol: user.rol }
    );

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "bimos_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[change-password]", error);
    return jsonFail(500, "Error interno");
  }
}
