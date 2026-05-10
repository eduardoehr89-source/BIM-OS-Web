import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function isAllowedStoredPath(cwd: string, storedPath: string): boolean {
  const normalized = storedPath.replace(/\\/g, "/");
  const absolute = path.resolve(cwd, storedPath);
  const uploadsRoot = path.resolve(cwd, "storage", "uploads");
  if (absolute.startsWith(uploadsRoot)) return true;
  if (normalized.startsWith("vercel-metadata-only/")) return true;
  return false;
}

/**
 * Descarga de adjuntos: basta con sesión válida (cualquier usuario autenticado).
 * La ruta en disco debe estar bajo `storage/uploads` o ser placeholder serverless.
 */
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

  const cwd = process.cwd();
  if (!isAllowedStoredPath(cwd, file.storedPath)) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }

  const absolute = path.resolve(cwd, file.storedPath);

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
