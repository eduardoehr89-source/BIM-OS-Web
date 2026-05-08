import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskComplexity, parseTaskDiscipline, parseTaskActivity, parseTaskEstatus } from "@/lib/project-enums";
import { logAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function PATCH(req: Request, ctx: Params) {
  const { id: projectId, taskId } = await ctx.params;
  const existing = await prisma.projectTask.findFirst({
    where: { id: taskId, projectId },
  });
  if (!existing) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

  try {
    const body = await req.json();
    const data: {
      nombre?: string;
      disciplina?: NonNullable<ReturnType<typeof parseTaskDiscipline>>;
      fechaTermino?: Date;
      complejidad?: NonNullable<ReturnType<typeof parseTaskComplexity>>;
      actividad?: NonNullable<ReturnType<typeof parseTaskActivity>>;
      taskEstatus?: NonNullable<ReturnType<typeof parseTaskEstatus>>;
      completado?: boolean;
      comentarios?: string;
    } = {};

    if (body.nombre !== undefined) data.nombre = String(body.nombre).trim();
    if (body.disciplina !== undefined) {
      const d = parseTaskDiscipline(body.disciplina);
      if (!d) return NextResponse.json({ error: "Disciplina inválida" }, { status: 400 });
      data.disciplina = d;
    }
    if (body.complejidad !== undefined) {
      const c = parseTaskComplexity(body.complejidad);
      if (!c) return NextResponse.json({ error: "Complejidad inválida" }, { status: 400 });
      data.complejidad = c;
    }
    if (body.actividad !== undefined) {
      const a = parseTaskActivity(body.actividad);
      if (!a) return NextResponse.json({ error: "Actividad inválida" }, { status: 400 });
      data.actividad = a;
    }
    if (body.taskEstatus !== undefined) {
      const e = parseTaskEstatus(body.taskEstatus);
      if (!e) return NextResponse.json({ error: "Estatus inválido" }, { status: 400 });
      data.taskEstatus = e;
    }
    if (body.fechaTermino !== undefined) {
      const dt = new Date(String(body.fechaTermino));
      if (Number.isNaN(dt.getTime())) {
        return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
      }
      data.fechaTermino = dt;
    }
    if (body.completado !== undefined) data.completado = Boolean(body.completado);
    if (body.comentarios !== undefined) data.comentarios = String(body.comentarios);

    if (data.nombre === "") {
      return NextResponse.json({ error: "Nombre vacío" }, { status: 400 });
    }

    const updated = await prisma.projectTask.update({
      where: { id: taskId },
      data,
    });
    await logAudit("EDITAR", "TASK", `Tarea actualizada: ${updated.nombre}`);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Params) {
  const { id: projectId, taskId } = await ctx.params;
  const existing = await prisma.projectTask.findFirst({
    where: { id: taskId, projectId },
  });
  if (!existing) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

  await prisma.projectTask.delete({ where: { id: taskId } });
  await logAudit("BORRAR", "TASK", `Tarea eliminada: ${existing.nombre}`);
  return new NextResponse(null, { status: 204 });
}
