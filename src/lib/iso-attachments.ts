import { prisma } from "@/lib/prisma";
import { ISO_ATTACHMENT_CONTAINERS } from "./iso-attachments-constants";

export {
  ISO_ATTACHMENT_CONTAINERS,
  ISO_ATTACHMENT_LABELS,
  parseIsoAttachmentContainer,
  type IsoAttachmentContainer,
} from "./iso-attachments-constants";

/**
 * Crea las 4 carpetas lógicas del proyecto y asigna adjuntos huérfanos a WIP.
 */
export async function ensureIsoAttachmentStructure(projectId: string): Promise<void> {
  for (const container of ISO_ATTACHMENT_CONTAINERS) {
    await prisma.attachmentFolder.upsert({
      where: { projectId_container: { projectId, container } },
      create: { projectId, container },
      update: {},
    });
  }

  const orphanFiles = await prisma.projectFile.findMany({
    where: {
      projectId,
      isDeleted: false,
      technicalDocType: null,
      attachment: { is: null },
    },
    select: { id: true },
  });

  for (const f of orphanFiles) {
    await prisma.attachment.create({
      data: {
        projectId,
        fileId: f.id,
        container: "WIP",
      },
    });
  }
}

/**
 * Migración única: archivos generales de proyecto sin fila `Attachment` (equivalente a “sin contenedor”
 * en la UI) pasan a WIP (01_WIP). Crea carpetas ISO del proyecto si faltan.
 */
export async function migrateAllOrphanProjectFilesToWipAttachments(): Promise<{
  projectCount: number;
  fileCount: number;
}> {
  const orphans = await prisma.projectFile.findMany({
    where: {
      projectId: { not: null },
      isDeleted: false,
      technicalDocType: null,
      attachment: { is: null },
    },
    select: { projectId: true },
  });

  const projectIds = [...new Set(orphans.map((o) => o.projectId).filter((id): id is string => id != null))];

  for (const projectId of projectIds) {
    await ensureIsoAttachmentStructure(projectId);
  }

  const fileCount = orphans.length;
  return { projectCount: projectIds.length, fileCount };
}
