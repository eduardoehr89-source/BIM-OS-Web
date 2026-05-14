import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { Prisma } from "@/generated/prisma";
import { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { PROJECT_API_DETAIL_INCLUDE } from "@/lib/project-api-include";
import { parseProjectStatus } from "@/lib/project-status";
import {
  parseDisciplinesFromBody,
  parseOptionalIsoDate,
  parseProjectCodeField,
} from "@/lib/project-disciplines";
import { resolveRouteIdParam } from "@/lib/route-params";
import { getCurrentUserId } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { requireAdminSession } from "@/lib/project-rbac";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  try {
    const id = await resolveRouteIdParam(ctx.params);
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const project = await prisma.project.findUnique({
      where: { id },
      include: PROJECT_API_DETAIL_INCLUDE,
    });
    if (!project) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(project);
  } catch (e) {
    console.error("[GET /api/projects/[id]]", e);
    return NextResponse.json({ error: "Error al obtener el proyecto" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: Params) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const id = await resolveRouteIdParam(ctx.params);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const existing = await prisma.project.findUnique({ where: { id }, select: { bepFileId: true } });
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const data: {
      nombre?: string;
      ubicacion?: string;
      ano?: number;
      tipologia?: string;
      estatus?: (typeof ProjectStatus)[keyof typeof ProjectStatus];
      clientId?: string;
      disciplinesInvolved?: string;
      projectCode?: string | null;
      milestoneSd?: Date | null;
      milestoneDd?: Date | null;
      milestoneCd?: Date | null;
      milestoneLicitacion?: Date | null;
      milestoneAsBuilt?: Date | null;
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
    if (body.disciplines !== undefined) {
      try {
        data.disciplinesInvolved = parseDisciplinesFromBody(body.disciplines) ?? "";
      } catch {
        data.disciplinesInvolved = "";
      }
    }
    if (body.projectCode !== undefined) {
      data.projectCode = parseProjectCodeField(body.projectCode);
    }
    const ms = parseOptionalIsoDate(body.milestoneSd);
    const md = parseOptionalIsoDate(body.milestoneDd);
    const mc = parseOptionalIsoDate(body.milestoneCd);
    const ml = parseOptionalIsoDate(body.milestoneLicitacion);
    const ma = parseOptionalIsoDate(body.milestoneAsBuilt);
    if (ms !== undefined) data.milestoneSd = ms;
    if (md !== undefined) data.milestoneDd = md;
    if (mc !== undefined) data.milestoneCd = mc;
    if (ml !== undefined) data.milestoneLicitacion = ml;
    if (ma !== undefined) data.milestoneAsBuilt = ma;

    if (body.estatus !== undefined && existing.bepFileId) {
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

    if (!existing.bepFileId) {
      data.estatus = ProjectStatus.INCOMPLETO;
    }

    if (Object.keys(data).length === 0) {
      const unchanged = await prisma.project.findUnique({ where: { id }, include: PROJECT_API_DETAIL_INCLUDE });
      if (!unchanged) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
      return NextResponse.json(unchanged);
    }

    const updated = await prisma.project.update({
      where: { id },
      data,
      include: PROJECT_API_DETAIL_INCLUDE,
    });
    await logAudit("EDITAR", "PROJECT", `Proyecto actualizado: ${updated.nombre}`);
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "El código de proyecto ya existe" }, { status: 400 });
    }
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
  const providedPin = String(adminPin).trim();

  if (!user) {
    console.error("[DELETE /api/projects/[id]] 403: Usuario no encontrado.");
    return NextResponse.json({ error: "PIN incorrecto o permisos insuficientes" }, { status: 403 });
  }
  
  if (user.tipo !== "ADMIN") {
    console.error("[DELETE /api/projects/[id]] 403: Usuario no es ADMIN.");
    return NextResponse.json({ error: "PIN incorrecto o permisos insuficientes" }, { status: 403 });
  }

  if (user.password !== providedPin) {
    console.error(`[DELETE /api/projects/[id]] 403: Contraseña incorrecta.`);
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
    await logAudit("BORRAR", "PROJECT", `Proyecto eliminado: ${id}`);
    
    // Al eliminar un proyecto, forzamos revalidar la caché general de listados.
    revalidatePath("/proyectos");
    revalidatePath("/dashboard");
    
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("[DELETE /api/projects/[id]]", e);
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 400 });
  }
}
