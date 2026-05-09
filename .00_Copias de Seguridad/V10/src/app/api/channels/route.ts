import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET /api/channels — retorna los canales donde el usuario es miembro (o todos si es ADMIN)
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.tipo === "ADMIN";

  const canales = await prisma.canal.findMany({
    where: isAdmin ? undefined : { miembros: { some: { usuarioId: userId } } },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(canales);
}
