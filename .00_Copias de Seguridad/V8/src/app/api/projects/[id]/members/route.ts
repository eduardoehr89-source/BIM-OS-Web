import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: projectId } = await ctx.params;
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, nombre: true } },
      sharedWith: { select: { id: true, nombre: true } }
    }
  });

  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const members = new Map<string, { id: string, nombre: string }>();
  if (project.owner) {
    members.set(project.owner.id, project.owner);
  }
  project.sharedWith.forEach(u => members.set(u.id, u));

  return NextResponse.json(Array.from(members.values()));
}
