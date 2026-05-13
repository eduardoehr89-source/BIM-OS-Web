"use client";

import { useEffect, useRef } from "react";

export type FileUploadSSEEvent = {
  type: "FILE_UPLOADED";
  eventId: string;
  projectId: string;
  projectName: string;
  fileName: string;
  uploaderName: string;
  uploaderId: string | null;
  createdAt: string;
};

type Options = {
  /** Si es false el hook no hace nada (ej. usuario sin sesión) */
  enabled?: boolean;
};

/**
 * useFileUploadSSE
 *
 * Abre y mantiene una conexión Server-Sent Events contra
 * /api/sse/file-uploads.  Cuando llega un evento FILE_UPLOADED
 * dispara una notificación de escritorio del navegador.
 *
 * Ciclo de vida: el servidor cierra la respuesta a los ~20 s
 * (límite de Vercel).  El hook reabre la conexión automáticamente.
 */
export function useFileUploadSSE({ enabled = true }: Options = {}) {
  const lastSeenRef = useRef<string>(new Date(Date.now() - 5_000).toISOString());
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    function connect() {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }

      const url = `/api/sse/file-uploads?since=${encodeURIComponent(lastSeenRef.current)}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.onmessage = (e) => {
        let payload: FileUploadSSEEvent;
        try {
          payload = JSON.parse(e.data) as FileUploadSSEEvent;
        } catch {
          return;
        }
        if (payload.type !== "FILE_UPLOADED") return;

        // Avanzar el cursor para la próxima reconexión
        lastSeenRef.current = payload.createdAt;

        // Disparar notificación de escritorio
        fireDesktopNotification(payload);
      };

      es.onerror = () => {
        // El servidor cerró la conexión (fin del ciclo o error) → reconectar
        es.close();
        esRef.current = null;
        reconnectTimer.current = setTimeout(connect, 500);
      };
    }

    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [enabled]);
}

// ── Notificación de escritorio ────────────────────────────────────────────────

function fireDesktopNotification(ev: FileUploadSSEEvent) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const title = `📂 Archivo subido en ${ev.projectName}`;
  const body = `${ev.uploaderName} subió "${ev.fileName}"`;

  // Preferimos el Service Worker para que se muestre aunque la pestaña esté minimizada
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => {
        return reg.showNotification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: `file-upload-${ev.eventId}`,
          data: { url: `/proyectos` },
        });
      })
      .catch(() => {
        // Fallback: API clásica
        new Notification(title, { body, icon: "/favicon.ico" });
      });
  } else {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
}
