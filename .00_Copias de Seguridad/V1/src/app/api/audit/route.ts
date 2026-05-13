import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
  const payload = await verifyToken(token);
  if (payload?.tipo !== "ADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
      include: {
        usuario: { select: { nombre: true, tipo: true, rol: true } }
      }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener auditoría" }, { status: 500 });
  }
}
