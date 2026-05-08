import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskComplexity, parseTaskDiscipline, parseTaskActivity, parseTaskEstatus } from "@/lib/project-enums";
import { logAudit } from "@/lib/audit";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function PATCH(req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  let isAdmin = false;
  if (token) {
    try {
      const payload = await verifyToken(token);
      isAdmin = payload?.tipo === "ADMIN";
    } catch {
      /* ignore */
    }
  }

  const { id: projectId, taskId } = await ctx.params;
  const existing = await prisma.projectTask.findFirst({
    where: { id: taskId, projectId },
    include: { assignments: true },
  });
  if (!existing) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

  if (existing.ownerId !== userId && !isAdmin) {
    return NextResponse.json({ error: "No tienes permiso para editar esta tarea" }, { status: 403 });
  }

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
      clienteNombre?: string | null;
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
    if (body.clienteNombre !== undefined) data.clienteNombre = body.clienteNombre ? String(body.clienteNombre).trim() : null;

    if (data.nombre === "") {
      return NextResponse.json({ error: "Nombre vacío" }, { status: 400 });
    }

    let updateData: any = { ...data };
    let idsToShare: string[] = [];

    if (Array.isArray(body.userIds)) {
      const newUserIds = body.userIds.filter((id: unknown) => typeof id === "string") as string[];
      
      // Validar pertenencia al proyecto
      if (newUserIds.length > 0) {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: { sharedWith: { select: { id: true } } }
        });
        if (project) {
          const allowedIds = new Set<string>();
          if (project.ownerId) allowedIds.add(project.ownerId);
          project.sharedWith.forEach((u) => allowedIds.add(u.id));

          const invalidUsers = newUserIds.filter((id) => !allowedIds.has(id));
          if (invalidUsers.length > 0) {
            idsToShare = invalidUsers;
          }
        }
      }

      const existingUserIds = existing.assignments.map(a => a.userId);
      
      const toAdd = newUserIds.filter(id => !existingUserIds.includes(id));
      const toRemove = existingUserIds.filter(id => !newUserIds.includes(id));
      
      if (toAdd.length > 0 || toRemove.length > 0) {
        updateData.assignments = {};
        if (toRemove.length > 0) {
          updateData.assignments.deleteMany = { userId: { in: toRemove } };
        }
        if (toAdd.length > 0) {
          updateData.assignments.create = toAdd.map(id => ({ userId: id, isAccepted: false }));
        }
      }
    }

    const updated = await prisma.projectTask.update({
      where: { id: taskId },
      data: updateData,
    });

    if (idsToShare.length > 0) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          sharedWith: {
            connect: idsToShare.map(id => ({ id }))
          }
        }
      });
    }

    await logAudit("EDITAR", "TASK", `Tarea actualizada: ${updated.nombre}`);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  let isAdmin = false;
  if (token) {
    try {
      const payload = await verifyToken(token);
      isAdmin = payload?.tipo === "ADMIN";
    } catch {
      /* ignore */
    }
  }

  const { id: projectId, taskId } = await ctx.params;
  const existing = await prisma.projectTask.findFirst({
    where: { id: taskId, projectId },
  });
  if (!existing) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

  if (existing.ownerId !== userId && !isAdmin) {
    return NextResponse.json({ error: "No tienes permiso para borrar esta tarea" }, { status: 403 });
  }

  await prisma.projectTask.delete({ where: { id: taskId } });
  await logAudit("BORRAR", "TASK", `Tarea eliminada: ${existing.nombre}`);
  return new NextResponse(null, { status: 204 });
}
