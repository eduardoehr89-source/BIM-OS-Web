import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessCanal, getAuthPayload } from "@/lib/comunicaciones-auth";
import type { CanalMensajeTipo } from "@/generated/prisma";

type Params = { params: Promise<{ id: string }> };

const TIPOS: CanalMensajeTipo[] = ["TEXTO", "ARCHIVO", "VOZ", "VIDEO"];

function parseTipo(v: unknown): CanalMensajeTipo | null {
  const s = String(v ?? "").toUpperCase();
  return TIPOS.includes(s as CanalMensajeTipo) ? (s as CanalMensajeTipo) : null;
}

export async function GET(_req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: canalId } = await ctx.params;
  if (!(await canAccessCanal(p, canalId))) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const mensajes = await prisma.canalMensaje.findMany({
    where: { canalId },
    include: { autor: { select: { id: true, nombre: true } } },
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  return NextResponse.json(mensajes);
}

export async function POST(req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: canalId } = await ctx.params;
  if (!(await canAccessCanal(p, canalId))) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const canal = await prisma.canal.findUnique({ where: { id: canalId } });
  if (!canal) return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });

  try {
    const body = await req.json();
    const tipo = parseTipo(body.tipo) ?? "TEXTO";
    const contenido = String(body.contenido ?? "").trim();
    const adjuntoUrl = body.adjuntoUrl != null ? String(body.adjuntoUrl).trim() || null : null;

    if (tipo === "TEXTO" && !contenido) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    if (tipo === "TEXTO" && !canal.permiteTexto) {
      return NextResponse.json({ error: "Este canal no permite mensajes de texto" }, { status: 403 });
    }
    if (tipo === "ARCHIVO" && !canal.permiteArchivos) {
      return NextResponse.json({ error: "Archivos no permitidos en este canal" }, { status: 403 });
    }
    if (tipo === "VOZ" && !canal.permiteVoz) {
      return NextResponse.json({ error: "Voz no permitida en este canal" }, { status: 403 });
    }
    if (tipo === "VIDEO" && !canal.permiteVideo) {
      return NextResponse.json({ error: "Video no permitido en este canal" }, { status: 403 });
    }

    const msg = await prisma.canalMensaje.create({
      data: {
        canalId,
        autorId: p.id,
        tipo,
        contenido: contenido || (adjuntoUrl ? "(adjunto)" : ""),
        adjuntoUrl,
      },
      include: { autor: { select: { id: true, nombre: true } } },
    });

    await prisma.canal.update({
      where: { id: canalId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    console.error("[POST mensajes]", e);
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 500 });
  }
}
