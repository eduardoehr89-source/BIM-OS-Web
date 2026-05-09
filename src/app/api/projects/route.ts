import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma";
import { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { requireAdminSession } from "@/lib/project-rbac";
import { PROJECT_API_LIST_INCLUDE } from "@/lib/project-api-include";
import {
  parseDisciplinesFromBody,
  parseOptionalIsoDate,
  parseProjectCodeField,
} from "@/lib/project-disciplines";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bimos_session")?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = await getCurrentUserId();
    
    const isAdmin = payload?.tipo === "ADMIN";

    const projects = await prisma.project.findMany({
      ...(!isAdmin && userId
        ? { 
            where: { 
              OR: [
                { ownerId: userId }, 
                { sharedWith: { some: { id: userId } } },
                { tasks: { some: { assignments: { some: { userId: userId, isAccepted: true } } } } }
              ] 
            } 
          }
        : {}),
      orderBy: [{ ano: "desc" }, { nombre: "asc" }],
      include: PROJECT_API_LIST_INCLUDE,
    });
    return NextResponse.json(projects);
  } catch (e) {
    console.error("[DIAGNOSTICO 500 GET /api/projects]", e);
    // Retornamos el mensaje real del error para depurar rápido (cuidado, expone info de la base de datos temporalmente)
    const errMessage = e instanceof Error ? e.message : String(e);
    const errStack = e instanceof Error ? e.stack : undefined;
    return NextResponse.json({ error: "No se pudieron cargar los proyectos", detalles: errMessage, stack: errStack }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;
  const userId = gate.userId;

  try {
    const body = await req.json();
    const nombre = String(body.nombre ?? "").trim();
    const ubicacion = String(body.ubicacion ?? "").trim();
    const clienteId = String(body.clientId ?? body.clienteId ?? "").trim();
    const anoRaw = Number(body.ano);
    const tipologia = String(body.tipologia ?? "").trim();
    const disciplinesInvolved = parseDisciplinesFromBody(body.disciplines) ?? "";
    const projectCode = parseProjectCodeField(body.projectCode) ?? null;

    const milestoneSd = parseOptionalIsoDate(body.milestoneSd);
    const milestoneDd = parseOptionalIsoDate(body.milestoneDd);
    const milestoneCd = parseOptionalIsoDate(body.milestoneCd);
    const milestoneLicitacion = parseOptionalIsoDate(body.milestoneLicitacion);
    const milestoneAsBuilt = parseOptionalIsoDate(body.milestoneAsBuilt);

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

    const milestoneData: Record<string, Date | null | undefined> = {};
    if (milestoneSd !== undefined) milestoneData.milestoneSd = milestoneSd;
    if (milestoneDd !== undefined) milestoneData.milestoneDd = milestoneDd;
    if (milestoneCd !== undefined) milestoneData.milestoneCd = milestoneCd;
    if (milestoneLicitacion !== undefined) milestoneData.milestoneLicitacion = milestoneLicitacion;
    if (milestoneAsBuilt !== undefined) milestoneData.milestoneAsBuilt = milestoneAsBuilt;

    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    const created = await prisma.project.create({
      data: {
        nombre,
        ubicacion,
        ano,
        tipologia,
        estatus: ProjectStatus.INCOMPLETO,
        clientId: clienteId,
        ownerId: userExists ? userId : null,
        disciplinesInvolved,
        projectCode: projectCode ?? undefined,
        ...milestoneData,
      },
      include: PROJECT_API_LIST_INCLUDE,
    });
    
    revalidatePath("/proyectos");
    revalidatePath("/dashboard");
    
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "El código de proyecto ya existe" }, { status: 400 });
    }
    console.error("[POST /api/projects]", e);
    return NextResponse.json({ error: "No se pudo crear el proyecto" }, { status: 400 });
  }
}
