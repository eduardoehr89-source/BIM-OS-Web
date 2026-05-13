import { NextResponse } from "next/server";
import { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { userCanAccessStoredFile } from "@/lib/file-access";
import { isValidNipFormat } from "@/lib/nip-validation";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { nip: true, tipo: true },
  });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const isAdmin = user.tipo === "ADMIN";

  // ADMIN: no requiere NIP para mover archivos a la papelera
  // USER: sigue requiriendo NIP
  if (!isAdmin) {
    let nip = "";
    try {
      const body = (await req.json()) as { nip?: unknown };
      nip = typeof body.nip === "string" ? body.nip.trim() : "";
    } catch {
      return NextResponse.json({ error: "Se requiere un cuerpo JSON con el campo «nip»" }, { status: 400 });
    }

    if (!isValidNipFormat(nip)) {
      return NextResponse.json({ error: "El NIP debe ser exactamente 4 dígitos" }, { status: 400 });
    }
    if (!user.nip || !isValidNipFormat(user.nip)) {
      return NextResponse.json(
        { error: "Debe configurar su NIP de 4 dígitos en Configuración antes de mover archivos a la papelera." },
        { status: 400 },
      );
    }
    if (user.nip !== nip) {
      return NextResponse.json({ error: "NIP incorrecto" }, { status: 403 });
    }
  }

  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({
    where: { id },
    select: { id: true, projectId: true, isDeleted: true },
  });
  if (!file) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (file.isDeleted) return new NextResponse(null, { status: 204 });

  const allowed = await userCanAccessStoredFile(userId, isAdmin, file);
  if (!allowed) return NextResponse.json({ error: "Sin acceso" }, { status: 403 });

  await prisma.$transaction([
    prisma.project.updateMany({
      where: { bepFileId: id },
      data: { bepFileId: null, estatus: ProjectStatus.INCOMPLETO },
    }),
    prisma.client.updateMany({ where: { oirFileId: id }, data: { oirFileId: null } }),
    prisma.client.updateMany({ where: { airFileId: id }, data: { airFileId: null } }),
    prisma.client.updateMany({ where: { eirFileId: id }, data: { eirFileId: null } }),
    prisma.projectFile.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), deletedByUserId: userId },
    }),
  ]);

  return new NextResponse(null, { status: 204 });
}
