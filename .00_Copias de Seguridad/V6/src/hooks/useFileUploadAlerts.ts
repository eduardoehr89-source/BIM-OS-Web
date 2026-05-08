"use client";

import { createElement, useEffect, useRef } from "react";
import { toast } from "sonner";

const FILE_ICON = "/icon.png";

async function showDesktopFileAlert(originalName: string, uploaderNombre: string) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (document.visibilityState === "visible") return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const title = "📁 Alerta de Archivo BIM.OS";
  const body = `Nuevo archivo: ${originalName} subido por ${uploaderNombre}`;

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const sw = registration.active;
      if (sw) {
        sw.postMessage({
          type: "FILE_UPLOAD_NOTIFICATION",
          title,
          body,
          icon: FILE_ICON,
          tag: "file-upload",
          requireInteraction: true,
        });
        return;
      }
      await registration.showNotification(title, {
        body,
        icon: FILE_ICON,
        tag: "file-upload",
        requireInteraction: true,
      });
    }
  } catch {
    /* noop */
  }
}

export function useFileUploadAlerts(userRole?: string, isSupremo?: boolean) {
  const sinceRef = useRef<string | null>(null);
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const eligible = userRole === "ADMIN" || isSupremo;
    if (!eligible) return;

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }

    sinceRef.current = new Date().toISOString();

    const tick = async () => {
      const since = sinceRef.current;
      if (!since) return;
      try {
        const res = await fetch(`/api/notifications/file-uploads?since=${encodeURIComponent(since)}`, {
          credentials: "same-origin",
        });
        if (!res.ok) return;

        const data = (await res.json()) as {
          events?: Array<{ id: string; originalName: string; uploaderNombre: string | null }>;
          nextSince?: string;
        };

        if (typeof data.nextSince === "string") {
          sinceRef.current = data.nextSince;
        }

        for (const ev of data.events ?? []) {
          if (seenRef.current.has(ev.id)) continue;
          seenRef.current.add(ev.id);
          const who = ev.uploaderNombre?.trim() || "Usuario";

          if (typeof document !== "undefined" && document.visibilityState === "visible") {
            toast.custom(
              () =>
                createElement(
                  "div",
                  {
                    className:
                      "pointer-events-auto flex max-w-[min(100vw-2rem,22rem)] gap-3 rounded-xl border border-zinc-600/90 bg-zinc-950 px-4 py-3 shadow-2xl ring-1 ring-zinc-700/40",
                  },
                  createElement(
                    "p",
                    { className: "text-[13px] leading-snug text-zinc-100" },
                    "📁 Nuevo archivo: ",
                    createElement("span", { className: "font-semibold text-white" }, ev.originalName),
                    " subido por ",
                    createElement("span", { className: "font-medium text-zinc-300" }, who),
                  ),
                ),
              { duration: 7500 },
            );
          } else {
            await showDesktopFileAlert(ev.originalName, who);
            if (typeof document !== "undefined" && Notification.permission !== "granted") {
              toast.custom(
                () =>
                  createElement(
                    "div",
                    {
                      className:
                        "pointer-events-auto flex max-w-[min(100vw-2rem,22rem)] gap-3 rounded-xl border border-zinc-600/90 bg-zinc-950 px-4 py-3 shadow-2xl ring-1 ring-zinc-700/40",
                    },
                    createElement(
                      "p",
                      { className: "text-[13px] leading-snug text-zinc-100" },
                      "📁 Nuevo archivo: ",
                      createElement("span", { className: "font-semibold text-white" }, ev.originalName),
                      " subido por ",
                      createElement("span", { className: "font-medium text-zinc-300" }, who),
                    ),
                  ),
                { duration: 7500 },
              );
            }
          }
        }
      } catch {
        /* noop */
      }
    };

    const id = window.setInterval(tick, 10_000);
    void tick();
    return () => clearInterval(id);
  }, [userRole, isSupremo]);
}
