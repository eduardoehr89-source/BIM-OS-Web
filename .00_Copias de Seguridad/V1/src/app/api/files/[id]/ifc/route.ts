import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * Sirve el IFC como stream binario para el visor (sin forzar descarga).
 * Soporta archivos en disco local o en Vercel Blob (`storageKey`).
 */
export async function GET(_req: Request, ctx: Params) {
  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({ where: { id } });
  if (!file || file.isDeleted) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
  if (!file.projectId) {
    return NextResponse.json({ error: "IFC solo disponible para archivos de proyecto" }, { status: 400 });
  }

  const lower = file.originalName.toLowerCase();
  if (!lower.endsWith(".ifc")) {
    return NextResponse.json({ error: "Solo archivos .ifc" }, { status: 415 });
  }

  const encoded = encodeURIComponent(file.originalName);

  if (file.storageKey) {
    const result = await get(file.storageKey, { access: "public" });
    if (!result?.stream) {
      return NextResponse.json({ error: "Archivo no disponible en almacenamiento" }, { status: 404 });
    }
    return new NextResponse(result.stream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `inline; filename*=UTF-8''${encoded}`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  const absolute = path.resolve(process.cwd(), file.storedPath);
  const root = path.resolve(process.cwd(), "storage", "uploads");
  if (!absolute.startsWith(root)) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }

  try {
    await stat(absolute);
  } catch {
    return NextResponse.json({ error: "Archivo no disponible en disco" }, { status: 404 });
  }

  const nodeStream = createReadStream(absolute);
  const webStream = Readable.toWeb(nodeStream);

  return new NextResponse(webStream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `inline; filename*=UTF-8''${encoded}`,
      "Cache-Control": "private, no-store",
    },
  });
}
