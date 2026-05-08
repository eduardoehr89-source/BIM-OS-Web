import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { canOpenDirectMessage, openOrCreateDirectCanal } from "@/lib/canal-access";

/** Conversaciones directas del usuario actual. */
export async function GET() {
  try {
    const p = await getAuthPayload();
    if (!p?.id) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const rows = await prisma.canal.findMany({
      where: { tipo: "DIRECT", miembros: { some: { usuarioId: p.id } } },
      include: {
        miembros: { include: { usuario: { select: { id: true, nombre: true } } } },
        _count: { select: { mensajes: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const conversations = rows
      .map((c) => {
        const peerM = c.miembros.find((m) => m.usuarioId !== p.id);
        const u = peerM?.usuario;
        const peer = u?.id ? { id: u.id, nombre: u.nombre ?? "Usuario" } : null;
        return {
          id: c.id,
          peer,
          mensajes: c._count?.mensajes ?? 0,
          updatedAt: c.updatedAt.toISOString(),
        };
      })
      .filter((row) => row.id);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("[GET /api/comunicaciones/direct]", error);
    return NextResponse.json([], { headers: { "x-bimos-list": "error" } });
  }
}

/** Abre o crea DM con peerUserId (idempotente dentro de transacción). */
export async function POST(req: Request) {
  try {
    const p = await getAuthPayload();
    if (!p?.id) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const peerUserId = String((body as { peerUserId?: unknown }).peerUserId ?? "").trim();
    if (!peerUserId) {
      return NextResponse.json({ error: "peerUserId requerido" }, { status: 400 });
    }

    if (!(await canOpenDirectMessage(p, peerUserId))) {
      return NextResponse.json({ error: "No puedes iniciar chat con este usuario" }, { status: 403 });
    }

    const canalId = await openOrCreateDirectCanal(p.id, peerUserId);
    return NextResponse.json({ canalId });
  } catch (error) {
    console.error("DEBUG ERROR API:", error);
    return NextResponse.json({ error: "No se pudo abrir el chat" }, { status: 500 });
  }
}
