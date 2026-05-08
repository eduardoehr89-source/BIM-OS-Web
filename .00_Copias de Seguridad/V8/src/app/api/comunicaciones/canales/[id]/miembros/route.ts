import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload, isAdminUser } from "@/lib/comunicaciones-auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Params) {
  const p = await getAuthPayload();
  if (!p || !isAdminUser(p)) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const { id: canalId } = await ctx.params;

  const canalExists = await prisma.canal.findUnique({ where: { id: canalId }, select: { id: true, tipo: true } });
  if (!canalExists) {
    return NextResponse.json({ error: "Canal no encontrado" }, { status: 404 });
  }
  if (canalExists.tipo === "DIRECT") {
    return NextResponse.json({ error: "Los chats privados no permiten editar miembros" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const add: string[] = Array.isArray(body.add) ? body.add.map((x: unknown) => String(x)) : [];
    const remove: string[] = Array.isArray(body.remove) ? body.remove.map((x: unknown) => String(x)) : [];

    await prisma.$transaction(async (tx) => {
      if (add.length) {
        for (const usuarioId of [...new Set(add)]) {
          await tx.canalUsuario.upsert({
            where: { canalId_usuarioId: { canalId, usuarioId } },
            create: { canalId, usuarioId },
            update: {},
          });
        }
      }
      if (remove.length) {
        await tx.canalUsuario.deleteMany({
          where: { canalId, usuarioId: { in: [...new Set(remove)] } },
        });
      }
    });

    const miembros = await prisma.canalUsuario.findMany({
      where: { canalId },
      include: { usuario: { select: { id: true, nombre: true } } },
    });
    return NextResponse.json({ miembros });
  } catch (e) {
    console.error("[PATCH miembros]", e);
    return NextResponse.json({ error: "No se pudo actualizar miembros" }, { status: 500 });
  }
}
