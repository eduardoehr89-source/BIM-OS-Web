"use client";

import { createElement, useEffect, useRef } from "react";
import { toast } from "sonner";

const FILE_ICON = "/favicon.ico";

/**
 * Muestra una notificación nativa del SO vía Service Worker.
 * Sólo se dispara si la página está oculta/minimizada.
 */
async function showDesktopNotification(opts: {
  title: string;
  body: string;
  tag: string;
  url?: string;
}) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;

      // Intentar vía postMessage al SW (más confiable)
      if (registration.active) {
        registration.active.postMessage({
          type: "SHOW_NOTIFICATION",      // ← el SW escucha exactamente este tipo
          title: opts.title,
          body: opts.body,
          icon: FILE_ICON,
          tag: opts.tag,
          url: opts.url ?? "/proyectos",
        });
        return;
      }

      // Fallback directo vía registro
      await registration.showNotification(opts.title, {
        body: opts.body,
        icon: FILE_ICON,
        tag: opts.tag,
        requireInteraction: false,
        data: { url: opts.url ?? "/proyectos" },
      });
    } else {
      // Fallback a la API clásica (visible aunque la pestaña esté activa)
      new Notification(opts.title, { body: opts.body, icon: FILE_ICON });
    }
  } catch {
    /* noop — nunca bloquear */
  }
}

export function useFileUploadAlerts(userRole?: string, isSupremo?: boolean) {
  const sinceRef = useRef<string | null>(null);
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const eligible = userRole === "ADMIN" || isSupremo;
    if (!eligible) return;

    // Registrar el SW correcto (sw-notifications.js, no sw.js)
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker
        .register("/sw-notifications.js", { scope: "/" })
        .catch(() => {});
    }

    sinceRef.current = new Date().toISOString();

    const tick = async () => {
      const since = sinceRef.current;
      if (!since) return;
      try {
        const res = await fetch(
          `/api/notifications/file-uploads?since=${encodeURIComponent(since)}`,
          { credentials: "same-origin" }
        );
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

          const title = "📁 Nuevo archivo en BIM.OS";
          const body = `"${ev.originalName}" subido por ${who}`;

          const isHidden =
            typeof document !== "undefined" && document.visibilityState !== "visible";

          if (isHidden) {
            // Página oculta/minimizada → notificación nativa del SO
            await showDesktopNotification({
              title,
              body,
              tag: `file-upload-${ev.id}`,
              url: "/proyectos",
            });
          } else {
            // Página visible → toast en pantalla
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
                    createElement("span", { className: "font-medium text-zinc-300" }, who)
                  )
                ),
              { duration: 7500 }
            );
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
