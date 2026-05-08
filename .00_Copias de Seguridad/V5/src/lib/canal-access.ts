import type { AuthPayload } from "@/lib/auth";
import type { CanalTipo, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { isAdminUser } from "@/lib/comunicaciones-auth";

/** Proyectos donde el usuario es owner o está en sharedWith. */
export async function getUserProjectIdsSet(userId: string): Promise<Set<string>> {
  const [owned, sharedRows] = await Promise.all([
    prisma.project.findMany({ where: { ownerId: userId }, select: { id: true } }),
    prisma.project.findMany({
      where: { sharedWith: { some: { id: userId } } },
      select: { id: true },
    }),
  ]);
  const s = new Set<string>();
  for (const r of owned) s.add(r.id);
  for (const r of sharedRows) s.add(r.id);
  return s;
}

export async function sharesProjectsBetween(aId: string, bId: string): Promise<boolean> {
  const [sa, sb] = await Promise.all([getUserProjectIdsSet(aId), getUserProjectIdsSet(bId)]);
  for (const id of sa) {
    if (sb.has(id)) return true;
  }
  return false;
}

/** Solo Admin Supremo inicia DM con cualquiera; el resto solo con quien comparte proyecto. */
export async function canOpenDirectMessage(p: AuthPayload, peerUserId: string): Promise<boolean> {
  if (!peerUserId || peerUserId === p.id) return false;
  const peer = await prisma.user.findUnique({ where: { id: peerUserId }, select: { id: true } });
  if (!peer) return false;
  if (p.isSupremo) return true;
  return sharesProjectsBetween(p.id, peerUserId);
}

export async function findDirectCanalBetween(userA: string, userB: string) {
  const candidates = await prisma.canal.findMany({
    where: {
      tipo: "DIRECT",
      AND: [{ miembros: { some: { usuarioId: userA } } }, { miembros: { some: { usuarioId: userB } } }],
    },
    include: { miembros: true },
  });
  return (
    candidates.find(
      (c) =>
        c.miembros.length === 2 &&
        c.miembros.some((m) => m.usuarioId === userA) &&
        c.miembros.some((m) => m.usuarioId === userB),
    ) ?? null
  );
}

export async function createDirectCanal(userA: string, userB: string): Promise<string> {
  const canal = await prisma.$transaction(async (tx) => {
    const c = await tx.canal.create({
      data: {
        tipo: "DIRECT",
        isDirect: true,
        nombre: "Chat privado",
        proyectoId: null,
        permiteTexto: true,
        permiteVoz: false,
        permiteArchivos: false,
        permiteVideo: false,
      },
    });
    await tx.canalUsuario.createMany({
      data: [
        { canalId: c.id, usuarioId: userA },
        { canalId: c.id, usuarioId: userB },
      ],
    });
    return c;
  });
  return canal.id;
}

/** Busca DM existente o lo crea en una sola transacción (evita carreras y 500 por duplicados). */
export async function openOrCreateDirectCanal(userA: string, userB: string): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const candidates = await tx.canal.findMany({
      where: {
        tipo: "DIRECT",
        AND: [{ miembros: { some: { usuarioId: userA } } }, { miembros: { some: { usuarioId: userB } } }],
      },
      include: { miembros: true },
    });
    const existing =
      candidates.find(
        (c) =>
          c.miembros.length === 2 &&
          c.miembros.some((m) => m.usuarioId === userA) &&
          c.miembros.some((m) => m.usuarioId === userB),
      ) ?? null;
    if (existing) return existing.id;

    const c = await tx.canal.create({
      data: {
        tipo: "DIRECT",
        isDirect: true,
        nombre: "Chat privado",
        proyectoId: null,
        permiteTexto: true,
        permiteVoz: false,
        permiteArchivos: false,
        permiteVideo: false,
      },
    });
    await tx.canalUsuario.createMany({
      data: [
        { canalId: c.id, usuarioId: userA },
        { canalId: c.id, usuarioId: userB },
      ],
    });
    return c.id;
  });
}

export function canalAccessWhere(p: AuthPayload, canalId: string, tipo: CanalTipo): Prisma.CanalWhereInput {
  const base: Prisma.CanalWhereInput = { id: canalId };
  if (tipo === "DIRECT") {
    return { ...base, miembros: { some: { usuarioId: p.id } } };
  }
  if (isAdminUser(p)) return base;
  return { ...base, miembros: { some: { usuarioId: p.id } } };
}

export async function getCanalIfAccessible<I extends Prisma.CanalInclude>(
  p: AuthPayload,
  canalId: string,
  include: I,
): Promise<Prisma.CanalGetPayload<{ include: I }> | null> {
  const meta = await prisma.canal.findUnique({ where: { id: canalId }, select: { tipo: true } });
  if (!meta) return null;
  return prisma.canal.findFirst({
    where: canalAccessWhere(p, canalId, meta.tipo),
    include,
  });
}
