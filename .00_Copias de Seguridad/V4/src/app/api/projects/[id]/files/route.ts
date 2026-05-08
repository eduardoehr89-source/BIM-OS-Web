import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertPdfFilename } from "@/lib/pdf";
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

  const created = [];
  try {
    for (const file of validFiles) {
      if (technicalDocType) {
        assertPdfFilename(file.name);
      }
      const existing = await prisma.projectFile.findFirst({
        where: { projectId, originalName: file.name },
      });

      const { storedPath, size, mimeType } = await saveProjectUpload(projectId, file.name, file);
      
      let row;
      if (existing) {
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
      created.push(row);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al guardar";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json(created, { status: 201 });
}
