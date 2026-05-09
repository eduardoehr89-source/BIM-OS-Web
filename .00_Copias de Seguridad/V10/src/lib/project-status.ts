/** Igual que `enum ProjectStatus` en Prisma; definido aquí para no importar el cliente Prisma en la UI. */
export type ProjectStatusCode =
  | "INCOMPLETO"
  | "INICIO_PENDIENTE"
  | "EN_PROCESO"
  | "PAUSADO"
  | "TERMINADO"
  | "CANCELADO";

/** Orden fijo para tablas y dashboard (valores exactos persistidos en BD). */
export const PROJECT_STATUS_VALUES: readonly ProjectStatusCode[] = [
  "INCOMPLETO",
  "INICIO_PENDIENTE",
  "EN_PROCESO",
  "PAUSADO",
  "TERMINADO",
  "CANCELADO",
] as const satisfies readonly ProjectStatusCode[];

const LEGACY_DB_VALUES: Record<string, ProjectStatusCode> = {
  Pendiente: "INICIO_PENDIENTE",
  EnCurso: "EN_PROCESO",
  Completada: "TERMINADO",
};

/** Etiquetas visibles (espacios permitidos solo aquí, no en BD). */
export function labelProjectStatus(code: string): string {
  switch (code as ProjectStatusCode) {
    case "INCOMPLETO":
      return "INCOMPLETO";
    case "INICIO_PENDIENTE":
      return "INICIO PENDIENTE";
    case "EN_PROCESO":
      return "EN PROCESO";
    case "PAUSADO":
      return "PAUSADO";
    case "TERMINADO":
      return "TERMINADO";
    case "CANCELADO":
      return "CANCELADO";
    default:
      return code;
  }
}

export const PROJECT_STATUS_OPTIONS = PROJECT_STATUS_VALUES.map((value) => ({
  value,
  label: labelProjectStatus(value),
}));

function normalizeStatusToken(raw: string): ProjectStatusCode | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (PROJECT_STATUS_VALUES.includes(trimmed as ProjectStatusCode)) {
    return trimmed as ProjectStatusCode;
  }

  const legacy = LEGACY_DB_VALUES[trimmed];
  if (legacy) return legacy;

  const underscored = trimmed.replace(/\s+/g, "_").toUpperCase();
  if (PROJECT_STATUS_VALUES.includes(underscored as ProjectStatusCode)) {
    return underscored as ProjectStatusCode;
  }

  return null;
}

/** Acepta valores canónicos, etiquetas con espacios y valores legacy de migraciones antiguas. */
export function parseProjectStatus(v: unknown): ProjectStatusCode | null {
  if (typeof v !== "string") return null;
  return normalizeStatusToken(v);
}

/** Valor por defecto en formularios nuevos (sin BEP el servidor fuerza INCOMPLETO). */
export const DEFAULT_PROJECT_STATUS: ProjectStatusCode = "INCOMPLETO";
