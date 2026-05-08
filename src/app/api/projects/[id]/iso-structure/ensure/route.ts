import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { ensureIsoAttachmentStructure } from "@/lib/iso-attachments";

type Params = { params: Promise<{ id: string }> };

async function canAccessProject(userId: string, projectId: string, isAdmin: boolean): Promise<boolean> {
  if (isAdmin) return true;
  const n = await prisma.project.count({
    where: {
      id: projectId,
      OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }],
    },
  });
  return n > 0;
}

export async function POST(_req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  const member = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipo: true },
  });
  const isAdmin = member?.tipo === "ADMIN";
  if (!(await canAccessProject(userId, projectId, isAdmin))) {
    return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
  }

  try {
    await ensureIsoAttachmentStructure(projectId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[POST iso-structure/ensure]", e);
    return NextResponse.json({ error: "No se pudo asegurar la estructura ISO" }, { status: 500 });
  }
}
