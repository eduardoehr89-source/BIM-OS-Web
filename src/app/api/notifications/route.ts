import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

// ── GET /api/notifications ────────────────────────────────────────────────────
// Devuelve las últimas 50 notificaciones del usuario autenticado.
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      tipo: true,
      titulo: true,
      cuerpo: true,
      projectId: true,
      fileName: true,
      uploaderName: true,
      leida: true,
      createdAt: true,
    },
  });

  return NextResponse.json(items);
}

// ── PATCH /api/notifications ──────────────────────────────────────────────────
// Body: { action: "mark_all_read" } — marca todas como leídas.
export async function PATCH(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = (await req.json()) as { action?: string };

  if (body.action === "mark_all_read") {
    await prisma.notification.updateMany({
      where: { userId, leida: false },
      data: { leida: true },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
}

// ── DELETE /api/notifications ─────────────────────────────────────────────────
// Elimina TODAS las notificaciones del usuario (botón "Limpiar").
export async function DELETE() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.notification.deleteMany({ where: { userId } });
  return NextResponse.json({ ok: true });
}
