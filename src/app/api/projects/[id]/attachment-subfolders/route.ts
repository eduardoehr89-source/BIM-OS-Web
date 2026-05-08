import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { parseIsoAttachmentContainer } from "@/lib/iso-attachments";
import {
  canUserAccessProjectFiles,
  canUserManageAttachmentSubfolders,
} from "@/lib/project-file-upload-access";

type Params = { params: Promise<{ id: string }> };

function normalizeSubfolderName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export async function POST(req: Request, ctx: Params) {
  const { id: projectId } = await ctx.params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [hasAccess, canFolders] = await Promise.all([
    canUserAccessProjectFiles(projectId, userId),
    canUserManageAttachmentSubfolders(userId),
  ]);
  if (!hasAccess) {
    return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
  }
  if (!canFolders) {
    return NextResponse.json({ error: "No tienes permiso para gestionar carpetas" }, { status: 403 });
  }

  let body: { container?: string; name?: string };
  try {
    body = (await req.json()) as { container?: string; name?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const container = parseIsoAttachmentContainer(String(body.container ?? ""));
  const name = normalizeSubfolderName(String(body.name ?? ""));
  if (!container) {
    return NextResponse.json({ error: "Contenedor ISO inválido" }, { status: 400 });
  }
  if (name.length < 1 || name.length > 120) {
    return NextResponse.json({ error: "Nombre de carpeta inválido (1–120 caracteres)" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  try {
    const row = await prisma.attachmentSubfolder.create({
      data: { projectId, container, name },
      select: { id: true, container: true, name: true },
    });
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear la carpeta (¿ya existe ese nombre en este contenedor?)" },
      { status: 409 },
    );
  }
}
