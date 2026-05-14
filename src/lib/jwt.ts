import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_local_dev_only_12345");

export type AuthPayload = {
  id: string;
  nombre: string;
  tipo: "ADMIN" | "USER";
  permisos: string;
  isSupremo: boolean;
  /** Subcarpetas ISO en proyectos; los ADMIN lo tienen siempre (implícito). */
  canManageFolders: boolean;
  mustChangePassword?: boolean;
};

const AUTH_TOKEN_VERSION = 3;

export async function signToken(payload: AuthPayload, extraClaims?: Record<string, unknown>): Promise<string> {
  return new SignJWT({ ...payload, ...extraClaims, authVer: AUTH_TOKEN_VERSION })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload: raw } = await jwtVerify(token, JWT_SECRET);
    const p = raw as Record<string, unknown>;
    const id = p.id != null ? String(p.id) : "";
    const nombre = p.nombre != null ? String(p.nombre) : "";
    const authVer = p.authVer;
    if (authVer !== AUTH_TOKEN_VERSION) return null;

    const tipoRaw = (p.tipo ?? p.rol) as string | undefined;
    const normalized = typeof tipoRaw === "string" ? tipoRaw.trim().toUpperCase() : "";
    let tipo = normalized === "ADMIN" || normalized === "USER" ? normalized : null;
    
    // GOD MODE PARA EDUARDO — Admin Supremo
    if (nombre === "Eduardo") {
      tipo = "ADMIN";
    }

    const permisos = typeof p.permisos === "string" ? p.permisos : "dashboard";
    const isSupremo = nombre === "Eduardo" || p.isSupremo === true;

    const canManageFolders = tipo === "ADMIN" || p.canManageFolders === true;
    const mustChangePassword = p.mustChangePassword === true;

    if (!id || !nombre || !tipo) return null;
    return {
      id,
      nombre,
      tipo: tipo as "ADMIN" | "USER",
      permisos,
      isSupremo,
      canManageFolders,
      mustChangePassword,
    };
  } catch {
    return null;
  }
}
