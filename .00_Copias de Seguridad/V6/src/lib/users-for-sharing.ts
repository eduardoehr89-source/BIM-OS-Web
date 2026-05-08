import { prisma } from "@/lib/prisma";

/**
 * Usuarios que pueden aparecer en el dropdown "Invitar colaborador".
 * ADMIN / Admin Supremo: todos los demás usuarios.
 * USER: cohorte previa (mismo cliente + redes de proyecto).
 */
export async function getCollaborationUserOptions(viewerId: string) {
  const viewer = await prisma.user.findUnique({
    where: { id: viewerId },
    select: {
      id: true,
      tipo: true,
      isSupremo: true,
      clientId: true,
      ownedProjects: {
        select: {
          ownerId: true,
          sharedWith: { select: { id: true } },
        },
      },
      sharedProjects: {
        select: {
          ownerId: true,
          sharedWith: { select: { id: true } },
        },
      },
    },
  });

  if (!viewer) return [];

  const select = {
    id: true,
    nombre: true,
    tipo: true,
    rol: true,
    client: { select: { nombre: true } },
  } as const;

  if (viewer.tipo === "ADMIN" || viewer.isSupremo) {
    return prisma.user.findMany({
      where: { NOT: { id: viewerId } },
      select,
      orderBy: { nombre: "asc" },
    });
  }

  const allowedUserIds = new Set<string>();
  allowedUserIds.add(viewer.id);

  if (viewer.clientId) {
    const clientUsers = await prisma.user.findMany({
      where: { clientId: viewer.clientId },
      select: { id: true },
    });
    clientUsers.forEach((u) => allowedUserIds.add(u.id));
  }

  const allProjects = [...viewer.ownedProjects, ...viewer.sharedProjects];
  for (const p of allProjects) {
    if (p.ownerId) allowedUserIds.add(p.ownerId);
    p.sharedWith.forEach((u) => allowedUserIds.add(u.id));
  }

  allowedUserIds.delete(viewerId);

  const cohortIds = Array.from(allowedUserIds);
  if (cohortIds.length === 0) return [];

  return prisma.user.findMany({
    where: { id: { in: cohortIds } },
    select,
    orderBy: { nombre: "asc" },
  });
}
