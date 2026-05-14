import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

const AUTH_ERROR = "Usuario o contraseña incorrectos";

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
      password: "3350",
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

  const dbPassword = String(user.password).trim();
  let passwordOk = false;

  if (user.mustChangePassword) {
    passwordOk = passwordTrim === dbPassword;
  } else {
    passwordOk = passwordTrim === dbPassword;
    if (!passwordOk && dbPassword.startsWith("$2a$")) {
      passwordOk = bcrypt.compareSync(passwordTrim, dbPassword);
    }
  }

  if (!passwordOk) {
    console.log(`[auth/login] Usuario "${nombreLC}": Contraseña incorrecta.`);
    return jsonAuthError(401, AUTH_ERROR);
  }

  const rawTipo = String(user.tipo ?? "")
    .trim()
    .toUpperCase();
  const isAdmin = rawTipo === "ADMIN";

  let finalUser = user;

  // Garantizar isSupremo para el administrador si aplica (lógica heredada)
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
