import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { canOpenDirectMessage, sharesProjectsBetween } from "@/lib/canal-access";

/** Usuarios con los que la sesión actual puede chatear + bandera de proyecto común. */
export async function GET() {
  try {
    const p = await getAuthPayload();
    if (!p) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const all = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        tipo: true,
        rol: true,
        client: { select: { nombre: true } },
      },
      orderBy: { nombre: "asc" },
    });

    const out: Array<{
      id: string;
      nombre: string;
      tipo: string;
      rol: string;
      client: { nombre: string } | null;
      sharesProjectWithViewer: boolean;
    }> = [];

    for (const u of all) {
      if (!u?.id || u.id === p.id) continue;
      try {
        if (!(await canOpenDirectMessage(p, u.id))) continue;
        const sharesProjectWithViewer = await sharesProjectsBetween(p.id, u.id);
        out.push({
          id: u.id,
          nombre: u.nombre ?? "—",
          tipo: u.tipo ?? "USER",
          rol: u.rol ?? "",
          client: u.client,
          sharesProjectWithViewer,
        });
      } catch {
        /* Fila ignorada: permisos o datos inconsistentes */
      }
    }

    return NextResponse.json(out);
  } catch (e) {
    console.error("[GET /api/comunicaciones/directory]", e);
    return NextResponse.json([], { headers: { "x-bimos-list": "error" } });
  }
}
