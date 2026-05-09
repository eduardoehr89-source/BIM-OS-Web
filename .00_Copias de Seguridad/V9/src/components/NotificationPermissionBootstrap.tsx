"use client";

import { useEffect } from "react";

/** Solicita permiso de notificaciones del navegador al montar (temporal / diagnóstico). */
export function NotificationPermissionBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    void Notification.requestPermission().then((permission) => {
      console.log("Estado de permiso:", permission);
    });
  }, []);

  return null;
}
