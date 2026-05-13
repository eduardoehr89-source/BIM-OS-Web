import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Tareas asignadas al usuario actual que aún NO han sido aceptadas.
 * Son las que aparecen en la bandeja de entrada "Pendientes de aceptar".
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json([]);

    const tasks = await prisma.projectTask.findMany({
      where: {
        assignments: {
          some: { userId, isAccepted: false },
        },
        // Excluir tareas cuyo dueño es el mismo usuario
        NOT: { ownerId: userId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, nombre: true, client: { select: { nombre: true } } },
        },
        assignments: {
          where: { userId },
          select: { isAccepted: true, assignedAt: true },
        },
        relatedFile: {
          select: { originalName: true },
        },
        owner: {
          select: { nombre: true },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (e) {
    console.error("[GET /api/tasks/pending]", e);
    return NextResponse.json({ error: "Error cargando tareas pendientes" }, { status: 500 });
  }
}
