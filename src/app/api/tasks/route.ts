import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Listado global de tareas visibles para el usuario actual.
 * ADMIN: todas las tareas (alineado con el conteo del dashboard).
 * USER: dueño, compartidas en la tarea, o con asignación (aceptada o pendiente).
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json([]);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("bimos_session")?.value;
    const payload = token ? await verifyToken(token) : null;
    const isAdmin = payload?.tipo === "ADMIN";

    const tasks = await prisma.projectTask.findMany({
      where: isAdmin
        ? {}
        : {
            OR: [
              { ownerId: userId },
              { sharedWith: { some: { id: userId } } },
              { assignments: { some: { userId } } },
            ],
          },
      orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }],
      include: {
        project: {
          select: {
            id: true,
            nombre: true,
            client: { select: { nombre: true } },
          },
        },
        assignments: {
          include: { user: { select: { nombre: true } } },
        },
        relatedFile: {
          select: { originalName: true },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (e) {
    console.error("[GET /api/tasks]", e);
    return NextResponse.json({ error: "No se pudieron cargar las tareas" }, { status: 500 });
  }
}
