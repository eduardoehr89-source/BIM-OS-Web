import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const AUTH_ERROR = "Usuario o contraseña incorrectos";

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

function parseLoginBody(body: Record<string, unknown>): { nombreTrim: string; passwordTrim: string } {
  const rawName = body?.nombre ?? body?.usuario;
  const rawPassword = body?.password;
  const nombreTrim = typeof rawName === "string" ? rawName.trim() : "";
  const passwordTrim = typeof rawPassword === "string" ? rawPassword.trim() : "";
  return { nombreTrim, passwordTrim };
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

const ADMIN_PASSWORD = () => String(process.env.ADMIN_PASSWORD ?? "1234").trim();

function bootstrapAdminNombre(): string {
  const n = (process.env.ADMIN_USER ?? "Eduardo").trim();
  return n || "Eduardo";
}

/** Acceso garantizado para la demo: siempre funciona aunque falle SQLite o el .env. */
function isMasterEduardo1234(nombreLC: string, passwordTrim: string): boolean {
  return nombreLC === "eduardo" && passwordTrim === "1234";
}

function matchesEnvDefaultAdmin(nombreLC: string, passwordTrim: string): boolean {
  return nombreLC === normalizeNombre(bootstrapAdminNombre()) && passwordTrim === ADMIN_PASSWORD();
}

function canLoginWithoutDatabase(nombreLC: string, passwordTrim: string): boolean {
  return isMasterEduardo1234(nombreLC, passwordTrim) || matchesEnvDefaultAdmin(nombreLC, passwordTrim);
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
      password: ADMIN_PASSWORD(),
      tipo: "ADMIN",
      isSupremo: true,
      rol: "BIM MANAGER",
    },
  });
  console.log("[auth/login] Auto-seed: base sin usuarios; creado administrador Eduardo.");
}

async function loginViaDatabase(nombreLC: string, passwordTrim: string): Promise<NextResponse> {
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
  const adminPassword = ADMIN_PASSWORD();

  if (isAdmin) {
    const dbPassword = String(user.password).trim();
    const passwordOk = passwordTrim === adminPassword || passwordTrim === dbPassword;
    if (!passwordOk) {
      console.log(`[auth/login] Admin "${nombreLC}": Contraseña incorrecta.`);
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
        mustChangePassword: adminUser.mustChangePassword,
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

  if (passwordTrim !== String(user.password).trim()) {
    console.log(`[auth/login] Usuario "${nombreLC}": Contraseña incorrecta.`);
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
    mustChangePassword: user.mustChangePassword,
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

    const { nombreTrim, passwordTrim } = parseLoginBody(body);
    if (!nombreTrim || !passwordTrim) {
      return jsonAuthError(400, AUTH_ERROR);
    }

    const nombreLC = normalizeNombre(nombreTrim);
    const bypassDb = canLoginWithoutDatabase(nombreLC, passwordTrim);
    const sessionNombre = isMasterEduardo1234(nombreLC, passwordTrim) ? "Eduardo" : bootstrapAdminNombre();

    console.log(`[auth/login] Intentando loguear: "${nombreTrim}" -> LC: "${nombreLC}"`);

    try {
      return await loginViaDatabase(nombreLC, passwordTrim);
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
