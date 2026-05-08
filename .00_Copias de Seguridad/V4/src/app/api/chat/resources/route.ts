import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // "file" | "task"

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tipo: true }
    });
    const isAdmin = user?.tipo === "ADMIN";

    const projectWhere = isAdmin ? {} : {
      OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }]
    };

    if (type === "task") {
      const tasks = await prisma.projectTask.findMany({
        where: isAdmin ? {} : {
          OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }]
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, nombre: true, project: { select: { nombre: true } } }
      });
      return NextResponse.json(tasks);
    } else {
      const files = await prisma.projectFile.findMany({
        where: { project: projectWhere },
        orderBy: { uploadedAt: "desc" },
        take: 20,
        select: { id: true, originalName: true, project: { select: { nombre: true } } }
      });
      return NextResponse.json(files);
    }
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
