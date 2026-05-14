import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, signToken, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

function validatePassword(password: string) {
  if (password.length < 9) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const newPassword = body.password;

    if (!newPassword || typeof newPassword !== "string" || !validatePassword(newPassword)) {
      return NextResponse.json({ success: false, error: "Contraseña inválida" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    // Update the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: bcrypt.hashSync(newPassword, 10),
        mustChangePassword: false,
      },
    });

    // Sign a new token
    const cookieStore = await cookies();
    const currentToken = cookieStore.get("bimos_session")?.value;
    let oldPayload = null;
    if (currentToken) {
      oldPayload = await verifyToken(currentToken);
    }

    const tipo = oldPayload?.tipo || "USER";
    const permisos = oldPayload?.permisos || user.permisos;
    const isSupremo = oldPayload?.isSupremo || user.isSupremo;
    const canManageFolders = oldPayload?.canManageFolders || user.canManageFolders;

    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      tipo,
      permisos,
      isSupremo,
      canManageFolders,
      mustChangePassword: false,
    });

    const response = NextResponse.json({ success: true });
    
    // Set the new session cookie
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
    console.error("[update-password]", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}
