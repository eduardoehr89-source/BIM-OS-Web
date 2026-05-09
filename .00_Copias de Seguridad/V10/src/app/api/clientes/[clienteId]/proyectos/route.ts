import { prisma } from "@/lib/prisma";
import { revitJson, revitOptions } from "@/lib/revit-api";

type Params = { params: Promise<{ clienteId: string }> };

export function OPTIONS() {
  return revitOptions();
}

export async function GET(_req: Request, ctx: Params) {
  const { clienteId } = await ctx.params;
  if (!clienteId?.trim()) {
    return revitJson({ error: "clienteId requerido" }, 400);
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clienteId },
      select: { id: true },
    });
    if (!client) {
      return revitJson({ error: "Cliente no encontrado" }, 404);
    }

    const projects = await prisma.project.findMany({
      where: { clientId: clienteId },
      orderBy: [{ ano: "desc" }, { nombre: "asc" }],
      select: {
        id: true,
        nombre: true,
        projectCode: true,
        ubicacion: true,
        ano: true,
        tipologia: true,
        estatus: true,
        clientId: true,
        createdAt: true,
      },
    });

    const data = projects.map((p) => ({
      Id: p.id,
      Nombre: p.nombre,
      CodigoProyecto: p.projectCode ?? "",
      Ubicacion: p.ubicacion,
      Ano: p.ano,
      Tipologia: p.tipologia,
      Estatus: p.estatus,
      ClienteId: p.clientId,
      CreadoEn: p.createdAt.toISOString(),
    }));

    return revitJson(data);
  } catch (e) {
    console.error("[GET /api/clientes/.../proyectos]", e);
    return revitJson({ error: "No se pudieron cargar los proyectos" }, 500);
  }
}
