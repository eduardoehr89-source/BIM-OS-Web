import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { texto, taskId, projectId } = await req.json();

    if (!texto || (!taskId && !projectId)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        texto: texto.trim(),
        authorId: userId,
        taskId: taskId || undefined,
        projectId: projectId || undefined,
      },
      include: {
        author: {
          select: { nombre: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear comentario" }, { status: 500 });
  }
}
