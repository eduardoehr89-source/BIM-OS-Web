"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type NotifDetail = "BREVE" | "INTERMEDIO" | "COMPLETO";

export interface NotifPayload {
  senderName: string;
  channelName: string;
  messageText: string;
  isAdmin: boolean;
  detalle: NotifDetail;
  silenced: boolean;
  tag?: string;
}

type PermissionState = "default" | "granted" | "denied" | "unsupported";

interface UsePushNotificationsReturn {
  permission: PermissionState;
  requestPermission: () => Promise<void>;
  notify: (payload: NotifPayload) => void;
  swReady: boolean;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [swReady, setSwReady] = useState(false);
  const swRef = useRef<ServiceWorkerRegistration | null>(null);

  // Registrar el Service Worker al montar
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission as PermissionState);

    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        swRef.current = reg;
        setSwReady(true);
        console.log("[BIM.OS] Service Worker registrado:", reg.scope);
      })
      .catch((err) => {
        console.warn("[BIM.OS] Service Worker no pudo registrarse:", err);
      });

    // Escuchar cambios de permiso (Chrome 93+)
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "notifications" }).then((status) => {
        status.onchange = () => {
          setPermission(Notification.permission as PermissionState);
        };
      }).catch(() => {/* noop */});
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as PermissionState);
  }, []);

  const notify = useCallback((payload: NotifPayload) => {
    if (Notification.permission !== "granted") return;
    if (payload.silenced) return;

    // Intentar via SW (funciona en background)
    const sw = swRef.current?.active;
    if (sw) {
      sw.postMessage({ type: "SHOW_NOTIFICATION", ...payload });
      return;
    }

    // Fallback: notificación directa (solo funciona con ventana activa)
    const adminPrefix = payload.isAdmin ? "[ADMIN] " : "";
    let title = "BIM.OS";
    let body = "Tienes una nueva notificación.";

    switch (payload.detalle) {
      case "COMPLETO":
        title = `${adminPrefix}${payload.senderName} (${payload.channelName})`;
        body = payload.messageText || "…";
        break;
      case "INTERMEDIO":
        title = `${adminPrefix}${payload.senderName}`;
        body = `Envió un mensaje en ${payload.channelName}`;
        break;
      default:
        title = "Sistema BIM.OS";
        body = payload.isAdmin
          ? "[ADMIN] Tienes un mensaje importante."
          : "Tienes una nueva notificación.";
    }

    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: payload.tag,
      requireInteraction: payload.isAdmin,
    });
  }, []);

  return { permission, requestPermission, notify, swReady };
}
