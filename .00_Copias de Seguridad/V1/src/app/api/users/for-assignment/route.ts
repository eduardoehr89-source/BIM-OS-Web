import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

/** Lista todos los usuarios para asignación de tareas (sesión requerida). */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
  return NextResponse.json(users);
}
