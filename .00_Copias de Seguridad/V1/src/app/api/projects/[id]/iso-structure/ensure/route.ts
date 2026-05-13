import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.tipo === "ADMIN";
  
  const userId = await getCurrentUserId();
  if (!userId && !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  // Si userId está presente, verificamos acceso en DB. Si es admin por token (rescate o DB), pasa directo.
  if (!isAdmin && userId) {
    if (!(await canAccessProject(userId, projectId, isAdmin))) {
      return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
    }
  }

  try {
    await ensureIsoAttachmentStructure(projectId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[POST iso-structure/ensure]", e);
    return NextResponse.json({ error: "No se pudo asegurar la estructura ISO" }, { status: 500 });
  }
}
