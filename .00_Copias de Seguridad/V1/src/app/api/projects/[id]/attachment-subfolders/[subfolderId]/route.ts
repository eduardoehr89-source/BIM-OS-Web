import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import {
  canUserAccessProjectFiles,
  canUserManageAttachmentSubfolders,
} from "@/lib/project-file-upload-access";

type Params = { params: Promise<{ id: string; subfolderId: string }> };

export async function DELETE(_req: Request, ctx: Params) {
  const { id: projectId, subfolderId } = await ctx.params;
  const auth = await getAuthPayload();
  const userId = auth?.id;
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [hasAccess, canFolders] = await Promise.all([
    canUserAccessProjectFiles(projectId, userId, auth),
    canUserManageAttachmentSubfolders(userId),
  ]);
  if (!hasAccess) {
    return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
  }
  if (!canFolders) {
    return NextResponse.json({ error: "No tienes permiso para gestionar carpetas" }, { status: 403 });
  }

  const sub = await prisma.attachmentSubfolder.findFirst({
    where: { id: subfolderId, projectId },
    select: { id: true },
  });
  if (!sub) {
    return NextResponse.json({ error: "Carpeta no encontrada" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.attachment.updateMany({
      where: { subfolderId: sub.id },
      data: { subfolderId: null },
    }),
    prisma.attachmentSubfolder.delete({ where: { id: sub.id } }),
  ]);

  return NextResponse.json({ success: true });
}
