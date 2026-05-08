"use client";

import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { openVoiceAssistantPiP } from "@/lib/voice/pipAssistant";

export function AssistantButton() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setSupported(!!window.documentPictureInPicture?.requestWindow);
    });
  }, []);

  async function handleClick() {
    setError(null);
    setBusy(true);
    try {
      await openVoiceAssistantPiP();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo abrir el asistente");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || !supported}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Mic className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
        {busy ? "Abriendo" : "Asistente"}
      </button>
      {!supported && (
        <span className="max-w-[220px] text-right text-[10px] text-muted-foreground">
          PiP no disponible en este navegador
        </span>
      )}
      {error && (
        <span className="max-w-[260px] text-right text-[10px] text-destructive">{error}</span>
      )}
    </div>
  );
}
