import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        rol: true,
      },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: "Error fetch" }, { status: 500 });
  }
}
