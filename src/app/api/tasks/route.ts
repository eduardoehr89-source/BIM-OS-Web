import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

/**
 * Listado global de tareas visibles para el usuario actual.
 * Misma regla de visibilidad que GET /api/projects/[id]/tasks.
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json([]);
    }

    const tasks = await prisma.projectTask.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { sharedWith: { some: { id: userId } } },
          { assignments: { some: { userId, isAccepted: true } } },
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
      },
    });

    return NextResponse.json(tasks);
  } catch (e) {
    console.error("[GET /api/tasks]", e);
    return NextResponse.json({ error: "No se pudieron cargar las tareas" }, { status: 500 });
  }
}
