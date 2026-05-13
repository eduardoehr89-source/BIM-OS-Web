/** Valores del enum ISO en BD; definido aquí para no importar Prisma en componentes cliente. */
export type IsoAttachmentContainer = "WIP" | "SHARED" | "PUBLISHED" | "ARCHIVED";

export const ISO_ATTACHMENT_CONTAINERS: readonly IsoAttachmentContainer[] = [
  "WIP",
  "SHARED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export function parseIsoAttachmentContainer(raw: string): IsoAttachmentContainer | null {
  const u = raw.trim().toUpperCase();
  if (u === "WIP" || u === "01_WIP") return "WIP";
  if (u === "SHARED") return "SHARED";
  if (u === "PUBLISHED") return "PUBLISHED";
  if (u === "ARCHIVED") return "ARCHIVED";
  return null;
}

export const ISO_ATTACHMENT_LABELS: Record<IsoAttachmentContainer, { title: string; hint: string }> = {
  WIP: {
    title: "01_WIP — Trabajo en curso",
    hint: "Borrador y trabajo interno no publicado (estado en desarrollo).",
  },
  SHARED: {
    title: "SHARED — Compartido",
    hint: "Información compartida para coordinación entre equipos o con el cliente.",
  },
  PUBLISHED: {
    title: "PUBLISHED — Publicado",
    hint: "Información formal emitida o aprobada para uso contractual.",
  },
  ARCHIVED: {
    title: "ARCHIVED — Archivo",
    hint: "Histórico o versiones sustituidas; conservación según política del proyecto.",
  },
};
