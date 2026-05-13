/**
 * sw-notifications.js — BIM.OS
 * Service Worker para notificaciones de escritorio nativas.
 * Funciona incluso con la pestaña minimizada o en segundo plano.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// ── Recibe mensajes desde el hilo principal ──────────────────────────────────
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "SHOW_NOTIFICATION") return;

  const { title, body, icon, tag, url } = data;

  event.waitUntil(
    self.registration.showNotification(title ?? "BIM.OS", {
      body: body ?? "",
      icon: icon ?? "/favicon.ico",
      badge: "/favicon.ico",
      tag: tag ?? "bimos-notif",
      requireInteraction: false,
      data: { url: url ?? "/" },
    })
  );
});

// ── Clic en la notificación: enfocar o abrir pestaña ────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/proyectos";
  const absolute = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            client.navigate(absolute);
            return client.focus();
          }
        }
        return self.clients.openWindow(absolute);
      })
  );
});
