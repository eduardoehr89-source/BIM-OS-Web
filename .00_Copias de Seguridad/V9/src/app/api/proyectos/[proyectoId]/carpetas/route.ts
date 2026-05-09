import { prisma } from "@/lib/prisma";
import { revitJson, revitOptions } from "@/lib/revit-api";
import { REVIT_CONTAINER_CODIGO, REVIT_CONTAINER_TITULO, sortContainers } from "@/lib/revit-iso-labels";

type Params = { params: Promise<{ proyectoId: string }> };

export function OPTIONS() {
  return revitOptions();
}

export async function GET(_req: Request, ctx: Params) {
  const { proyectoId } = await ctx.params;
  if (!proyectoId?.trim()) {
    return revitJson({ error: "proyectoId requerido" }, 400);
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: proyectoId },
      select: { id: true },
    });
    if (!project) {
      return revitJson({ error: "Proyecto no encontrado" }, 404);
    }

    const [folders, subfolders] = await Promise.all([
      prisma.attachmentFolder.findMany({
        where: { projectId: proyectoId },
        select: { id: true, projectId: true, container: true, createdAt: true },
      }),
      prisma.attachmentSubfolder.findMany({
        where: { projectId: proyectoId },
        orderBy: { name: "asc" },
        select: {
          id: true,
          projectId: true,
          container: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

    const sorted = sortContainers(folders);
    const subsByContainer = new Map<string, typeof subfolders>();
    for (const sf of subfolders) {
      const k = sf.container;
      const arr = subsByContainer.get(k) ?? [];
      arr.push(sf);
      subsByContainer.set(k, arr);
    }

    const data = sorted.map((f) => ({
      Id: f.id,
      ProyectoId: f.projectId,
      Contenedor: f.container,
      Codigo: REVIT_CONTAINER_CODIGO[f.container],
      Titulo: REVIT_CONTAINER_TITULO[f.container],
      CreadoEn: f.createdAt.toISOString(),
      Subcarpetas: (subsByContainer.get(f.container) ?? []).map((s) => ({
        Id: s.id,
        Nombre: s.name,
        Contenedor: s.container,
        ProyectoId: s.projectId,
        CreadoEn: s.createdAt.toISOString(),
      })),
    }));

    return revitJson(data);
  } catch (e) {
    console.error("[GET /api/proyectos/.../carpetas]", e);
    return revitJson({ error: "No se pudieron cargar las carpetas" }, 500);
  }
}
