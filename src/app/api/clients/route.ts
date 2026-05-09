import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { requireAdminSession } from "@/lib/project-rbac";
import { saveClientUpload } from "@/lib/storage";

const CLIENT_LIST_INCLUDE = {
  _count: { select: { projects: true } },
  oirFile: { select: { id: true, originalName: true } },
  airFile: { select: { id: true, originalName: true } },
  eirFile: { select: { id: true, originalName: true } },
} satisfies Prisma.ClientInclude;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;

  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const activo = searchParams.get("activo");
  const baseWhere = activo === "true" ? { activo: true } : activo === "false" ? { activo: false } : {};

  if (payload?.tipo === "ADMIN") {
    try {
      const clients = await prisma.client.findMany({
        where: baseWhere,
        orderBy: { nombre: "asc" },
        include: CLIENT_LIST_INCLUDE,
      });
      return NextResponse.json(clients);
    } catch (e) {
      console.error("[GET /api/clients] admin", e);
      return NextResponse.json({ error: "No se pudieron cargar los clientes" }, { status: 500 });
    }
  }

  const where = {
    ...baseWhere,
    ...(userId ? { OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }] } : {}),
  };

  try {
    const clients = await prisma.client.findMany({
      where,
      orderBy: { nombre: "asc" },
      include: CLIENT_LIST_INCLUDE,
    });
    return NextResponse.json(clients);
  } catch (e) {
    console.error("[GET /api/clients]", e);
    return NextResponse.json({ error: "No se pudieron cargar los clientes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      {
        error: "Envía multipart/form-data con campos: nombre (archivos OIR, AIR, EIR son opcionales).",
      },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const oir = formData.get("oir");
  const air = formData.get("air");
  const eir = formData.get("eir");

  if (!nombre) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const adminId = gate.userId;

  try {
    const client = await prisma.client.create({
      data: { nombre, activo: true, ownerId: adminId },
    });

    async function createIsoDoc(f: File) {
      const { storedPath, size, mimeType } = await saveClientUpload(client.id, f.name, f);
      return prisma.projectFile.create({
        data: {
          projectId: null,
          originalName: f.name,
          storedPath,
          mimeType,
          size,
        },
      });
    }

    let oirRow, airRow, eirRow;

    if (oir instanceof File && oir.size) {
      oirRow = await createIsoDoc(oir);
    }
    if (air instanceof File && air.size) {
      airRow = await createIsoDoc(air);
    }
    if (eir instanceof File && eir.size) {
      eirRow = await createIsoDoc(eir);
    }

    if (oirRow || airRow || eirRow) {
      await prisma.client.update({
        where: { id: client.id },
        data: {
          ...(oirRow ? { oirFileId: oirRow.id } : {}),
          ...(airRow ? { airFileId: airRow.id } : {}),
          ...(eirRow ? { eirFileId: eirRow.id } : {}),
        },
      });
    }

    const full = await prisma.client.findUnique({
      where: { id: client.id },
      include: {
        _count: { select: { projects: true } },
        oirFile: { select: { id: true, originalName: true } },
        airFile: { select: { id: true, originalName: true } },
        eirFile: { select: { id: true, originalName: true } },
      },
    });

    return NextResponse.json(full, { status: 201 });
  } catch (e) {
    console.error("[POST /api/clients]", e);
    return NextResponse.json({ error: "No se pudo crear el cliente" }, { status: 400 });
  }
}
