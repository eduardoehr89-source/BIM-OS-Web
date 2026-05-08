import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const AUTH_ERROR = "Usuario o PIN incorrectos";

const ADMIN_PIN = process.env.ADMIN_PIN || "3350";

/** Si la BD quedó sin usuarios (p. ej. tras db push), garantiza un admin por defecto. */
async function ensureBootstrapAdminIfEmpty(): Promise<void> {
  const count = await prisma.user.count();
  if (count > 0) return;

  await prisma.user.create({
    data: {
      nombre: "Eduardo",
      pin: ADMIN_PIN,
      tipo: "ADMIN",
      isSupremo: true,
      rol: "BIM MANAGER",
    },
  });
  console.log("[auth/login] Auto-seed: base sin usuarios; creado administrador Eduardo.");
}

function normalizeNombre(n: string): string {
  return n.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: AUTH_ERROR }, { status: 400 });
    }
    const nombreRaw = body?.nombre;
    const pinRaw = body?.pin;

    const nombreTrim = typeof nombreRaw === "string" ? nombreRaw.trim() : "";
    const pinTrim = typeof pinRaw === "string" ? pinRaw.trim() : "";

    if (!nombreTrim || !pinTrim) {
      return NextResponse.json({ error: AUTH_ERROR }, { status: 400 });
    }

    const nombreLC = normalizeNombre(nombreTrim);
    console.log(`[auth/login] Intentando loguear: "${nombreTrim}" -> LC: "${nombreLC}" (PIN recibido: ${pinTrim})`);

    try {
      await ensureBootstrapAdminIfEmpty();
    } catch (seedErr) {
      console.log("[auth/login] auto-seed error", seedErr);
    }

    let users: Awaited<ReturnType<typeof prisma.user.findMany>>;
    try {
      users = await prisma.user.findMany();
    } catch (dbErr) {
      console.error("[auth/login] prisma findMany", dbErr);
      return NextResponse.json({ error: "Servicio no disponible. Inténtelo de nuevo." }, { status: 503 });
    }
    const user = users.find((u) => normalizeNombre(u.nombre) === nombreLC);

    if (!user) {
      console.log(`[auth/login] Usuario "${nombreLC}" no encontrado en DB. Registros totales en DB: ${users.length}`);
      return NextResponse.json({ error: AUTH_ERROR }, { status: 401 });
    }

    const rawTipo = String(user.tipo ?? "")
      .trim()
      .toUpperCase();
    const isAdmin = rawTipo === "ADMIN";

    if (isAdmin) {
      if (pinTrim !== ADMIN_PIN) {
        console.log(`[auth/login] Admin "${nombreLC}": PIN incorrecto. Esperado ADMIN_PIN (del .env), recibido: ${pinTrim}`);
        return NextResponse.json({ error: AUTH_ERROR }, { status: 401 });
      }
      let adminUser = user;
      if (!adminUser.isSupremo) {
        adminUser = await prisma.user.update({
          where: { id: adminUser.id },
          data: { isSupremo: true },
        });
      }
      const token = await signToken(
        {
          id: adminUser.id,
          nombre: adminUser.nombre,
          tipo: "ADMIN",
          permisos: adminUser.permisos,
          isSupremo: adminUser.isSupremo,
          canManageFolders: true,
        },
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

    if (pinTrim !== String(user.pin).trim()) {
      console.log(`[auth/login] Usuario normal "${nombreLC}": PIN incorrecto. Esperado (DB): "${String(user.pin).trim()}", recibido: "${pinTrim}"`);
      return NextResponse.json({ error: AUTH_ERROR }, { status: 401 });
    }

    const tipo: "ADMIN" | "USER" = "USER";

    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      tipo,
      permisos: user.permisos,
      isSupremo: user.isSupremo,
      canManageFolders: user.canManageFolders,
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
    return NextResponse.json({ error: "Servicio no disponible. Inténtelo de nuevo." }, { status: 503 });
  }
}
