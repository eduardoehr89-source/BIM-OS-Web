import path from "node:path";
import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { ProjectStatus, TechnicalDocType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { parseIsoAttachmentContainer } from "@/lib/iso-attachments";
import { parseTechnicalDocType } from "@/lib/project-enums";
import { saveProjectUpload } from "@/lib/storage";
import { canUserAccessProjectFiles } from "@/lib/project-file-upload-access";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Params) {
  const { id: projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const allowed = await canUserAccessProjectFiles(projectId, userId);

  if (!allowed) {
    return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f && typeof f.name === "string" && f.size > 0);

  if (validFiles.length === 0) {
    return NextResponse.json({ error: "No se enviaron archivos" }, { status: 400 });
  }

  const techRaw = formData.get("technicalDocType");
  const technicalDocType = parseTechnicalDocType(typeof techRaw === "string" ? techRaw : "");

  const isoRaw = formData.get("isoContainer");
  const isoContainer = !technicalDocType ? parseIsoAttachmentContainer(typeof isoRaw === "string" ? isoRaw : "") : null;

  if (!technicalDocType && !isoContainer) {
    return NextResponse.json(
      { error: "Selecciona una carpeta ISO (WIP, SHARED, PUBLISHED o ARCHIVED) para los adjuntos" },
      { status: 400 },
    );
  }

  const isoSubfolderRaw = formData.get("isoSubfolderId");
  const isoSubfolderIdStr = typeof isoSubfolderRaw === "string" ? isoSubfolderRaw.trim() : "";
  let resolvedSubfolderId: string | null = null;
  if (!technicalDocType && isoContainer) {
    if (isoSubfolderIdStr) {
      const sf = await prisma.attachmentSubfolder.findFirst({
        where: { id: isoSubfolderIdStr, projectId, container: isoContainer },
        select: { id: true },
      });
      if (!sf) {
        return NextResponse.json(
          { error: "Subcarpeta no válida para este proyecto o contenedor" },
          { status: 400 },
        );
      }
      resolvedSubfolderId = sf.id;
    }
  }

  const uploaderId = await getCurrentUserId();

  const created = [];
  try {
    for (const file of validFiles) {
      const existing = await prisma.projectFile.findFirst({
        where: { projectId, originalName: file.name, isDeleted: false },
      });
      const trashedSameName = existing
        ? null
        : await prisma.projectFile.findFirst({
            where: { projectId, originalName: file.name, isDeleted: true },
          });

      const { storedPath, size, mimeType } = await saveProjectUpload(projectId, file.name, file);

      let row;
      if (trashedSameName) {
        try {
          const oldPath = path.join(process.cwd(), trashedSameName.storedPath);
          await unlink(oldPath);
        } catch {}
        row = await prisma.projectFile.update({
          where: { id: trashedSameName.id },
          data: {
            storedPath,
            mimeType,
            size,
            technicalDocType: technicalDocType ?? undefined,
            version: (trashedSameName.version || 1) + 1,
            uploadedAt: new Date(),
            isDeleted: false,
            deletedAt: null,
            deletedByUserId: null,
          },
        });
      } else if (existing) {
        row = await prisma.projectFile.update({
          where: { id: existing.id },
          data: {
            storedPath,
            mimeType,
            size,
            technicalDocType: technicalDocType ?? undefined,
            version: (existing.version || 1) + 1,
            uploadedAt: new Date(),
          },
        });

        try {
          const oldPath = path.join(process.cwd(), existing.storedPath);
          await unlink(oldPath);
        } catch {}
      } else {
        row = await prisma.projectFile.create({
          data: {
            projectId,
            originalName: file.name,
            storedPath,
            mimeType,
            size,
            technicalDocType: technicalDocType ?? undefined,
          },
        });
      }

      if (technicalDocType === TechnicalDocType.BEP) {
        const proj = await prisma.project.findUnique({
          where: { id: projectId },
          select: { estatus: true },
        });
        await prisma.project.update({
          where: { id: projectId },
          data: {
            bepFileId: row.id,
            ...(proj?.estatus === ProjectStatus.INCOMPLETO ? { estatus: ProjectStatus.INICIO_PENDIENTE } : {}),
          },
        });
      }

      await prisma.fileUploadEvent.create({
        data: {
          projectId,
          projectFileId: row.id,
          uploaderId: uploaderId ?? null,
          originalName: row.originalName,
        },
      });

      if (!technicalDocType && isoContainer) {
        await prisma.attachment.upsert({
          where: { fileId: row.id },
          create: {
            projectId,
            fileId: row.id,
            container: isoContainer,
            subfolderId: resolvedSubfolderId,
          },
          update: {
            container: isoContainer,
            subfolderId: resolvedSubfolderId,
          },
        });
      }

      created.push(row);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al guardar";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json(created, { status: 201 });
}
