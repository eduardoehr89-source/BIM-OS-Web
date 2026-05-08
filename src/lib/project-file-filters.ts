import type { Prisma } from "@/generated/prisma";

/** Archivos de proyecto activos (no en papelera). */
export const ACTIVE_PROJECT_FILE_WHERE: Prisma.ProjectFileWhereInput = {
  isDeleted: false,
};

/** Papelera: archivos marcados eliminados que el usuario puede ver. */
export function projectFileTrashWhere(userId: string, isAdmin: boolean): Prisma.ProjectFileWhereInput {
  const base: Prisma.ProjectFileWhereInput = { isDeleted: true };
  if (isAdmin) return base;
  return {
    isDeleted: true,
    project: {
      OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }],
    },
  };
}
