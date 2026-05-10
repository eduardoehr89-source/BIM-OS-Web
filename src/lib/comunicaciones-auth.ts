import { cookies } from "next/headers";
import type { AuthPayload } from "@/lib/auth";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAuthPayload() {
  const token = (await cookies()).get("bimos_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Claims mínimos para rol admin (JWT o filas Prisma donde `tipo` es string). */
export type AdminRoleClaims = {
  tipo?: string | null;
  isSupremo?: boolean | null;
};

/** Admin de sistema o Admin Supremo: ve todos los canales grupales y permisos de gestión. */
export function isAdminUser(p: AdminRoleClaims | null): boolean {
  if (!p) return false;
  return p.tipo === "ADMIN" || p.isSupremo === true;
}

export async function requireMember(canalId: string, userId: string) {
  const row = await prisma.canalUsuario.findUnique({
    where: { canalId_usuarioId: { canalId, usuarioId: userId } },
  });
  return row != null;
}

/** Miembro del canal o administrador del sistema (ve y usa todos los canales). */
export async function canAccessCanal(p: AuthPayload, canalId: string): Promise<boolean> {
  if (isAdminUser(p)) return true;
  return requireMember(canalId, p.id);
}
