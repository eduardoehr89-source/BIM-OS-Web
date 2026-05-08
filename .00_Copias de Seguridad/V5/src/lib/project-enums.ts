import { TechnicalDocType, TaskComplexity, TaskDiscipline, TaskActivity, TaskEstatus } from "@/generated/prisma";

const DISC: TaskDiscipline[] = [
  "ARQUITECTURA",
  "ESTRUCTURA",
  "MEP",
  "MECHANICAL",
  "ELECTRICAL",
  "PLUMBING",
  "HVAC",
  "FIRE_PROTECTION",
  "LANDSCAPE",
  "OTROS",
];

/** Desglose por disciplina para alta de tareas (contenedor de información / modelo de datos ISO 19650). */
export const TASK_AUTHORING_DISCIPLINES: readonly TaskDiscipline[] = [
  "ARQUITECTURA",
  "ESTRUCTURA",
  "MEP",
  "MECHANICAL",
  "ELECTRICAL",
  "PLUMBING",
  "HVAC",
] as const;

const COMP: TaskComplexity[] = ["BAJO", "MEDIO", "ALTO"];

const TECH: TechnicalDocType[] = ["BEP", "OIR", "AIR", "EIR", "OTRO"];

const ACT: TaskActivity[] = ["MODELADO", "CUANTIFICACION", "DOCUMENTACION"];

const EST: TaskEstatus[] = ["PENDIENTE", "EN_PROCESO", "PAUSADA", "COMPLETADA"];

export function parseTaskDiscipline(v: unknown): TaskDiscipline | null {
  if (typeof v !== "string") return null;
  return DISC.includes(v as TaskDiscipline) ? (v as TaskDiscipline) : null;
}

export function mergeDisciplineSelectOptions(
  primary: readonly TaskDiscipline[],
  currentDisciplina: string,
): TaskDiscipline[] {
  const parsed = parseTaskDiscipline(currentDisciplina);
  const list = [...primary];
  if (parsed && !primary.includes(parsed)) list.push(parsed);
  return list;
}

export function parseTaskComplexity(v: unknown): TaskComplexity | null {
  if (typeof v !== "string") return null;
  return COMP.includes(v as TaskComplexity) ? (v as TaskComplexity) : null;
}

export function parseTechnicalDocType(v: unknown): TechnicalDocType | null {
  if (typeof v !== "string" || v === "") return null;
  return TECH.includes(v as TechnicalDocType) ? (v as TechnicalDocType) : null;
}

export function labelDiscipline(d: TaskDiscipline): string {
  const map: Record<TaskDiscipline, string> = {
    ARQUITECTURA: "Arquitectura",
    ESTRUCTURA: "Estructura",
    MEP: "MEP",
    MECHANICAL: "Mechanical",
    ELECTRICAL: "Electrical",
    PLUMBING: "Plumbing",
    HVAC: "HVAC",
    FIRE_PROTECTION: "Fire protection",
    LANDSCAPE: "Paisaje",
    OTROS: "Otros",
  };
  return map[d] ?? d;
}

export function labelComplexity(c: TaskComplexity): string {
  const map: Record<TaskComplexity, string> = {
    BAJO: "Bajo",
    MEDIO: "Medio",
    ALTO: "Alto",
  };
  return map[c] ?? c;
}

export function labelTechnicalDocType(t: TechnicalDocType): string {
  const map: Record<TechnicalDocType, string> = {
    BEP: "BEP",
    OIR: "OIR",
    AIR: "AIR",
    EIR: "EIR",
    OTRO: "Otro",
  };
  return map[t] ?? t;
}

export function parseTaskActivity(v: unknown): TaskActivity | null {
  if (typeof v !== "string") return null;
  return ACT.includes(v as TaskActivity) ? (v as TaskActivity) : null;
}

export function parseTaskEstatus(v: unknown): TaskEstatus | null {
  if (typeof v !== "string") return null;
  return EST.includes(v as TaskEstatus) ? (v as TaskEstatus) : null;
}

export function labelActivity(a: TaskActivity): string {
  const map: Record<TaskActivity, string> = {
    MODELADO: "Modelado",
    CUANTIFICACION: "Cuantificacion",
    DOCUMENTACION: "Documentacion",
  };
  return map[a] ?? a;
}

export function labelTaskEstatus(e: TaskEstatus): string {
  const map: Record<TaskEstatus, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En proceso",
    PAUSADA: "Pausada",
    COMPLETADA: "Completada",
  };
  return map[e] ?? e;
}

export const DISCIPLINE_OPTIONS = DISC;
export const COMPLEXITY_OPTIONS = COMP;
export const TECH_DOC_OPTIONS = TECH;
export const ACTIVITY_OPTIONS = ACT;
export const TASK_ESTATUS_OPTIONS = EST;
