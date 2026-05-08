import type { Prisma } from "@/generated/prisma";
import { ACTIVE_PROJECT_FILE_WHERE } from "@/lib/project-file-filters";

/** Listado y creación de proyectos: relaciones ISO 19650 null-safe (bepFile opcional). */
export const PROJECT_API_LIST_INCLUDE = {
  client: true,
  sharedWith: { select: { id: true } },
  bepFile: { select: { id: true, originalName: true } },
  attachmentSubfolders: {
    orderBy: { name: "asc" as const },
    select: { id: true, container: true, name: true },
  },
  files: {
    where: ACTIVE_PROJECT_FILE_WHERE,
    include: {
      attachment: { select: { id: true, container: true, subfolderId: true } },
    },
  },
  tasks: {
    orderBy: [{ fechaTermino: "asc" as const }, { nombre: "asc" as const }],
    include: {
      assignments: {
        include: { user: { select: { nombre: true } } }
      }
    }
  },
} satisfies Prisma.ProjectInclude;

/** Detalle de proyecto (GET/PATCH único). */
export const PROJECT_API_DETAIL_INCLUDE = {
  client: true,
  sharedWith: { select: { id: true } },
  bepFile: { select: { id: true, originalName: true } },
  attachmentSubfolders: {
    orderBy: { name: "asc" as const },
    select: { id: true, container: true, name: true },
  },
  files: {
    where: ACTIVE_PROJECT_FILE_WHERE,
    include: {
      attachment: { select: { id: true, container: true, subfolderId: true } },
    },
  },
  tasks: {
    orderBy: [{ fechaTermino: "asc" as const }, { nombre: "asc" as const }],
    include: {
      assignments: {
        include: { user: { select: { nombre: true } } }
      },
      comments: {
        include: { author: { select: { nombre: true } } },
        orderBy: { createdAt: "desc" as const },
      },
    },
  },
} satisfies Prisma.ProjectInclude;
