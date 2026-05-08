import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const AUTH_ERROR = "Usuario o PIN incorrectos";

/** ID estable cuando no hay SQLite; las APIs que consulten la BD pueden fallar, pero el layout y el dashboard degradan con aviso. */
const FALLBACK_ADMIN_USER_ID = () =>
  (process.env.FALLBACK_ADMIN_USER_ID ?? "bimos_env_only_fallback").trim() || "bimos_env_only_fallback";

const FALLBACK_ADMIN_PERMISOS = () =>
  (
    process.env.FALLBACK_ADMIN_PERMISOS ??
    "dashboard,proyectos,tareas,comunicaciones,clientes,auditoria,configuracion"
  ).trim();

function normalizeNombre(n: string): string {
  return n.trim().toLowerCase();
}

function parseLoginBody(body: Record<string, unknown>): { nombreTrim: string; pinTrim: string } {
  const rawName = body?.nombre ?? body?.usuario;
  const rawPin = body?.pin;
  const nombreTrim = typeof rawName === "string" ? rawName.trim() : "";
  const pinTrim = typeof rawPin === "string" ? rawPin.trim() : "";
  return { nombreTrim, pinTrim };
}

function critical503(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[CRITICAL AUTH ERROR]", err);
  return NextResponse.json(
    {
      success: false,
      error: "Error interno del servidor",
      details: message.slice(0, 2000),
      code: "DB_NATIVE_FAILURE",
    },
    { status: 503 }
  );
}

const ADMIN_PIN = () => String(process.env.ADMIN_PIN ?? "1234").trim();

function bootstrapAdminNombre(): string {
  const n = (process.env.ADMIN_USER ?? "Eduardo").trim();
  return n || "Eduardo";
}

/** Acceso garantizado para la demo: siempre funciona aunque falle SQLite o el .env. */
function isMasterEduardo1234(nombreLC: string, pinTrim: string): boolean {
  return nombreLC === "eduardo" && pinTrim === "1234";
}

function matchesEnvDefaultAdmin(nombreLC: string, pinTrim: string): boolean {
  return nombreLC === normalizeNombre(bootstrapAdminNombre()) && pinTrim === ADMIN_PIN();
}

function canLoginWithoutDatabase(nombreLC: string, pinTrim: string): boolean {
  return isMasterEduardo1234(nombreLC, pinTrim) || matchesEnvDefaultAdmin(nombreLC, pinTrim);
}

class LoginUserNotFoundError extends Error {
  constructor() {
    super("LOGIN_USER_NOT_FOUND");
    this.name = "LoginUserNotFoundError";
  }
}

function jsonAuthError(status: 401 | 400, error: string) {
  return NextResponse.json({ success: false, error }, { status });
}

function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: "bimos_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Sesión admin sin tocar Prisma (modo degradado). */
async function respondEnvOnlyAdmin(displayNombre: string): Promise<NextResponse> {
  console.warn(
    "[auth/login] Sesión admin emitida solo con credenciales .env (SQLite no disponible o usuario no encontrado en BD)."
  );
  const token = await signToken(
    {
      id: FALLBACK_ADMIN_USER_ID(),
      nombre: displayNombre,
      tipo: "ADMIN",
      permisos: FALLBACK_ADMIN_PERMISOS(),
      isSupremo: true,
      canManageFolders: true,
    },
    { rol: "BIM MANAGER" }
  );
  const response = NextResponse.json({
    success: true,
    degraded: true,
    user: { nombre: displayNombre, tipo: "ADMIN", rol: "BIM MANAGER", permisos: FALLBACK_ADMIN_PERMISOS() },
  });
  setSessionCookie(response, token);
  return response;
}

/** Si la BD quedó sin usuarios (p. ej. tras db push), garantiza un admin por defecto. */
async function ensureBootstrapAdminIfEmpty(): Promise<void> {
  const count = await prisma.user.count();
  if (count > 0) return;

  await prisma.user.create({
    data: {
      nombre: bootstrapAdminNombre(),
      pin: ADMIN_PIN(),
      tipo: "ADMIN",
      isSupremo: true,
      rol: "BIM MANAGER",
    },
  });
  console.log("[auth/login] Auto-seed: base sin usuarios; creado administrador Eduardo.");
}

async function loginViaDatabase(nombreLC: string, pinTrim: string): Promise<NextResponse> {
  await ensureBootstrapAdminIfEmpty();

  const users = await prisma.user.findMany();
  const user = users.find((u) => normalizeNombre(u.nombre) === nombreLC);

  if (!user) {
    throw new LoginUserNotFoundError();
  }

  const rawTipo = String(user.tipo ?? "")
    .trim()
    .toUpperCase();
  const isAdmin = rawTipo === "ADMIN";
  const adminPin = ADMIN_PIN();

  if (isAdmin) {
    const dbPin = String(user.pin).trim();
    const pinOk = pinTrim === adminPin || pinTrim === dbPin;
    if (!pinOk) {
      console.log(`[auth/login] Admin "${nombreLC}": PIN incorrecto.`);
      return jsonAuthError(401, AUTH_ERROR);
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
    setSessionCookie(response, token);
    return response;
  }

  if (pinTrim !== String(user.pin).trim()) {
    console.log(`[auth/login] Usuario "${nombreLC}": PIN incorrecto.`);
    return jsonAuthError(401, AUTH_ERROR);
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
  setSessionCookie(response, token);
  return response;
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    } catch {
      return jsonAuthError(400, AUTH_ERROR);
    }

    const { nombreTrim, pinTrim } = parseLoginBody(body);
    if (!nombreTrim || !pinTrim) {
      return jsonAuthError(400, AUTH_ERROR);
    }

    const nombreLC = normalizeNombre(nombreTrim);
    const bypassDb = canLoginWithoutDatabase(nombreLC, pinTrim);
    const sessionNombre = isMasterEduardo1234(nombreLC, pinTrim) ? "Eduardo" : bootstrapAdminNombre();

    console.log(`[auth/login] Intentando loguear: "${nombreTrim}" -> LC: "${nombreLC}" (PIN recibido)`);

    try {
      return await loginViaDatabase(nombreLC, pinTrim);
    } catch (err) {
      if (err instanceof LoginUserNotFoundError) {
        if (bypassDb) {
          return respondEnvOnlyAdmin(sessionNombre);
        }
        return jsonAuthError(401, AUTH_ERROR);
      }
      if (bypassDb) {
        console.warn("[auth/login] Fallo de Prisma/SQLite; acceso admin sin base de datos.", err);
        return respondEnvOnlyAdmin(sessionNombre);
      }
      return critical503(err);
    }
  } catch (error) {
    return critical503(error);
  }
}
