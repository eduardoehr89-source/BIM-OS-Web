export type VoiceCommandType =
  | "navigate"
  | "filter-status"
  | "search"
  | "transcript-update";

export type VoiceNavigatePayload =
  | "/dashboard"
  | "/proyectos"
  | "/tareas"
  | "/clientes"
  | "/reglamentos";

import type { ProjectStatusCode } from "@/lib/project-status";

export type VoiceFilterPayload = ProjectStatusCode | "all";

export type VoiceCommandMessage = {
  type: "voice-command";
  command: VoiceCommandType;
  payload?: VoiceNavigatePayload | VoiceFilterPayload | string;
  text?: string;
};

export function isVoiceCommandMessage(data: unknown): data is VoiceCommandMessage {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return d.type === "voice-command" && typeof d.command === "string";
}
