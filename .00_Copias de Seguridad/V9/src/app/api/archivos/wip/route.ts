import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { REVIT_PLUGIN_CORS_HEADERS, withRevitCors } from "@/lib/revit-cors";
import { projectFileToRevitArchivo, REVIT_FILE_UPLOAD_EVENTS } from "@/lib/revit-file-dto";

/**
 * Listado plano de archivos en raíz de 01_WIP (todos los proyectos), para compatibilidad con plugin Revit.
 * GET http://localhost:3001/api/archivos/wip
 */
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: REVIT_PLUGIN_CORS_HEADERS });
}

export async function GET() {
  try {
    const attachments = await prisma.attachment.findMany({
      where: {
        container: "WIP",
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

    const data = attachments.map((a) => projectFileToRevitArchivo(a.file));
    return withRevitCors(NextResponse.json(data));
  } catch (e) {
    console.error("[GET /api/archivos/wip]", e);
    const res = NextResponse.json({ error: "No se pudieron cargar los archivos WIP" }, { status: 500 });
    return withRevitCors(res);
  }
}
