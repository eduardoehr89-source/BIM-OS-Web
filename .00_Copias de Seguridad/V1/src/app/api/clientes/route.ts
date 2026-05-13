import { prisma } from "@/lib/prisma";
import { revitJson, revitOptions } from "@/lib/revit-api";

/** Catálogo de clientes para plugin Revit (CORS abierto). */
export function OPTIONS() {
  return revitOptions();
}

export async function GET() {
  try {
    const rows = await prisma.client.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        activo: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
    });

    const data = rows.map((c) => ({
      Id: c.id,
      Nombre: c.nombre,
      Activo: c.activo,
      CantidadProyectos: c._count.projects,
      CreadoEn: c.createdAt.toISOString(),
    }));

    return revitJson(data);
  } catch (e) {
    console.error("[GET /api/clientes]", e);
    return revitJson({ error: "No se pudieron cargar los clientes" }, 500);
  }
}
