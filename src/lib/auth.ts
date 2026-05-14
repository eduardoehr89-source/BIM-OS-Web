import { signToken as jwtSignToken, verifyToken as jwtVerifyToken } from "./jwt";
export type { AuthPayload } from "./jwt";

export const signToken = jwtSignToken;
export const verifyToken = jwtVerifyToken;

import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string | null> {
  const payload = await getSessionPayload();
  return payload?.id || null;
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}
