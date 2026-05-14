import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { projectFileTrashWhere } from "@/lib/project-file-filters";



export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: { pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tipo: true, password: true } });
  const isAdmin = user?.tipo === "ADMIN";
  if (!isAdmin) {
    return NextResponse.json({ error: "Solo los administradores pueden vaciar la papelera" }, { status: 403 });
  }

  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  if (!user || user.password !== pin) {
    return NextResponse.json({ error: "Acceso Denegado" }, { status: 403 });
  }

  const where = projectFileTrashWhere(userId, isAdmin);
  const files = await prisma.projectFile.findMany({ where, select: { id: true, storedPath: true } });

  for (const f of files) {
    const absolute = path.resolve(process.cwd(), f.storedPath);
    const root = path.resolve(process.cwd(), "storage", "uploads");
    if (absolute.startsWith(root)) {
      try {
        await unlink(absolute);
      } catch {
        /* ya ausente */
      }
    }
    await prisma.projectFile.delete({ where: { id: f.id } });
  }

  return NextResponse.json({ purged: files.length });
}
