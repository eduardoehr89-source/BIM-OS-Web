import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_local_dev_only_12345");

export type AuthPayload = {
  id: string;
  nombre: string;
  rol: "ADMIN" | "USER";
};

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AuthPayload;
  } catch (error) {
    return null;
  }
}

import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.id || null;
}
