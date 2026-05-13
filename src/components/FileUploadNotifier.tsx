"use client";

import { useEffect, useState } from "react";
import { useFileUploadSSE } from "@/hooks/useFileUploadSSE";

/**
 * FileUploadNotifier
 *
 * Componente cliente que:
 * 1. Solicita permiso de notificaciones al navegador (solo una vez, con un
 *    banner no invasivo si el permiso aún es "default").
 * 2. Activa el hook SSE para recibir eventos de subida en tiempo real.
 *
 * Colocarlo en el layout autenticado (MainLayout o AppChrome) para que esté
 * activo en toda la aplicación.
 */
export function FileUploadNotifier() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Leer el estado real del permiso al montar y registrar SW
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    const current = Notification.permission;
    setPermission(current);
    if (current === "default") setShowBanner(true);

    // Registrar Service Worker para notificaciones visibles con web minimizada
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw-notifications.js")
        .catch(() => {/* ignora si ya está registrado */});
    }
  }, []);

  // Activar SSE solo si el permiso ya fue concedido
  useFileUploadSSE({ enabled: permission === "granted" });

  const handleAllow = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        maxWidth: "22rem",
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        color: "#e2e8f0",
        fontFamily: "inherit",
        fontSize: "0.875rem",
        lineHeight: "1.5",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>
        🔔 Activar notificaciones
      </p>
      <p style={{ margin: 0, color: "#94a3b8" }}>
        Recibe alertas instantáneas cuando se suba un archivo a un proyecto,
        incluso con la ventana minimizada.
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          id="notif-allow-btn"
          onClick={handleAllow}
          style={{
            flex: 1,
            padding: "0.45rem 0.75rem",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.8rem",
          }}
        >
          Activar
        </button>
        <button
          id="notif-dismiss-btn"
          onClick={handleDismiss}
          style={{
            flex: 1,
            padding: "0.45rem 0.75rem",
            backgroundColor: "#1e293b",
            color: "#94a3b8",
            border: "1px solid #334155",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
