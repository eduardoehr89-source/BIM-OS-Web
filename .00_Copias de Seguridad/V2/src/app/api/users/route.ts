import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCurrentUserId } from "@/lib/auth";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.rol === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        rol: true,
        createdAt: true,
        // excluye el PIN explícitamente
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: "Error fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { nombre, pin, rol, adminPin } = await request.json();
    if (!nombre || !pin || !rol || !adminPin) {
      return NextResponse.json({ error: "Todos los campos (incluyendo el PIN del administrador) son requeridos" }, { status: 400 });
    }

    const adminId = await getCurrentUserId();
    if (!adminId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: adminId } });
    if (!adminUser || adminUser.pin !== adminPin) {
      return NextResponse.json({ error: "PIN de administrador incorrecto" }, { status: 403 });
    }

    const user = await prisma.user.create({
      data: {
        nombre: nombre.trim(),
        pin: pin.trim(),
        rol: rol === "ADMIN" ? "ADMIN" : "USER",
      },
      select: { id: true, nombre: true, rol: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (userToDelete.rol === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { rol: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "No puedes eliminar al último administrador del sistema." }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Error eliminando usuario" }, { status: 500 });
  }
}
