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
  notify: (payload: NotifPayload) => Promise<void>;
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
        console.log("[BIM.OS] Service Worker registrado:", reg.scope, "waiting=", !!reg.waiting, "installing=", !!reg.installing);
        reg.addEventListener("updatefound", () => {
          console.log("[BIM.OS] SW updatefound");
        });
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
    console.log("[BIM.OS] requestPermission() previo:", Notification.permission);
    const result = await Notification.requestPermission();
    console.log("[BIM.OS] requestPermission() resultado:", result);
    setPermission(result as PermissionState);
  }, []);

  const notify = useCallback(async (payload: NotifPayload) => {
    console.log("[BIM.OS notify] entrada", payload);
    if (Notification.permission !== "granted") {
      console.warn("[BIM.OS notify] abort: Notification.permission !== granted →", Notification.permission);
      return;
    }
    if (payload.silenced) {
      console.log("[BIM.OS notify] abort: silenciado");
      return;
    }

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

    try {
      if ("serviceWorker" in navigator) {
        console.log("[BIM.OS notify] esperando serviceWorker.ready…");
        const reg = await navigator.serviceWorker.ready;
        console.log("[BIM.OS notify] SW ready; active=", reg.active?.state);
        const sw = reg.active || reg.waiting || reg.installing;
        if (sw) {
          console.log("[BIM.OS notify] postMessage → SW");
          sw.postMessage({ type: "SHOW_NOTIFICATION", ...payload });
          return;
        }
        console.warn("[BIM.OS notify] sin worker activo; showNotification desde registration");
        await reg.showNotification(title, {
          body,
          icon: "/icon.png",
          badge: "/favicon.ico",
          tag: payload.tag,
          requireInteraction: payload.isAdmin,
        });
        console.log("[BIM.OS notify] registration.showNotification OK");
        return;
      }
    } catch (e) {
      console.error("[BIM.OS notify] error SW path:", e);
    }

    console.warn("[BIM.OS notify] fallback registration desde swRef");
    try {
      const reg = swRef.current;
      if (reg) {
        await reg.showNotification(title, {
          body,
          icon: "/icon.png",
          badge: "/favicon.ico",
          tag: payload.tag,
          requireInteraction: payload.isAdmin,
        });
      }
    } catch (e2) {
      console.error("[BIM.OS notify] fallo total:", e2);
    }
  }, []);

  return { permission, requestPermission, notify, swReady };
}
