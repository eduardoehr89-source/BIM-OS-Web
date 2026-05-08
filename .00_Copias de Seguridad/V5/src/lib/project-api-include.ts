import type { Prisma } from "@/generated/prisma";
import { ACTIVE_PROJECT_FILE_WHERE } from "@/lib/project-file-filters";

/** Listado y creación de proyectos: relaciones ISO 19650 null-safe (bepFile opcional). */
export const PROJECT_API_LIST_INCLUDE = {
  client: true,
  bepFile: { select: { id: true, originalName: true } },
  files: { where: ACTIVE_PROJECT_FILE_WHERE },
  tasks: { orderBy: [{ fechaTermino: "asc" as const }, { nombre: "asc" as const }] },
} satisfies Prisma.ProjectInclude;

/** Detalle de proyecto (GET/PATCH único). */
export const PROJECT_API_DETAIL_INCLUDE = {
  client: true,
  bepFile: { select: { id: true, originalName: true } },
  files: { where: ACTIVE_PROJECT_FILE_WHERE },
  tasks: {
    orderBy: [{ fechaTermino: "asc" as const }, { nombre: "asc" as const }],
    include: {
      comments: {
        include: { author: { select: { nombre: true } } },
        orderBy: { createdAt: "desc" as const },
      },
    },
  },
} satisfies Prisma.ProjectInclude;
