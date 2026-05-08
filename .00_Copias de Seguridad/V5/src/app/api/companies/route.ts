import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
  const payload = await verifyToken(token);
  if (!payload || payload.tipo !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const companies = await prisma.client.findMany({
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true }
    });
    return NextResponse.json(companies);
  } catch {
    return NextResponse.json({ error: "Error fetch" }, { status: 500 });
  }
}
