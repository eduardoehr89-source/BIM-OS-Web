import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { User } from "@/generated/prisma";

const AUTH_ERROR = "Usuario o contraseña incorrectos";
const FACTORY_PIN = "3350";

// ─── Utilidades ──────────────────────────────────────────────────────────────

function normalizeNombre(n: string): string {
  return n.trim().toLowerCase();
}

/**
 * Extrae el primer token del nombre completo.
 * "Eduardo Herrera Ramírez" → "eduardo"
 */
function firstNameOf(nombre: string): string {
  return normalizeNombre(nombre).split(/\s+/)[0] ?? "";
}

/**
 * Busca un usuario por:
 * 1. Nombre normalizado completo (exacto)   "eduardo herrera ramírez" === "eduardo herrera ramírez"
 * 2. Primer nombre solamente (fallback)     "eduardo" === first("Eduardo Herrera Ramírez")
 *
 * Devuelve el match más específico primero para evitar colisiones.
 */
function findUserByInput(users: User[], inputLC: string): User | undefined {
  const exact = users.find((u) => normalizeNombre(u.nombre) === inputLC);
  if (exact) return exact;
  if (!inputLC.includes(" ")) {
    return users.find((u) => firstNameOf(u.nombre) === inputLC);
  }
  return undefined;
}

/** Contraseña texto plano (legado) o hash bcrypt. */
function passwordMatches(plain: string, stored: string | null | undefined): boolean {
  const db = (stored ?? "").toString().trim();
  if (!plain || !db) return false;
  if (plain === db) return true;
  if (db.startsWith("$2a$") || db.startsWith("$2b$") || db.startsWith("$2y$")) {
    try {
      return bcrypt.compareSync(plain, db);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Usuarios con mustChangePassword = true.
 * Misma lógica + fallback al FACTORY_PIN (recuperación ante BD desincronizada).
 */
function passwordMatchesMustChange(plain: string, stored: string | null | undefined): boolean {
  return passwordMatches(plain, stored) || plain === FACTORY_PIN;
}

// ─── Cookie y helpers HTTP ────────────────────────────────────────────────────

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

function jsonAuthError(status: 401 | 400, error: string) {
  return NextResponse.json({ success: false, error }, { status });
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

function parseLoginBody(body: Record<string, unknown>) {
  const rawName = body?.nombre ?? body?.usuario;
  const rawPassword = body?.password;
  return {
    nombreTrim: typeof rawName === "string" ? rawName.trim() : "",
    passwordTrim: typeof rawPassword === "string" ? rawPassword.trim() : "",
  };
}

// ─── Bypass nuclear Eduardo ───────────────────────────────────────────────────

/**
 * Acceso de emergencia: "eduardo" + FACTORY_PIN → siempre redirige a /force-password-change.
 *
 * Resolución del userId (en orden):
 *   1. Env var BIMOS_NUCLEAR_EDUARDO_USER_ID (sin consulta a BD — recomendado en producción)
 *   2. DB query por primer nombre "Eduardo" (startsWith, insensitive)
 *   3. DB query amplia (contains, último recurso)
 *
 * Si ninguna estrategia resuelve el id, retorna null para caer al flujo normal.
 */
async function tryNuclearEduardoBypass(nombreLC: string, passwordTrim: string): Promise<NextResponse | null> {
  if (nombreLC !== "eduardo" || passwordTrim !== FACTORY_PIN) return null;

  let userId = process.env.BIMOS_NUCLEAR_EDUARDO_USER_ID?.trim() ?? "";

  if (!userId) {
    try {
      const row = await prisma.user.findFirst({
        where: { nombre: { startsWith: "Eduardo", mode: "insensitive" } },
        select: { id: true },
      });
      userId = row?.id ?? "";

      if (!userId) {
        const row2 = await prisma.user.findFirst({
          where: { nombre: { contains: "Eduardo", mode: "insensitive" } },
          select: { id: true },
        });
        userId = row2?.id ?? "";
      }
    } catch (dbErr) {
      console.error("[auth/login] Bypass nuclear: error resolviendo userId desde BD:", dbErr);
    }
  }

  if (!userId) {
    console.warn(
      "[auth/login] Bypass nuclear: userId no resuelto. " +
        "Define BIMOS_NUCLEAR_EDUARDO_USER_ID en Vercel con el cuid de Eduardo."
    );
    return null;
  }

  const permisos =
    process.env.BIMOS_NUCLEAR_EDUARDO_PERMISOS?.trim() ||
    "dashboard,proyectos,tareas,clientes,docs,comunicaciones,usuarios,auditoria";
  const rol = process.env.BIMOS_NUCLEAR_EDUARDO_ROL?.trim() || "BIM MANAGER";

  const token = await signToken(
    {
      id: userId,
      nombre: "Eduardo",
      tipo: "ADMIN",
      permisos,
      isSupremo: true,
      canManageFolders: true,
      mustChangePassword: true,
    },
    { rol }
  );

  const response = NextResponse.json({ success: true, redirect: "/force-password-change" });
  setSessionCookie(response, token);
  console.log(`[auth/login] Bypass nuclear Eduardo OK → /force-password-change (userId=${userId})`);
  return response;
}

// ─── Seed y login normal ──────────────────────────────────────────────────────

async function ensureBootstrapAdminIfEmpty(): Promise<void> {
  const count = await prisma.user.count();
  if (count > 0) return;
  await prisma.user.create({
    data: {
      nombre: "Eduardo",
      password: FACTORY_PIN,
      tipo: "ADMIN",
      isSupremo: true,
      rol: "BIM MANAGER",
    },
  });
  console.log("[auth/login] Auto-seed: admin Eduardo creado con PIN de fábrica.");
}

async function loginViaDatabase(nombreLC: string, passwordTrim: string): Promise<NextResponse> {
  await ensureBootstrapAdminIfEmpty();

  const users = await prisma.user.findMany();

  const user = findUserByInput(users, nombreLC);

  if (!user) {
    console.log(`[auth/login] Usuario no encontrado: "${nombreLC}"`);
    return jsonAuthError(401, AUTH_ERROR);
  }

  console.log(`[auth/login] Usuario encontrado: "${user.nombre}" (mustChange=${user.mustChangePassword})`);

  const passwordOk = user.mustChangePassword
    ? passwordMatchesMustChange(passwordTrim, user.password)
    : passwordMatches(passwordTrim, user.password);

  if (!passwordOk) {
    console.log(`[auth/login] Contraseña incorrecta para "${user.nombre}"`);
    return jsonAuthError(401, AUTH_ERROR);
  }

  const isAdmin = String(user.tipo ?? "")
    .trim()
    .toUpperCase() === "ADMIN";
  let finalUser = user;

  if (isAdmin && !finalUser.isSupremo && firstNameOf(finalUser.nombre) === "eduardo") {
    finalUser = await prisma.user.update({ where: { id: finalUser.id }, data: { isSupremo: true } });
  }

  const token = await signToken(
    {
      id: finalUser.id,
      nombre: finalUser.nombre,
      tipo: isAdmin ? "ADMIN" : "USER",
      permisos: finalUser.permisos,
      isSupremo: finalUser.isSupremo,
      canManageFolders: isAdmin ? true : finalUser.canManageFolders,
      mustChangePassword: finalUser.mustChangePassword,
    },
    { rol: finalUser.rol }
  );

  if (finalUser.mustChangePassword) {
    const response = NextResponse.json({ success: true, redirect: "/force-password-change" });
    setSessionCookie(response, token);
    return response;
  }

  const response = NextResponse.json({
    success: true,
    user: { nombre: finalUser.nombre, tipo: isAdmin ? "ADMIN" : "USER", rol: finalUser.rol, permisos: finalUser.permisos },
    redirect: "/dashboard",
  });
  setSessionCookie(response, token);
  return response;
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    } catch {
      return jsonAuthError(400, AUTH_ERROR);
    }

    const { nombreTrim, passwordTrim } = parseLoginBody(body);
    if (!nombreTrim || !passwordTrim) return jsonAuthError(400, AUTH_ERROR);

    const nombreLC = normalizeNombre(nombreTrim);
    console.log(`[auth/login] Intento: "${nombreTrim}" → LC: "${nombreLC}"`);

    try {
      const nuclear = await tryNuclearEduardoBypass(nombreLC, passwordTrim);
      if (nuclear) return nuclear;
      return await loginViaDatabase(nombreLC, passwordTrim);
    } catch (err) {
      return critical503(err);
    }
  } catch (error) {
    return critical503(error);
  }
}
