import { prisma } from "@/lib/prisma";

/** Misma regla que POST /api/projects/[id]/files: admin, dueño o compartido explícito. */
export async function canUserAccessProjectFiles(projectId: string, userId: string): Promise<boolean> {
  const member = await prisma.user.findUnique({ where: { id: userId }, select: { tipo: true } });
  if (member?.tipo === "ADMIN") return true;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      sharedWith: { where: { id: userId }, select: { id: true } },
    },
  });
  if (!project) return false;
  if (project.ownerId === userId) return true;
  return project.sharedWith.length > 0;
}

/** ADMIN siempre puede; USER solo si canManageFolders en BD. */
export async function canUserManageAttachmentSubfolders(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipo: true, canManageFolders: true },
  });
  if (!u) return false;
  return u.tipo === "ADMIN" || u.canManageFolders;
}
