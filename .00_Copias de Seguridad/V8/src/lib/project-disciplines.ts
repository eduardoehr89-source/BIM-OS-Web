/** Claves persistidas en `Project.disciplinesInvolved` como CSV. */
export const PROJECT_DISCIPLINE_OPTIONS = [
  { key: "ARQUITECTURA", label: "Arquitectura" },
  { key: "ESTRUCTURA", label: "Estructura" },
  { key: "MEP", label: "MEP" },
  { key: "PAISAJISMO", label: "Paisajismo" },
  { key: "SEGURIDAD", label: "Seguridad" },
  { key: "TELECOMUNICACIONES", label: "Telecomunicaciones" },
] as const;

export type ProjectDisciplineKey = (typeof PROJECT_DISCIPLINE_OPTIONS)[number]["key"];

const ALLOWED = new Set<string>(PROJECT_DISCIPLINE_OPTIONS.map((o) => o.key));

export function disciplinesArrayToCsv(keys: string[]): string {
  const ordered = PROJECT_DISCIPLINE_OPTIONS.map((o) => o.key).filter((k) => keys.includes(k));
  return ordered.join(",");
}

export function disciplinesCsvToArray(csv: string | null | undefined): ProjectDisciplineKey[] {
  if (csv == null) return [];
  const raw = typeof csv === "string" ? csv : String(csv);
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is ProjectDisciplineKey => ALLOWED.has(s));
}

export function parseDisciplinesFromBody(body: unknown): string | undefined {
  if (body === undefined) return undefined;
  if (!Array.isArray(body)) return "";
  return disciplinesArrayToCsv(body.filter((x): x is string => typeof x === "string"));
}

export function parseOptionalIsoDate(v: unknown): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseProjectCodeField(v: unknown): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const t = String(v).trim();
  return t === "" ? null : t;
}
