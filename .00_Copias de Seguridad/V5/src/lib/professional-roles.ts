/**
 * Cargos profesionales permitidos (valor guardado en BD = etiqueta visible).
 * Orden alfabético estricto por etiqueta.
 */
export const ROL_PROFESIONAL_OPCIONES = [
  { value: "ARQUITECTO", label: "ARQUITECTO" },
  { value: "BIM MANAGER", label: "BIM MANAGER" },
  { value: "COORDINADOR BIM", label: "COORDINADOR BIM" },
  { value: "ESPECIALISTA BIM", label: "ESPECIALISTA BIM" },
  { value: "GERENTE BIM", label: "GERENTE BIM" },
  { value: "INGENIERO ELÉCTRICO", label: "INGENIERO ELÉCTRICO" },
  { value: "INGENIERO ESTRUCTURAL", label: "INGENIERO ESTRUCTURAL" },
  { value: "INGENIERO MECÁNICO", label: "INGENIERO MECÁNICO" },
  { value: "MODELADOR BIM JR", label: "MODELADOR BIM JR" },
  { value: "MODELADOR BIM SR", label: "MODELADOR BIM SR" },
] as const;

export type RolProfesionalValue = (typeof ROL_PROFESIONAL_OPCIONES)[number]["value"];

export const ROL_PROFESIONAL_VALUES = new Set<string>(ROL_PROFESIONAL_OPCIONES.map((o) => o.value));

/** Valores antiguos (enum Prisma) → etiqueta actual */
const LEGACY_ROL_LABELS: Record<string, string> = {
  ARQUITECTO: "ARQUITECTO",
  BIM_MANAGER: "BIM MANAGER",
  COORDINADOR_BIM: "COORDINADOR BIM",
  ESPECIALISTA_BIM: "ESPECIALISTA BIM",
  GERENTE_BIM: "GERENTE BIM",
  INGENIERO_ELECTRICO: "INGENIERO ELÉCTRICO",
  INGENIERO_ESTRUCTURAL: "INGENIERO ESTRUCTURAL",
  INGENIERO_MECANICO: "INGENIERO MECÁNICO",
  MODELADOR_BIM_JR: "MODELADOR BIM JR",
  MODELADOR_BIM_SR: "MODELADOR BIM SR",
};

export function labelRolProfesional(value: string): string {
  if (ROL_PROFESIONAL_VALUES.has(value)) return value;
  return LEGACY_ROL_LABELS[value] ?? value;
}

export function isRolProfesional(value: unknown): value is RolProfesionalValue {
  return typeof value === "string" && ROL_PROFESIONAL_VALUES.has(value);
}

/** Acepta cuerpo legacy (slugs) y los normaliza al string guardado en BD. */
export function normalizeRolProfesional(value: string): string | null {
  const t = value.trim();
  if (ROL_PROFESIONAL_VALUES.has(t)) return t;
  if (t in LEGACY_ROL_LABELS) return LEGACY_ROL_LABELS[t];
  return null;
}

/** Valor para <select> a partir de lo guardado en BD (incluye slugs legacy). */
export function storedRolToSelectValue(stored: string): string {
  if (ROL_PROFESIONAL_VALUES.has(stored)) return stored;
  return LEGACY_ROL_LABELS[stored] ?? ROL_PROFESIONAL_OPCIONES[0].value;
}
