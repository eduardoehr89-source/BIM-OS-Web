import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Params) {
  const { id } = await ctx.params;
  const file = await prisma.projectFile.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const absolute = path.resolve(process.cwd(), file.storedPath);
  const root = path.resolve(process.cwd(), "storage", "uploads");
  if (!absolute.startsWith(root)) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }

  await prisma.projectFile.delete({ where: { id } });
  try {
    await unlink(absolute);
  } catch {
    /* archivo ya ausente */
  }

  return new NextResponse(null, { status: 204 });
}
