import type { AuthPayload } from "@/lib/auth";
import { isAdminUser } from "@/lib/comunicaciones-auth";
import { prisma } from "@/lib/prisma";

type AdminBypassClaims = Pick<AuthPayload, "tipo" | "isSupremo">;

/**
 * Para usuarios que no son administradores (JWT/BD): misma visibilidad que `GET /api/projects`
 * (dueño, compartido explícito, o asignación de tarea aceptada).
 *
 * Administrador de sistema y Admin Supremo hacen bypass inmediato (sin dueños ni tareas).
 */
export async function canUserAccessProjectFiles(
  projectId: string,
  userId: string,
  session?: AdminBypassClaims | null,
): Promise<boolean> {
  if (isAdminUser(session ?? null)) {
    return true;
  }

  const member = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipo: true, isSupremo: true },
  });
  if (isAdminUser(member)) {
    return true;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        { sharedWith: { some: { id: userId } } },
        {
          tasks: {
            some: {
              assignments: { some: { userId, isAccepted: true } },
            },
          },
        },
      ],
    },
    select: { id: true },
  });
  return project !== null;
}

/** ADMIN / Admin Supremo siempre pueden; USER solo si canManageFolders en BD. */
export async function canUserManageAttachmentSubfolders(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipo: true, isSupremo: true, canManageFolders: true },
  });
  if (!u) return false;
  return isAdminUser(u) || u.canManageFolders;
}
