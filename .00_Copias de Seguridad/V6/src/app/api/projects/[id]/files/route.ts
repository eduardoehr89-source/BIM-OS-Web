import { NextResponse } from "next/server";
import { ProjectStatus, TechnicalDocType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { assertPdfFilename, assertBepDocFilename } from "@/lib/pdf";
import { parseTechnicalDocType } from "@/lib/project-enums";
import { saveProjectUpload } from "@/lib/storage";
import { unlink } from "node:fs/promises";
import path from "node:path";

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

  const member = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipo: true },
  });
  const isAdmin = member?.tipo === "ADMIN";
  const allowed =
    isAdmin ||
    project.ownerId === userId ||
    (await prisma.project.count({
      where: { id: projectId, sharedWith: { some: { id: userId } } },
    })) > 0;

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

  const uploaderId = await getCurrentUserId();

  const created = [];
  try {
    for (const file of validFiles) {
      if (technicalDocType) {
        if (technicalDocType === TechnicalDocType.BEP) {
          assertBepDocFilename(file.name);
        } else {
          assertPdfFilename(file.name);
        }
      }
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

      created.push(row);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al guardar";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json(created, { status: 201 });
}
