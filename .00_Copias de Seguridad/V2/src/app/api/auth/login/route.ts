import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN requerido" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { pin },
    });

    if (!user) {
      return NextResponse.json({ error: "PIN incorrecto o usuario no encontrado" }, { status: 401 });
    }

    // Crear token JWT
    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      rol: user.rol as "ADMIN" | "USER",
    });

    // Crear respuesta
    const response = NextResponse.json({ success: true, user: { nombre: user.nombre, rol: user.rol } });

    // Setear cookie segura
    response.cookies.set({
      name: "bimos_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
