import type { IsoAttachmentContainer } from "@/generated/prisma";

/** Códigos cortos alineados con la UI BIM.OS (01_WIP, …). */
export const REVIT_CONTAINER_CODIGO: Record<IsoAttachmentContainer, string> = {
  WIP: "01_WIP",
  SHARED: "02_SHARED",
  PUBLISHED: "03_PUBLISHED",
  ARCHIVED: "04_ARCHIVED",
};

export const REVIT_CONTAINER_TITULO: Record<IsoAttachmentContainer, string> = {
  WIP: "01_WIP — Trabajo en curso",
  SHARED: "02_SHARED — Compartido",
  PUBLISHED: "03_PUBLISHED — Publicado",
  ARCHIVED: "04_ARCHIVED — Archivo",
};

const ORDER: IsoAttachmentContainer[] = ["WIP", "SHARED", "PUBLISHED", "ARCHIVED"];

export function sortContainers<T extends { container: IsoAttachmentContainer }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => ORDER.indexOf(a.container) - ORDER.indexOf(b.container));
}
