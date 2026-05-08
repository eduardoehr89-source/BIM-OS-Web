import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({ where: { id } });
  if (!file) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

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
