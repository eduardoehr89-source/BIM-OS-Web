import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { resolveRouteIdParam } from "@/lib/route-params";
import { saveClientUpload } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

const ROLES = ["oir", "air", "eir"] as const;
type IsoRole = (typeof ROLES)[number];

export async function POST(req: Request, ctx: Params) {
  const clientId = await resolveRouteIdParam(ctx.params);
  if (!clientId) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const adminPin = String(formData.get("adminPin") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "").toLowerCase();
  const file = formData.get("file");

  if (!adminPin) return NextResponse.json({ error: "PIN de administrador requerido" }, { status: 400 });
  if (!ROLES.includes(roleRaw as IsoRole)) {
    return NextResponse.json({ error: "role debe ser oir, air o eir" }, { status: 400 });
  }
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.tipo !== "ADMIN" || user.pin !== adminPin) {
    return NextResponse.json({ error: "PIN incorrecto o permisos insuficientes" }, { status: 403 });
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

  const role = roleRaw as IsoRole;
  const fk =
    role === "oir" ? ("oirFileId" as const) : role === "air" ? ("airFileId" as const) : ("eirFileId" as const);
  const previousId =
    role === "oir" ? client.oirFileId : role === "air" ? client.airFileId : client.eirFileId;

  const { storedPath, size, mimeType } = await saveClientUpload(clientId, file.name, file);

  const row = await prisma.projectFile.create({
    data: {
      projectId: null,
      originalName: file.name,
      storedPath,
      mimeType,
      size,
    },
  });

  await prisma.client.update({
    where: { id: clientId },
    data: { [fk]: row.id },
  });

  if (previousId) {
    const prev = await prisma.projectFile.findUnique({ where: { id: previousId } });
    if (prev) {
      const abs = path.resolve(process.cwd(), prev.storedPath);
      const root = path.resolve(process.cwd(), "storage", "uploads");
      if (abs.startsWith(root)) {
        try {
          await unlink(abs);
        } catch {
          /* noop */
        }
      }
      try {
        await prisma.projectFile.delete({ where: { id: previousId } });
      } catch {
        /* noop */
      }
    }
  }

  return NextResponse.json({ id: row.id, originalName: row.originalName, role });
}
