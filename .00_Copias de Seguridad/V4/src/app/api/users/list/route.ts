import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedProjects: { include: { sharedWith: true, owner: true } },
        sharedProjects: { include: { sharedWith: true, owner: true } },
      }
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const allowedUserIds = new Set<string>();
    allowedUserIds.add(user.id);

    if (user.organizationId) {
      const orgUsers = await prisma.user.findMany({
        where: { organizationId: user.organizationId }
      });
      orgUsers.forEach(u => allowedUserIds.add(u.id));
    }

    const allProjects = [...user.ownedProjects, ...user.sharedProjects];
    for (const p of allProjects) {
      if (p.ownerId) allowedUserIds.add(p.ownerId);
      p.sharedWith.forEach(u => allowedUserIds.add(u.id));
    }

    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(allowedUserIds) } },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        rol: true,
        organization: { select: { nombre: true, tipo: true } },
      },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: "Error fetch" }, { status: 500 });
  }
}
