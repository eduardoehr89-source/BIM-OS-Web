import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/notifications/[id] — marca una notificación individual como leída
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  await prisma.notification.updateMany({
    where: { id, userId },
    data: { leida: true },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/notifications/[id] — elimina una notificación individual
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  await prisma.notification.deleteMany({ where: { id, userId } });

  return NextResponse.json({ ok: true });
}
