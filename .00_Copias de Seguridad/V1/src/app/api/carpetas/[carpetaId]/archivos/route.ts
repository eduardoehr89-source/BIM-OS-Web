import { prisma } from "@/lib/prisma";
import { revitJson, revitOptions } from "@/lib/revit-api";
import { projectFileToRevitArchivo, REVIT_FILE_UPLOAD_EVENTS } from "@/lib/revit-file-dto";

type Params = { params: Promise<{ carpetaId: string }> };

export function OPTIONS() {
  return revitOptions();
}

/**
 * `carpetaId` puede ser:
 * - `AttachmentFolder.id` → archivos en la raíz del contenedor ISO (sin subcarpeta).
 * - `AttachmentSubfolder.id` → archivos dentro de esa subcarpeta.
 */
export async function GET(_req: Request, ctx: Params) {
  const { carpetaId } = await ctx.params;
  if (!carpetaId?.trim()) {
    return revitJson({ error: "carpetaId requerido" }, 400);
  }

  try {
    const folder = await prisma.attachmentFolder.findUnique({
      where: { id: carpetaId },
      select: { projectId: true, container: true },
    });

    if (folder) {
      const attachments = await prisma.attachment.findMany({
        where: {
          projectId: folder.projectId,
          container: folder.container,
          subfolderId: null,
          file: { isDeleted: false },
        },
        include: {
          file: {
            include: {
              uploadEvents: REVIT_FILE_UPLOAD_EVENTS,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const Archivos = attachments.map((a) => projectFileToRevitArchivo(a.file));
      return revitJson({
        TipoCarpeta: "CONTENEDOR_ISO",
        ProyectoId: folder.projectId,
        Contenedor: folder.container,
        Archivos,
      });
    }

    const sub = await prisma.attachmentSubfolder.findUnique({
      where: { id: carpetaId },
      select: { id: true, projectId: true, container: true, name: true },
    });

    if (sub) {
      const attachments = await prisma.attachment.findMany({
        where: {
          subfolderId: sub.id,
          file: { isDeleted: false },
        },
        include: {
          file: {
            include: {
              uploadEvents: REVIT_FILE_UPLOAD_EVENTS,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const Archivos = attachments.map((a) => projectFileToRevitArchivo(a.file));
      return revitJson({
        TipoCarpeta: "SUBCARPETA",
        SubcarpetaId: sub.id,
        SubcarpetaNombre: sub.name,
        ProyectoId: sub.projectId,
        Contenedor: sub.container,
        Archivos,
      });
    }

    return revitJson({ error: "Carpeta no encontrada" }, 404);
  } catch (e) {
    console.error("[GET /api/carpetas/.../archivos]", e);
    return revitJson({ error: "No se pudieron cargar los archivos" }, 500);
  }
}
