import { NextResponse } from "next/server";
import { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { userCanAccessStoredFile } from "@/lib/file-access";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({
    where: { id },
    select: { id: true, projectId: true, isDeleted: true },
  });
  if (!file) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (file.isDeleted) return new NextResponse(null, { status: 204 });

  const member = await prisma.user.findUnique({ where: { id: userId }, select: { tipo: true } });
  const isAdmin = member?.tipo === "ADMIN";
  const allowed = await userCanAccessStoredFile(userId, isAdmin, file);
  if (!allowed) return NextResponse.json({ error: "Sin acceso" }, { status: 403 });

  await prisma.$transaction([
    prisma.project.updateMany({
      where: { bepFileId: id },
      data: { bepFileId: null, estatus: ProjectStatus.INCOMPLETO },
    }),
    prisma.client.updateMany({ where: { oirFileId: id }, data: { oirFileId: null } }),
    prisma.client.updateMany({ where: { airFileId: id }, data: { airFileId: null } }),
    prisma.client.updateMany({ where: { eirFileId: id }, data: { eirFileId: null } }),
    prisma.projectFile.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), deletedByUserId: userId },
    }),
  ]);

  return new NextResponse(null, { status: 204 });
}
