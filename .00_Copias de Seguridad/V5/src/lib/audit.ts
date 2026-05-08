import { prisma } from "@/lib/prisma";
import type { AuditAction, ResourceType } from "@/generated/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function logAudit(accion: AuditAction, recurso: ResourceType, detalles?: string) {
  try {
    const usuarioId = await getCurrentUserId();
    if (!usuarioId) return; // Si es una tarea cron u otro contexto sin usuario

    await prisma.auditLog.create({
      data: {
        usuarioId,
        accion,
        recurso,
        detalles,
      },
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
}
