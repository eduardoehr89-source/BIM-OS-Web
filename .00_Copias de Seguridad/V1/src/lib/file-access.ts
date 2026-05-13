import { prisma } from "@/lib/prisma";

/** Acceso a un `ProjectFile` (proyecto o documento ISO de empresa). */
export async function userCanAccessStoredFile(
  userId: string | null,
  isAdmin: boolean,
  file: { id: string; projectId: string | null },
): Promise<boolean> {
  if (!userId) return false;
  if (isAdmin) return true;
  if (file.projectId) {
    const proj = await prisma.project.findUnique({
      where: { id: file.projectId },
      select: { ownerId: true, sharedWith: { select: { id: true } } },
    });
    if (!proj) return false;
    if (proj.ownerId === userId) return true;
    return proj.sharedWith.some((u) => u.id === userId);
  }
  const client = await prisma.client.findFirst({
    where: { OR: [{ oirFileId: file.id }, { airFileId: file.id }, { eirFileId: file.id }] },
    select: { ownerId: true, sharedWith: { select: { id: true } } },
  });
  if (!client) return false;
  if (client.ownerId === userId) return true;
  return client.sharedWith.some((u) => u.id === userId);
}
