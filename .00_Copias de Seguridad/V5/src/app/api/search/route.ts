import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ projects: [], tasks: [], clients: [], users: [] });

  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isAdmin = user?.tipo === "ADMIN";

  const projectWhere = isAdmin ? { nombre: { contains: q } } : {
    nombre: { contains: q },
    OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }]
  };

  const projects = await prisma.project.findMany({ where: projectWhere, take: 5, select: { id: true, nombre: true } });
  
  const tasks = await prisma.projectTask.findMany({ 
    where: { 
      nombre: { contains: q }, 
      ...(isAdmin ? {} : { OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }] })
    }, 
    take: 5, select: { id: true, nombre: true, projectId: true } 
  });
  
  const clients = await prisma.client.findMany({ 
    where: { 
      nombre: { contains: q },
      ...(isAdmin ? {} : { OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }] })
    }, 
    take: 5, select: { id: true, nombre: true } 
  });
  
  const users = isAdmin ? await prisma.user.findMany({
    where: { nombre: { contains: q } },
    take: 5, select: { id: true, nombre: true, tipo: true, rol: true }
  }) : [];

  return NextResponse.json({ projects, tasks, clients, users });
}
