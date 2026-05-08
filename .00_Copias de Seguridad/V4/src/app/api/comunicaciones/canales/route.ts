import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload, isAdminUser } from "@/lib/comunicaciones-auth";

export async function GET() {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const canales = await prisma.canal.findMany({
    where: isAdminUser(p) ? undefined : { miembros: { some: { usuarioId: p.id } } },
    include: {
      project: { select: { id: true, nombre: true } },
      _count: { select: { mensajes: true, miembros: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(canales);
}

export async function POST(req: Request) {
  const p = await getAuthPayload();
  if (!p || !isAdminUser(p)) {
    return NextResponse.json({ error: "Solo administradores pueden crear canales" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const nombre = String(body.nombre ?? "").trim();
    if (!nombre) {
      return NextResponse.json({ error: "El nombre del canal es obligatorio" }, { status: 400 });
    }

    const tema = body.tema != null ? String(body.tema).trim() || null : null;
    const descripcion = body.descripcion != null ? String(body.descripcion).trim() || null : null;
    const proyectoId = body.proyectoId != null && String(body.proyectoId).trim() !== "" ? String(body.proyectoId).trim() : null;

    const permiteTexto = body.permiteTexto !== false;
    const permiteVoz = body.permiteVoz !== false;
    const permiteArchivos = body.permiteArchivos !== false;
    const permiteVideo = body.permiteVideo !== false;

    const usuarioIdsRaw = Array.isArray(body.usuarioIds) ? body.usuarioIds : [];
    const usuarioIds = [...new Set([...usuarioIdsRaw.map((x: unknown) => String(x)), p.id])];

    if (proyectoId) {
      const proj = await prisma.project.findUnique({ where: { id: proyectoId } });
      if (!proj) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 400 });
    }

    const canal = await prisma.$transaction(async (tx) => {
      const c = await tx.canal.create({
        data: {
          nombre,
          tema,
          descripcion,
          proyectoId,
          permiteTexto,
          permiteVoz,
          permiteArchivos,
          permiteVideo,
        },
      });
      await tx.canalUsuario.createMany({
        data: usuarioIds.map((usuarioId) => ({ canalId: c.id, usuarioId })),
      });
      return tx.canal.findUniqueOrThrow({
        where: { id: c.id },
        include: {
          project: { select: { id: true, nombre: true } },
          _count: { select: { mensajes: true, miembros: true } },
        },
      });
    });

    return NextResponse.json(canal, { status: 201 });
  } catch (e) {
    console.error("[POST /api/comunicaciones/canales]", e);
    return NextResponse.json({ error: "No se pudo crear el canal" }, { status: 500 });
  }
}
