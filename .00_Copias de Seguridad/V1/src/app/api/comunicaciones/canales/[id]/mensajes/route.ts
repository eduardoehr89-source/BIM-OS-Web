import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { canalAccessWhere } from "@/lib/canal-access";
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

  const meta = await prisma.canal.findUnique({ where: { id: canalId }, select: { tipo: true } });
  if (!meta) {
    return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });
  }

  const allowed = await prisma.canal.findFirst({
    where: canalAccessWhere(p, canalId, meta.tipo),
    select: { id: true },
  });
  if (!allowed) {
    const exists = await prisma.canal.findUnique({ where: { id: canalId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  try {
    const mensajesRaw = await prisma.canalMensaje.findMany({
      where: { canalId },
      select: {
        id: true,
        contenido: true,
        tipo: true,
        adjuntoUrl: true,
        createdAt: true,
        autor: { select: { id: true, nombre: true, tipo: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 250,
    });

    const mensajes = mensajesRaw.filter((m) => m.autor?.id).map((m) => ({
      ...m,
      autor: {
        id: m.autor!.id,
        nombre: m.autor!.nombre ?? "Usuario",
        tipo: m.autor!.tipo ?? "USER",
      },
    }));

    return NextResponse.json(mensajes);
  } catch (e) {
    console.error("[GET /api/comunicaciones/canales/.../mensajes]", e);
    return NextResponse.json([], { headers: { "x-bimos-list": "error" } });
  }
}

export async function POST(req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: canalId } = await ctx.params;

  const metaPost = await prisma.canal.findUnique({
    where: { id: canalId },
    select: { tipo: true, isDirect: true },
  });
  if (!metaPost) {
    return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });
  }

  const canalPost = await prisma.canal.findFirst({
    where: canalAccessWhere(p, canalId, metaPost.tipo),
    select: {
      id: true,
      permiteTexto: true,
      permiteVoz: true,
      permiteArchivos: true,
      permiteVideo: true,
    },
  });
  if (!canalPost) {
    const exists = await prisma.canal.findUnique({ where: { id: canalId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const isDm = metaPost.tipo === "DIRECT" || metaPost.isDirect === true;

  try {
    const body = await req.json();
    const tipo = parseTipo(body.tipo) ?? "TEXTO";
    const contenido = String(body.contenido ?? "").trim();
    const adjuntoUrl = body.adjuntoUrl != null ? String(body.adjuntoUrl).trim() || null : null;

    if (tipo === "TEXTO" && !contenido) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    if (tipo === "TEXTO" && !canalPost.permiteTexto && !isDm) {
      return NextResponse.json({ error: "Este canal no permite mensajes de texto" }, { status: 403 });
    }
    if (tipo === "ARCHIVO" && !canalPost.permiteArchivos && !isDm) {
      return NextResponse.json({ error: "Archivos no permitidos en este canal" }, { status: 403 });
    }
    if (tipo === "VOZ" && !canalPost.permiteVoz && !isDm) {
      return NextResponse.json({ error: "Voz no permitida en este canal" }, { status: 403 });
    }
    if (tipo === "VIDEO" && !canalPost.permiteVideo && !isDm) {
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
      include: { autor: { select: { id: true, nombre: true, tipo: true } } },
    });

    await prisma.canal.update({
      where: { id: canalId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    if (e instanceof Error) {
      console.error("[POST /api/comunicaciones/canales/.../mensajes]", e.message, "\n", e.stack);
    } else {
      console.error("[POST /api/comunicaciones/canales/.../mensajes]", e);
    }
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 500 });
  }
}
