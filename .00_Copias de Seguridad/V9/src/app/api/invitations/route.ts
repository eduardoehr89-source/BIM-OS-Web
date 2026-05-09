import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const invitations = await prisma.invitation.findMany({
    where: { receiverId: userId, status: "PENDING" },
    include: { sender: { select: { nombre: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invitations);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { receiverId, resourceType, resourceId } = await req.json();
    if (!receiverId || !resourceType || !resourceId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    if (receiverId === userId) {
      return NextResponse.json({ error: "No puedes invitarte a ti mismo" }, { status: 400 });
    }

    // Verificar que el recurso pertenezca al sender
    let isOwner = false;
    if (resourceType === "PROJECT") {
      const r = await prisma.project.findUnique({ where: { id: resourceId } });
      isOwner = r?.ownerId === userId;
    } else if (resourceType === "CLIENT") {
      const r = await prisma.client.findUnique({ where: { id: resourceId } });
      isOwner = r?.ownerId === userId;
    } else if (resourceType === "TASK") {
      const r = await prisma.projectTask.findUnique({ where: { id: resourceId } });
      isOwner = r?.ownerId === userId;
    }

    if (!isOwner) {
      return NextResponse.json({ error: "No tienes permisos para compartir este recurso" }, { status: 403 });
    }

    // Verificar si ya existe
    const existing = await prisma.invitation.findFirst({
      where: { receiverId, resourceType, resourceId, status: "PENDING" },
    });
    if (existing) {
      return NextResponse.json({ error: "Ya hay una invitación pendiente para este usuario" }, { status: 400 });
    }

    const invitation = await prisma.invitation.create({
      data: { senderId: userId, receiverId, resourceType, resourceId },
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
