import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Lista TODOS los usuarios (incluyendo al propio admin) para asignación de tareas.
 * Accesible con cualquier sesión activa.
 */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const users = await prisma.user.findMany({
      select: { id: true, nombre: true, tipo: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(users);
  } catch (err) {
    console.error("[for-assignment] error:", err);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
