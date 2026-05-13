import { NextResponse } from "next/server";
import { ProjectStatus, TechnicalDocType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { parseIsoAttachmentContainer } from "@/lib/iso-attachments";
import { parseTechnicalDocType } from "@/lib/project-enums";
import { assertAllowedExtension } from "@/lib/storage";
import { canUserAccessProjectFiles } from "@/lib/project-file-upload-access";
import { deleteBlobByUrl, isBlobConfigured, putProjectFileBlob } from "@/lib/blob-storage";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function readUploadMeta(file: File): { size: number; mimeType: string } {
  assertAllowedExtension(file.name);
  return {
    size: typeof file.size === "number" && file.size >= 0 ? file.size : 0,
    mimeType: file.type?.trim() || "application/octet-stream",
  };
}

/**
 * Crea la tarea REVISAR y dos notificaciones al asignado.
 * Esta función SIEMPRE hace await — es sincrónica respecto al handler
 * para que Vercel no la cancele al retornar la respuesta.
 * Los errores son atrapados y logueados sin propagar.
 */
async function crearTareaYNotificaciones({
  projectId,
  projectNombre,
  fileId,
  fileName,
  assignedUserId,
  uploaderUserId,
  uploaderNombre,
}: {
  projectId: string;
  projectNombre: string;
  fileId: string;
  fileName: string;
  assignedUserId: string;
  uploaderUserId: string;
  uploaderNombre: string | null;
}) {
  try {
    // 1. Verificar que el usuario asignado existe
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedUserId },
      select: { id: true, nombre: true },
    });

    if (!assignedUser) {
      console.error("[upload/tarea] usuario asignado no encontrado:", assignedUserId);
      return;
    }

    // 2. Crear la tarea REVISAR vinculada al archivo
    const fechaTermino = new Date();
    fechaTermino.setDate(fechaTermino.getDate() + 7); // vence en 7 días

    const task = await prisma.projectTask.create({
      data: {
        projectId,
        nombre: `REVISAR: ${fileName}`,
        disciplina: "OTROS",
        fechaTermino,
        complejidad: "MEDIO",
        actividad: "DOCUMENTACION",
        taskEstatus: "PENDIENTE",
        relatedFileId: fileId,
        ownerId: uploaderUserId,
        assignments: {
          create: { userId: assignedUserId },
        },
      },
    });
    console.log(`[upload/tarea] ✓ Tarea creada: ${task.id} → "${fileName}" → asignado: ${assignedUser.nombre}`);

    // 3. Notificación: Tarea asignada
    await prisma.notification.create({
      data: {
        userId: assignedUserId,
        tipo: "TAREA_ASIGNADA",
        titulo: `Nueva tarea asignada en ${projectNombre}`,
        cuerpo: `Se te asignó revisar "${fileName}". Vence en 7 días.`,
        projectId,
        fileName,
        uploaderName: uploaderNombre,
      },
    });

    // 4. Notificación: Archivo cargado
    await prisma.notification.create({
      data: {
        userId: assignedUserId,
        tipo: "FILE_UPLOADED",
        titulo: `Archivo cargado en ${projectNombre}`,
        cuerpo: `${uploaderNombre ?? "Un usuario"} subió "${fileName}" y te lo asignó para revisión.`,
        projectId,
        fileName,
        uploaderName: uploaderNombre,
      },
    });

    console.log(`[upload/tarea] ✓ 2 notificaciones creadas para ${assignedUser.nombre}`);
  } catch (err) {
    // Error aislado — NO se propaga al handler principal
    console.error("[upload/tarea] fallo al crear tarea/notificaciones:", err);
  }
}

export async function POST(req: Request, ctx: Params) {
  const { id: projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  let auth = await getAuthPayload();
  let userId = auth?.id ?? null;
  if (!userId) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      auth = await verifyToken(authHeader.split(" ")[1]);
      userId = auth?.id ?? null;
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const allowed = await canUserAccessProjectFiles(projectId, userId, auth);
  if (!allowed) {
    return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "Almacenamiento no disponible: configura BLOB_READ_WRITE_TOKEN en el entorno" },
      { status: 503 },
    );
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
  const isoContainer = !technicalDocType
    ? parseIsoAttachmentContainer(typeof isoRaw === "string" ? isoRaw : "")
    : null;

  if (!technicalDocType && !isoContainer) {
    return NextResponse.json(
      { error: "Selecciona una carpeta ISO (WIP, SHARED, PUBLISHED o ARCHIVED) para los adjuntos" },
      { status: 400 },
    );
  }

  const isoSubfolderRaw = formData.get("isoSubfolderId");
  const isoSubfolderIdStr = typeof isoSubfolderRaw === "string" ? isoSubfolderRaw.trim() : "";
  let resolvedSubfolderId: string | null = null;
  if (!technicalDocType && isoContainer && isoSubfolderIdStr) {
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

  // ── Usuario asignado (campo opcional del formulario) ──────────────────────
  const assignedUserRaw = formData.get("assignedUserId");
  const assignedUserId =
    typeof assignedUserRaw === "string" && assignedUserRaw.trim()
      ? assignedUserRaw.trim()
      : null;

  console.log(`[upload] assignedUserId recibido: ${assignedUserId ?? "(ninguno)"}`);

  // ── Procesamiento de archivos ─────────────────────────────────────────────
  const created = [];
  try {
    for (const file of validFiles) {
      const meta = readUploadMeta(file);
      const uploaded = await putProjectFileBlob(projectId, file.name, file);
      const storedPath = uploaded.pathname;
      const storageKey = uploaded.downloadUrl;
      const size = uploaded.size > 0 ? uploaded.size : meta.size;

      const existing = await prisma.projectFile.findFirst({
        where: { projectId, originalName: file.name, isDeleted: false },
      });
      const trashedSameName = existing
        ? null
        : await prisma.projectFile.findFirst({
            where: { projectId, originalName: file.name, isDeleted: true },
          });

      if (trashedSameName?.storageKey) await deleteBlobByUrl(trashedSameName.storageKey);
      if (existing?.storageKey) await deleteBlobByUrl(existing.storageKey);

      let row;
      if (trashedSameName) {
        row = await prisma.projectFile.update({
          where: { id: trashedSameName.id },
          data: {
            storedPath,
            storageKey,
            mimeType: meta.mimeType,
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
            storageKey,
            mimeType: meta.mimeType,
            size,
            technicalDocType: technicalDocType ?? undefined,
            version: (existing.version || 1) + 1,
            uploadedAt: new Date(),
          },
        });
      } else {
        row = await prisma.projectFile.create({
          data: {
            projectId,
            originalName: file.name,
            storedPath,
            storageKey,
            mimeType: meta.mimeType,
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
            ...(proj?.estatus === ProjectStatus.INCOMPLETO
              ? { estatus: ProjectStatus.INICIO_PENDIENTE }
              : {}),
          },
        });
      }

      await prisma.fileUploadEvent.create({
        data: {
          projectId,
          projectFileId: row.id,
          uploaderId: userId,
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

      // ── Tarea REVISAR + 2 Notificaciones ─────────────────────────────────
      // IMPORTANTE: await explícito para que Vercel no cancele la operación
      // al retornar la respuesta. El helper tiene su propio try/catch.
      if (assignedUserId) {
        await crearTareaYNotificaciones({
          projectId,
          projectNombre: project.nombre,
          fileId: row.id,
          fileName: row.originalName,
          assignedUserId,
          uploaderUserId: userId,
          uploaderNombre: auth?.nombre ?? null,
        });
      }

      created.push(row);
    }
  } catch (e) {
    console.error("[POST /api/projects/[id]/files]", e);
    return NextResponse.json(created, { status: 200 });
  }

  return NextResponse.json(created, { status: 200 });
}
