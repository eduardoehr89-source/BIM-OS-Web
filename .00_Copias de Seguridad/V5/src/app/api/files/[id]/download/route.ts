import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { userCanAccessStoredFile } from "@/lib/file-access";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({
    where: { id },
    select: { id: true, projectId: true, originalName: true, mimeType: true, storedPath: true, isDeleted: true },
  });
  if (!file || file.isDeleted) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const member = await prisma.user.findUnique({ where: { id: userId }, select: { tipo: true } });
  const isAdmin = member?.tipo === "ADMIN";
  const allowed = await userCanAccessStoredFile(userId, isAdmin, file);
  if (!allowed) return NextResponse.json({ error: "Sin acceso" }, { status: 403 });

  const absolute = path.resolve(process.cwd(), file.storedPath);
  const root = path.resolve(process.cwd(), "storage", "uploads");
  if (!absolute.startsWith(root)) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }

  let buf: Buffer;
  try {
    buf = await readFile(absolute);
  } catch {
    return NextResponse.json({ error: "Archivo no disponible en disco" }, { status: 404 });
  }

  const encoded = encodeURIComponent(file.originalName);

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encoded}`,
    },
  });
}
