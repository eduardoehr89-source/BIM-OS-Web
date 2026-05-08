import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function PATCH(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const taskId = String(body.taskId || "").trim();
    if (!taskId) return NextResponse.json({ error: "taskId requerido" }, { status: 400 });

    const assignment = await prisma.taskAssignment.findFirst({
      where: { taskId, userId },
      include: { task: true }
    });

    if (!assignment) {
      return NextResponse.json({ error: "Asignación no encontrada" }, { status: 404 });
    }

    if (assignment.isAccepted) {
      return NextResponse.json({ success: true, message: "Ya estaba aceptada" });
    }

    await prisma.taskAssignment.update({
      where: { id: assignment.id },
      data: { isAccepted: true }
    });

    await logAudit("EDITAR", "TASK", `Tarea aceptada por responsable: ${assignment.task.nombre}`);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[POST /api/tasks/assignments/accept]", e);
    return NextResponse.json({ error: "No se pudo aceptar la tarea" }, { status: 500 });
  }
}
