import { cookies } from "next/headers";
import type { AuthPayload } from "@/lib/auth";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAuthPayload() {
  const token = (await cookies()).get("bimos_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function isAdminUser(p: Pick<AuthPayload, "tipo"> | null): boolean {
  return p?.tipo === "ADMIN";
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
