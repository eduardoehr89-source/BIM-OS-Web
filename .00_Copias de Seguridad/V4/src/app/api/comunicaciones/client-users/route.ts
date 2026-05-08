import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/comunicaciones-auth";

/** Lista usuarios vinculados a un cliente (dueño + compartidos) para agregar al canal. Solo ADMIN. */
export async function GET(req: Request) {
  const p = await getAuthPayload();
  if (!p || p.tipo !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const clientId = new URL(req.url).searchParams.get("clientId");
  if (!clientId) return NextResponse.json({ error: "clientId requerido" }, { status: 400 });

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      owner: { select: { id: true, nombre: true } },
      sharedWith: { select: { id: true, nombre: true } },
    },
  });
  if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

  const map = new Map<string, { id: string; nombre: string }>();
  if (client.owner) map.set(client.owner.id, client.owner);
  for (const u of client.sharedWith) map.set(u.id, u);

  return NextResponse.json({ users: [...map.values()] });
}
