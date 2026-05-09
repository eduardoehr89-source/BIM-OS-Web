import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { parseTaskComplexity, parseTaskDiscipline, parseTaskActivity, parseTaskEstatus } from "@/lib/project-enums";
import { getCurrentUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  const { id: projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const tasks = await prisma.projectTask.findMany({
    where: { 
      projectId,
      ...(userId ? { 
        OR: [
          { ownerId: userId }, 
          { sharedWith: { some: { id: userId } } },
          { assignments: { some: { userId, isAccepted: true } } }
        ] 
      } : {})
    },
    orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }],
    include: {
      assignments: {
        include: { user: { select: { nombre: true } } }
      }
    }
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  const { id: projectId } = await ctx.params;
  
  if (!projectId || projectId.trim() === "") {
    return NextResponse.json({ error: "El proyecto es obligatorio para crear una tarea" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ 
    where: { id: projectId },
    include: { sharedWith: { select: { id: true } } }
  });
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  try {
    const body = await req.json();
    const nombre = String(body.nombre ?? "").trim();
    const disciplina = parseTaskDiscipline(body.disciplina);
    const complejidad = parseTaskComplexity(body.complejidad);
    const actividad = parseTaskActivity(body.actividad) ?? "MODELADO";
    const taskEstatus = parseTaskEstatus(body.taskEstatus) ?? "PENDIENTE";
    const fechaRaw = body.fechaTermino;
    const completado = Boolean(body.completado);
    const comentarios = String(body.comentarios ?? "");
    const clienteNombre = body.clienteNombre ? String(body.clienteNombre).trim() : null;
    const userIds: string[] = Array.isArray(body.userIds) ? body.userIds.filter((id: unknown) => typeof id === "string") : [];

    if (!nombre || !disciplina || !complejidad) {
      return NextResponse.json({ error: "Nombre, disciplina y complejidad son obligatorios" }, { status: 400 });
    }

    let fechaTermino: Date;
    if (typeof fechaRaw === "string") {
      fechaTermino = new Date(fechaRaw);
    } else {
      return NextResponse.json({ error: "Fecha de término inválida" }, { status: 400 });
    }
    if (Number.isNaN(fechaTermino.getTime())) {
      return NextResponse.json({ error: "Fecha de término inválida" }, { status: 400 });
    }

    let idsToShare: string[] = [];

    if (userIds.length > 0) {
      const allowedIds = new Set<string>();
      if (project.ownerId) allowedIds.add(project.ownerId);
      project.sharedWith.forEach((u) => allowedIds.add(u.id));
      idsToShare = userIds.filter((id) => !allowedIds.has(id));
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    const created = await prisma.projectTask.create({
      data: {
        projectId,
        nombre,
        disciplina,
        fechaTermino,
        complejidad,
        actividad,
        taskEstatus,
        completado,
        comentarios,
        clienteNombre,
        ownerId: userExists ? userId : null,
        assignments: userIds.length > 0 ? {
          create: userIds.map((id: string) => ({
            userId: id,
            isAccepted: false,
          }))
        } : undefined,
      },
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
    
    // Forzamos invalidación para que la nueva tarea se refleje en el frontend
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/proyectos");
    revalidatePath("/dashboard");
    
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/projects/[id]/tasks]", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "No se pudo crear la tarea";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
