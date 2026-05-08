import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;

  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const activo = searchParams.get("activo");
  const baseWhere = activo === "true" ? { activo: true } : activo === "false" ? { activo: false } : {};

  if (payload?.tipo === "ADMIN") {
    const clients = await prisma.client.findMany({
      where: baseWhere,
      orderBy: { nombre: "asc" },
      include: { _count: { select: { projects: true } } },
    });
    return NextResponse.json(clients);
  }

  const where = {
    ...baseWhere,
    ...(userId ? { OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }] } : {}),
  };

  const clients = await prisma.client.findMany({
    where,
    orderBy: { nombre: "asc" },
    include: { _count: { select: { projects: true } } },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  try {
    const body = await req.json();
    const nombre = String(body.nombre ?? "").trim();
    const activo = body.activo !== undefined ? Boolean(body.activo) : true;
    if (!nombre) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const created = await prisma.client.create({
      data: { nombre, activo, ownerId: userId },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear el cliente" }, { status: 400 });
  }
}
