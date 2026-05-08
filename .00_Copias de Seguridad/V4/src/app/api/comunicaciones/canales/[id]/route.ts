import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessCanal, getAuthPayload, isAdminUser } from "@/lib/comunicaciones-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: canalId } = await ctx.params;
  const canal = await prisma.canal.findUnique({
    where: { id: canalId },
    include: {
      project: { select: { id: true, nombre: true } },
      miembros: {
        include: { usuario: { select: { id: true, nombre: true } } },
      },
      _count: { select: { mensajes: true } },
    },
  });
  if (!canal) return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });

  if (!(await canAccessCanal(p, canalId))) {
    return NextResponse.json({ error: "No tienes acceso a este canal" }, { status: 403 });
  }

  return NextResponse.json({ ...canal, isAdmin: isAdminUser(p) });
}

export async function PATCH(req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p || !isAdminUser(p)) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const { id: canalId } = await ctx.params;

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.nombre != null) data.nombre = String(body.nombre).trim();
    if (body.tema !== undefined) data.tema = body.tema == null ? null : String(body.tema).trim() || null;
    if (body.descripcion !== undefined) data.descripcion = body.descripcion == null ? null : String(body.descripcion).trim() || null;
    if (body.permiteTexto !== undefined) data.permiteTexto = Boolean(body.permiteTexto);
    if (body.permiteVoz !== undefined) data.permiteVoz = Boolean(body.permiteVoz);
    if (body.permiteArchivos !== undefined) data.permiteArchivos = Boolean(body.permiteArchivos);
    if (body.permiteVideo !== undefined) data.permiteVideo = Boolean(body.permiteVideo);
    if (body.proyectoId !== undefined) {
      data.proyectoId = body.proyectoId == null || String(body.proyectoId) === "" ? null : String(body.proyectoId);
    }

    if (data.nombre === "") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    const canal = await prisma.canal.update({
      where: { id: canalId },
      data,
      include: {
        project: { select: { id: true, nombre: true } },
        miembros: { include: { usuario: { select: { id: true, nombre: true } } } },
      },
    });
    return NextResponse.json(canal);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
  }
}
