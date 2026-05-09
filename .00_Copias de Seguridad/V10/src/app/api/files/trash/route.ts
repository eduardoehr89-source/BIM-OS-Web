import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { projectFileTrashWhere } from "@/lib/project-file-filters";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tipo: true } });
  const isAdmin = user?.tipo === "ADMIN";

  const items = await prisma.projectFile.findMany({
    where: projectFileTrashWhere(userId, isAdmin),
    orderBy: { deletedAt: "desc" },
    select: {
      id: true,
      originalName: true,
      mimeType: true,
      size: true,
      deletedAt: true,
      deletedByUserId: true,
      projectId: true,
      project: { select: { id: true, nombre: true } },
      deletedByUser: { select: { id: true, nombre: true } },
    },
  });

  return NextResponse.json(items);
}
