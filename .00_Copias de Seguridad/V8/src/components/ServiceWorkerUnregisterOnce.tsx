"use client";

import { useEffect } from "react";

/** Ejecuta unregister de todos los SW una sola vez por pestaña (temporal / reset). */
const SW_RESET_SESSION_KEY = "bimos_sw_unregister_reset_once";

export function ServiceWorkerUnregisterOnce() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (sessionStorage.getItem(SW_RESET_SESSION_KEY)) return;
    sessionStorage.setItem(SW_RESET_SESSION_KEY, "1");

    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister();
        console.log("Service Worker eliminado para reset");
      }
    });
  }, []);

  return null;
}
