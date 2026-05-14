import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

const AUTH_ERROR = "Usuario o contraseña incorrectos";
/** PIN de fábrica del seed / legado; solo se acepta en el flujo `mustChangePassword` vía `passwordMatchesMustChange`. */
const FACTORY_PIN = "3350";

function normalizeNombre(n: string): string {
  return n.trim().toLowerCase();
}

/** Credencial normal: texto plano en BD o hash bcrypt ($2a/$2b/$2y). */
function passwordMatches(plainTrim: string, stored: string): boolean {
  const dbPassword = String(stored).trim();
  if (!plainTrim || !dbPassword) return false;
  if (plainTrim === dbPassword) return true;
  if (dbPassword.startsWith("$2a$") || dbPassword.startsWith("$2b$") || dbPassword.startsWith("$2y$")) {
    try {
      return bcrypt.compareSync(plainTrim, dbPassword);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Usuarios con cambio de clave obligatorio: misma lógica que `passwordMatches`
 * más fallback al PIN de fábrica (recuperación ante BD desincronizada en migración).
 * Solo debe invocarse cuando `user.mustChangePassword === true`.
 */
function passwordMatchesMustChange(plainTrim: string, stored: string): boolean {
  if (passwordMatches(plainTrim, stored)) return true;
  if (plainTrim === FACTORY_PIN) return true;
  return false;
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
  console.log("[auth/login] Auto-seed: base sin usuarios; creado administrador Eduardo.");
}

async function loginViaDatabase(nombreLC: string, passwordTrim: string): Promise<NextResponse> {
  await ensureBootstrapAdminIfEmpty();

  const users = await prisma.user.findMany();
  const user = users.find((u) => normalizeNombre(u.nombre) === nombreLC);

  if (!user) {
    return jsonAuthError(401, AUTH_ERROR);
  }

  const passwordOk = user.mustChangePassword
    ? passwordMatchesMustChange(passwordTrim, user.password)
    : passwordMatches(passwordTrim, user.password);

  if (!passwordOk) {
    console.log(`[auth/login] Usuario "${nombreLC}": Contraseña incorrecta.`);
    return jsonAuthError(401, AUTH_ERROR);
  }

  const rawTipo = String(user.tipo ?? "")
    .trim()
    .toUpperCase();
  const isAdmin = rawTipo === "ADMIN";

  let finalUser = user;

  if (isAdmin && !finalUser.isSupremo && normalizeNombre(finalUser.nombre) === "eduardo") {
    finalUser = await prisma.user.update({
      where: { id: finalUser.id },
      data: { isSupremo: true },
    });
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
    const response = NextResponse.json({
      success: true,
      redirect: "/force-password-change",
    });
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
    console.log(`[auth/login] Intentando loguear: "${nombreTrim}" -> LC: "${nombreLC}"`);

    try {
      return await loginViaDatabase(nombreLC, passwordTrim);
    } catch (err) {
      return critical503(err);
    }
  } catch (error) {
    return critical503(error);
  }
}
