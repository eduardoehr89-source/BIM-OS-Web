import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/tasks/[id]/accept
 * Body: { accept: boolean }
 *
 * Acepta (true) o rechaza (false) la asignación de una tarea al usuario actual.
 * - Aceptar: pone isAccepted=true → la tarea aparece en el listado global.
 * - Rechazar: elimina el registro TaskAssignment → la tarea deja de estar asignada.
 */
export async function PATCH(req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: taskId } = await ctx.params;

  let accept: boolean;
  try {
    const body = await req.json() as { accept?: unknown };
    accept = body.accept === true;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  // Verificar que existe la asignación para este usuario
  const assignment = await prisma.taskAssignment.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });

  if (!assignment) {
    return NextResponse.json({ error: "No tienes una asignación para esta tarea" }, { status: 404 });
  }

  if (accept) {
    // Aceptar → marcar isAccepted = true
    await prisma.taskAssignment.update({
      where: { taskId_userId: { taskId, userId } },
      data: { isAccepted: true },
    });
    return NextResponse.json({ ok: true, action: "accepted" });
  } else {
    // Rechazar → eliminar la asignación
    await prisma.taskAssignment.delete({
      where: { taskId_userId: { taskId, userId } },
    });
    return NextResponse.json({ ok: true, action: "rejected" });
  }
}
