import { NextResponse } from "next/server";
import { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PROJECT_STATUS, parseProjectStatus } from "@/lib/project-status";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getCurrentUserId();
  const projects = await prisma.project.findMany({
    where: userId ? { OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }] } : undefined,
    orderBy: [{ ano: "desc" }, { nombre: "asc" }],
    include: {
      client: true,
      files: true,
      tasks: { orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }] },
    },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  try {
    const body = await req.json();
    const nombre = String(body.nombre ?? "").trim();
    const ubicacion = String(body.ubicacion ?? "").trim();
    const clienteId = String(body.clientId ?? body.clienteId ?? "").trim();
    const anoRaw = Number(body.ano);
    const tipologia = String(body.tipologia ?? "").trim();
    const parsed = parseProjectStatus(body.estatus) ?? DEFAULT_PROJECT_STATUS;
    const estatus = ProjectStatus[parsed];

    if (!nombre || !ubicacion || !clienteId) {
      return NextResponse.json({ error: "Nombre, ubicación y cliente son obligatorios" }, { status: 400 });
    }
    if (!tipologia) {
      return NextResponse.json({ error: "La tipología es obligatoria" }, { status: 400 });
    }
    if (!Number.isFinite(anoRaw)) {
      return NextResponse.json({ error: "El año no es válido" }, { status: 400 });
    }
    const ano = Math.floor(anoRaw);
    if (ano < 1900 || ano > 2100) {
      return NextResponse.json({ error: "El año debe estar entre 1900 y 2100" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { id: clienteId } });
    if (!client) {
      return NextResponse.json({ error: "Cliente no existe" }, { status: 400 });
    }

    const created = await prisma.project.create({
      data: {
        nombre,
        ubicacion,
        ano,
        tipologia,
        estatus,
        clientId: clienteId,
        ownerId: userId,
      },
      include: { client: true, files: true, tasks: { orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }] } },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/projects]", e);
    return NextResponse.json({ error: "No se pudo crear el proyecto" }, { status: 400 });
  }
}
