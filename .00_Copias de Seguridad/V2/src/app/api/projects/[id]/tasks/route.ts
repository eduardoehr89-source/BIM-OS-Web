import { NextResponse } from "next/server";
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
      ...(userId ? { OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }] } : {})
    },
    orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }],
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  const { id: projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
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
        ownerId: userId,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear la tarea" }, { status: 400 });
  }
}
