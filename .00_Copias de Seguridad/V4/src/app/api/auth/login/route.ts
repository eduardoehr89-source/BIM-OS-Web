import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

/** Si la BD quedó sin usuarios (p. ej. tras db push), garantiza un admin por defecto. */
async function ensureBootstrapAdminIfEmpty(): Promise<void> {
  const count = await prisma.user.count();
  if (count > 0) return;

  await prisma.user.create({
    data: {
      nombre: "Eduardo",
      pin: "3350",
      tipo: "ADMIN",
      isSupremo: true,
      rol: "BIM MANAGER",
    },
  });
  console.log("[auth/login] Auto-seed: base sin usuarios; creado administrador Eduardo (PIN 3350).");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { pin } = body;

    if (!pin || String(pin).trim() === "") {
      return NextResponse.json({ error: "PIN requerido" }, { status: 400 });
    }

    const pinTrim = String(pin).trim();

    if (pinTrim === "3350") {
      try {
        await ensureBootstrapAdminIfEmpty();
      } catch (seedErr) {
        console.log("[auth/login] auto-seed error", seedErr);
      }

      let adminUser = await prisma.user.findFirst({ where: { pin: "3350" } });
      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: { nombre: "Eduardo", pin: "3350", tipo: "ADMIN", isSupremo: true, rol: "BIM MANAGER" },
        });
      } else if (!adminUser.isSupremo) {
        // Garantizar que Eduardo siempre tenga isSupremo=true
        adminUser = await prisma.user.update({
          where: { id: adminUser.id },
          data: { isSupremo: true },
        });
      }

      const token = await signToken(
        { id: adminUser.id, nombre: adminUser.nombre, tipo: "ADMIN", permisos: adminUser.permisos, isSupremo: adminUser.isSupremo },
        { rol: adminUser.rol }
      );
      const response = NextResponse.json({
        success: true,
        user: { nombre: adminUser.nombre, tipo: "ADMIN", rol: adminUser.rol, permisos: adminUser.permisos },
      });
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
    }

    const user = await prisma.user.findFirst({
      where: { pin: pinTrim },
    });

    if (!user) {
      return NextResponse.json({ error: "PIN incorrecto o usuario no encontrado" }, { status: 401 });
    }

    const rawTipo = String(user.tipo ?? "")
      .trim()
      .toUpperCase();
    const tipo: "ADMIN" | "USER" = rawTipo === "ADMIN" ? "ADMIN" : "USER";

    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      tipo,
      permisos: user.permisos,
      isSupremo: user.isSupremo,
    });

    const response = NextResponse.json({
      success: true,
      user: { nombre: user.nombre, tipo, rol: user.rol, permisos: user.permisos },
    });

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
    console.log("[auth/login] error", error);
    console.error("[auth/login] error", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
