import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCurrentUserId } from "@/lib/auth";
import { cookies } from "next/headers";
import { normalizeRolProfesional } from "@/lib/professional-roles";
import { sharesProjectsBetween } from "@/lib/canal-access";

type UserTipoStr = "ADMIN" | "USER";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.tipo === "ADMIN";
}

function parseTipo(v: unknown): UserTipoStr | null {
  if (v === "ADMIN" || v === "USER") return v;
  return null;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const viewerId = await getCurrentUserId();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        tipo: true,
        rol: true,
        permisos: true,
        canManageFolders: true,
        client: { select: { nombre: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!viewerId) {
      return NextResponse.json(users);
    }

    const enriched = await Promise.all(
      users.map(async (u) => ({
        ...u,
        sharesProjectWithViewer: await sharesProjectsBetween(viewerId, u.id),
      })),
    );

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: "Error fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nombre, pin, tipo, rol, adminPin, companyId, newCompanyName, permisos, canManageFolders } = body;
    if (!nombre || !pin || !tipo || !rol || !adminPin) {
      return NextResponse.json(
        { error: "Todos los campos (nombre, PIN, tipo, rol y PIN del administrador) son requeridos" },
        { status: 400 },
      );
    }
    if (!companyId && !newCompanyName) {
      return NextResponse.json({ error: "Debe seleccionar una empresa o crear una nueva" }, { status: 400 });
    }

    const t = parseTipo(tipo);
    if (!t) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    const rolNorm = normalizeRolProfesional(String(rol));
    if (rolNorm === null) return NextResponse.json({ error: "Rol profesional inválido" }, { status: 400 });

    const adminId = await getCurrentUserId();
    if (!adminId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: adminId } });
    const envAdminPin = String(process.env.ADMIN_PIN ?? "1234").trim();
    const providedPin = String(adminPin).trim();

    console.log("[DEBUG/users/POST] PIN recibido:", providedPin, "PIN en .env:", envAdminPin, "adminUser:", !!adminUser);

    const isPinValid = (adminUser && adminUser.pin === providedPin) || providedPin === envAdminPin;

    if (!isPinValid) {
      return NextResponse.json({ error: "PIN de administrador incorrecto" }, { status: 403 });
    }

    let finalClientId = companyId;
    if (newCompanyName && newCompanyName.trim() !== "") {
      const existingCo = await prisma.client.findUnique({ where: { nombre: newCompanyName.trim() } });
      if (existingCo) {
        finalClientId = existingCo.id;
      } else {
        const newCo = await prisma.client.create({ data: { nombre: newCompanyName.trim() } });
        finalClientId = newCo.id;
      }
    }

    const user = await prisma.user.create({
      data: {
        nombre: String(nombre).trim(),
        pin: String(pin).trim(),
        tipo: t,
        rol: rolNorm,
        permisos: permisos || "dashboard",
        clientId: finalClientId,
        canManageFolders: t === "ADMIN" ? true : Boolean(canManageFolders),
      },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        rol: true,
        permisos: true,
        canManageFolders: true,
        client: { select: { nombre: true } },
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nombre, tipo, rol, pin, adminPin, companyId, newCompanyName, permisos, canManageFolders } = body;

    if (!id || !nombre || !tipo || !rol || !adminPin) {
      return NextResponse.json(
        { error: "id, nombre, tipo, rol y PIN de administrador son requeridos" },
        { status: 400 },
      );
    }
    if (!companyId && !newCompanyName) {
      return NextResponse.json({ error: "Debe seleccionar una empresa o crear una nueva" }, { status: 400 });
    }

    const t = parseTipo(tipo);
    if (!t) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    const rolNorm = normalizeRolProfesional(String(rol));
    if (rolNorm === null) return NextResponse.json({ error: "Rol profesional inválido" }, { status: 400 });

    const adminId = await getCurrentUserId();
    if (!adminId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: adminId } });
    const envAdminPin = String(process.env.ADMIN_PIN ?? "1234").trim();
    const providedPin = String(adminPin).trim();

    console.log("[DEBUG/users/PATCH] PIN recibido:", providedPin, "PIN en .env:", envAdminPin, "adminUser:", !!adminUser);

    const isPinValid = (adminUser && adminUser.pin === providedPin) || providedPin === envAdminPin;

    if (!isPinValid) {
      return NextResponse.json({ error: "PIN de administrador incorrecto" }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { id: String(id) } });
    if (!existing) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    if (existing.tipo === "ADMIN" && t === "USER") {
      const adminCount = await prisma.user.count({ where: { tipo: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "No puedes degradar al único administrador del sistema." }, { status: 400 });
      }
    }

    let finalClientId = companyId;
    if (newCompanyName && newCompanyName.trim() !== "") {
      const existingCo = await prisma.client.findUnique({ where: { nombre: newCompanyName.trim() } });
      if (existingCo) {
        finalClientId = existingCo.id;
      } else {
        const newCo = await prisma.client.create({ data: { nombre: newCompanyName.trim() } });
        finalClientId = newCo.id;
      }
    }

    const pinTrim = pin != null && String(pin).trim() !== "" ? String(pin).trim() : null;

    const data: any = {
      nombre: String(nombre).trim(),
      tipo: t,
      rol: rolNorm,
      clientId: finalClientId,
    };
    if (permisos !== undefined) {
      data.permisos = permisos;
    }
    if (canManageFolders !== undefined) {
      data.canManageFolders = t === "ADMIN" ? true : Boolean(canManageFolders);
    }
    
    let pinChanged = false;
    if (pinTrim) {
      data.pin = pinTrim;
      if (pinTrim !== existing.pin) {
        pinChanged = true;
      }
    }

    const user = await prisma.user.update({
      where: { id: String(id) },
      data,
      select: {
        id: true,
        nombre: true,
        tipo: true,
        rol: true,
        permisos: true,
        canManageFolders: true,
        client: { select: { nombre: true } },
        createdAt: true,
      },
    });

    const response = NextResponse.json(user);

    // Si el usuario modificado es el mismo que está logueado, y cambió su propio PIN o permisos de forma destructiva,
    // podríamos limpiar la cookie. Pero para asegurarnos de que la seguridad se aplica al instante y
    // obligarlo a re-ingresar con el nuevo PIN:
    if (pinChanged && existing.id === adminId) {
       response.cookies.delete("bimos_session");
    }

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error actualizando usuario" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const adminPin = searchParams.get("adminPin");
    if (!id || !adminPin) return NextResponse.json({ error: "ID y PIN requeridos" }, { status: 400 });

    const adminId = await getCurrentUserId();
    if (!adminId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: adminId } });
    const envAdminPin = String(process.env.ADMIN_PIN ?? "1234").trim();
    const providedPin = String(adminPin).trim();

    console.log("[DEBUG/users/DELETE] PIN recibido:", providedPin, "PIN en .env:", envAdminPin, "adminUser:", !!adminUser);

    const isPinValid = (adminUser && adminUser.pin === providedPin) || providedPin === envAdminPin;

    if (!isPinValid) {
      return NextResponse.json({ error: "PIN incorrecto" }, { status: 403 });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (userToDelete.tipo === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { tipo: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "No puedes eliminar al último administrador del sistema." }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error eliminando usuario" }, { status: 500 });
  }
}
