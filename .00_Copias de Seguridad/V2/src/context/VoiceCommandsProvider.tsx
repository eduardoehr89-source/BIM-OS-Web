"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { VoiceFilterPayload, VoiceNavigatePayload } from "@/lib/voice/types";
import { isVoiceCommandMessage } from "@/lib/voice/types";

export type StatusFilter = VoiceFilterPayload;

export type VoiceCommandsContextValue = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (s: StatusFilter) => void;
};

const VoiceCommandsContext = createContext<VoiceCommandsContextValue | null>(null);

export function VoiceCommandsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const navigateSafe = useCallback(
    (path: VoiceNavigatePayload) => {
      router.push(path);
    },
    [router],
  );

  useEffect(() => {
    const origin = window.location.origin;

    function onMessage(event: MessageEvent) {
      if (event.origin !== origin) return;
      const data = event.data;
      if (!isVoiceCommandMessage(data)) return;

      switch (data.command) {
        case "navigate":
          if (
            data.payload === "/dashboard" ||
            data.payload === "/proyectos" ||
            data.payload === "/tareas" ||
            data.payload === "/clientes" ||
            data.payload === "/reglamentos"
          ) {
            navigateSafe(data.payload);
          }
          break;
        case "filter-status":
          if (
            data.payload === "INICIO_PENDIENTE" ||
            data.payload === "EN_PROCESO" ||
            data.payload === "PAUSADO" ||
            data.payload === "TERMINADO" ||
            data.payload === "CANCELADO" ||
            data.payload === "all"
          ) {
            setStatusFilter(data.payload);
          }
          break;
        case "search": {
          const q =
            typeof data.payload === "string"
              ? data.payload
              : typeof data.text === "string"
                ? data.text
                : "";
          setSearchQuery(q.trim());
          break;
        }
        default:
          break;
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigateSafe]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
    }),
    [searchQuery, statusFilter],
  );

  return (
    <VoiceCommandsContext.Provider value={value}>{children}</VoiceCommandsContext.Provider>
  );
}

export function useVoiceCommands() {
  const ctx = useContext(VoiceCommandsContext);
  if (!ctx) {
    throw new Error("useVoiceCommands debe usarse dentro de VoiceCommandsProvider");
  }
  return ctx;
}
