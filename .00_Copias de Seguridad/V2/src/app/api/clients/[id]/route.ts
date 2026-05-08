import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveRouteIdParam } from "@/lib/route-params";
import { getCurrentUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> | { id: string } };

export async function GET(_req: Request, ctx: Params) {
  try {
    const id = await resolveRouteIdParam(ctx.params);
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { nombre: "asc" },
          include: {
            files: true,
            tasks: { orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }] },
          },
        },
      },
    });
    if (!client) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(client);
  } catch (e) {
    console.error("[GET /api/clients/[id]]", e);
    return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: Params) {
  const id = await resolveRouteIdParam(ctx.params);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await req.json();
    const data: { nombre?: string; activo?: boolean } = {};
    if (body.nombre !== undefined) data.nombre = String(body.nombre).trim();
    if (body.activo !== undefined) data.activo = Boolean(body.activo);
    if (data.nombre === "") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    const updated = await prisma.client.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}

export async function DELETE(req: Request, ctx: Params) {
  const id = await resolveRouteIdParam(ctx.params);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const url = new URL(req.url);
  const adminPin = url.searchParams.get("adminPin");
  if (!adminPin) return NextResponse.json({ error: "PIN de administrador requerido" }, { status: 400 });

  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.rol !== "ADMIN" || user.pin !== adminPin) {
    return NextResponse.json({ error: "PIN incorrecto o permisos insuficientes" }, { status: 403 });
  }

  try {
    await prisma.client.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 400 });
  }
}
