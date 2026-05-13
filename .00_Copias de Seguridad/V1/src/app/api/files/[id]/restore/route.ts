import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { userCanAccessStoredFile } from "@/lib/file-access";

type Params = { params: Promise<{ id: string }> };

/** Restaura un archivo desde la papelera al proyecto (soft-delete revert). */
export async function POST(_req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({
    where: { id },
    select: { id: true, projectId: true, isDeleted: true },
  });
  if (!file) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (!file.isDeleted) {
    return NextResponse.json({ error: "El archivo no está en la papelera" }, { status: 400 });
  }

  const member = await prisma.user.findUnique({ where: { id: userId }, select: { tipo: true } });
  const isAdmin = member?.tipo === "ADMIN";
  const allowed = await userCanAccessStoredFile(userId, isAdmin, file);
  if (!allowed) return NextResponse.json({ error: "Sin acceso" }, { status: 403 });

  await prisma.projectFile.update({
    where: { id },
    data: { isDeleted: false, deletedAt: null, deletedByUserId: null },
  });

  return new NextResponse(null, { status: 204 });
}
