import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload, isAdminUser } from "@/lib/comunicaciones-auth";
import { getCanalIfAccessible } from "@/lib/canal-access";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  try {
    const p = await getAuthPayload();
    if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id: canalId } = await ctx.params;

    const canal = await getCanalIfAccessible(p, canalId, {
      project: { select: { id: true, nombre: true } },
      miembros: {
        include: { usuario: { select: { id: true, nombre: true } } },
      },
    });

    if (!canal) {
      const exists = await prisma.canal.findUnique({ where: { id: canalId }, select: { id: true } });
      if (!exists) return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });
      return NextResponse.json({ error: "No tienes acceso a este canal" }, { status: 403 });
    }

    const isDirect = canal.tipo === "DIRECT";
    const peerUsuario = isDirect
      ? (() => {
          const other = canal.miembros.find((m) => m.usuarioId !== p.id);
          const u = other?.usuario;
          return u?.id ? { id: u.id, nombre: u.nombre ?? "Usuario" } : null;
        })()
      : null;

    return NextResponse.json({
      ...canal,
      isAdmin: isDirect ? false : isAdminUser(p),
      isDirect,
      peerUsuario,
    });
  } catch (e) {
    console.error("[GET /api/comunicaciones/canales/[id]]", e);
    return NextResponse.json({ error: "Canal no disponible" }, { status: 400 });
  }
}

export async function PATCH(req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p || !isAdminUser(p)) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const { id: canalId } = await ctx.params;

  const metaPatch = await prisma.canal.findUnique({ where: { id: canalId }, select: { tipo: true } });
  if (metaPatch?.tipo === "DIRECT") {
    return NextResponse.json({ error: "Los chats privados no se editan como canal grupal" }, { status: 400 });
  }

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
