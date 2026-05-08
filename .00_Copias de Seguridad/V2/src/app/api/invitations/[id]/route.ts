import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  try {
    const { action } = await req.json(); // "ACCEPT" o "REJECT"

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation || invitation.receiverId !== userId || invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Invitación inválida" }, { status: 400 });
    }

    if (action === "ACCEPT") {
      // Conectar recurso compartido
      if (invitation.resourceType === "PROJECT") {
        await prisma.project.update({
          where: { id: invitation.resourceId },
          data: { sharedWith: { connect: { id: userId } } },
        });
      } else if (invitation.resourceType === "CLIENT") {
        await prisma.client.update({
          where: { id: invitation.resourceId },
          data: { sharedWith: { connect: { id: userId } } },
        });
      } else if (invitation.resourceType === "TASK") {
        await prisma.projectTask.update({
          where: { id: invitation.resourceId },
          data: { sharedWith: { connect: { id: userId } } },
        });
      }
      
      await prisma.invitation.update({
        where: { id },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json({ success: true });
    } else if (action === "REJECT") {
      await prisma.invitation.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
