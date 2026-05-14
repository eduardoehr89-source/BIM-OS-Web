import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { validateNewPassword } from "@/lib/password-policy";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const newPassword = body.password;

    if (!newPassword || typeof newPassword !== "string" || !validateNewPassword(newPassword)) {
      return NextResponse.json({ success: false, error: "Contraseña inválida" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);

    const user = await prisma.user.update({
      where: { id: userId },
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
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}
