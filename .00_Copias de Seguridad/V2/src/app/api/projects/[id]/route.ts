import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { parseProjectStatus } from "@/lib/project-status";
import { resolveRouteIdParam } from "@/lib/route-params";
import { getCurrentUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> | { id: string } };

export async function GET(_req: Request, ctx: Params) {
  try {
    const id = await resolveRouteIdParam(ctx.params);
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: true, files: true, tasks: { orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }] } },
    });
    if (!project) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(project);
  } catch (e) {
    console.error("[GET /api/projects/[id]]", e);
    return NextResponse.json({ error: "Error al obtener el proyecto" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: Params) {
  const id = await resolveRouteIdParam(ctx.params);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await req.json();
    const data: {
      nombre?: string;
      ubicacion?: string;
      ano?: number;
      tipologia?: string;
      estatus?: (typeof ProjectStatus)[keyof typeof ProjectStatus];
      clientId?: string;
    } = {};

    if (body.nombre !== undefined) data.nombre = String(body.nombre).trim();
    if (body.ubicacion !== undefined) data.ubicacion = String(body.ubicacion).trim();
    if (body.ano !== undefined) {
      const ano = Math.floor(Number(body.ano));
      if (!Number.isFinite(ano) || ano < 1900 || ano > 2100) {
        return NextResponse.json({ error: "Año inválido" }, { status: 400 });
      }
      data.ano = ano;
    }
    if (body.tipologia !== undefined) {
      const tipologia = String(body.tipologia).trim();
      if (!tipologia) return NextResponse.json({ error: "La tipología es obligatoria" }, { status: 400 });
      data.tipologia = tipologia;
    }
    if (body.estatus !== undefined) {
      const s = parseProjectStatus(body.estatus);
      if (!s) return NextResponse.json({ error: "Estatus inválido" }, { status: 400 });
      data.estatus = ProjectStatus[s];
    }
    if (body.clientId !== undefined) {
      const cid = String(body.clientId).trim();
      const exists = await prisma.client.findUnique({ where: { id: cid } });
      if (!exists) return NextResponse.json({ error: "Cliente no existe" }, { status: 400 });
      data.clientId = cid;
    }

    const updated = await prisma.project.update({
      where: { id },
      data,
      include: { client: true, files: true, tasks: { orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }] } },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PATCH /api/projects/[id]]", e);
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
    const files = await prisma.projectFile.findMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });
    for (const f of files) {
      try {
        const abs = path.join(process.cwd(), f.storedPath);
        await unlink(abs);
      } catch {
        /* ignore missing files */
      }
    }
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("[DELETE /api/projects/[id]]", e);
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 400 });
  }
}
