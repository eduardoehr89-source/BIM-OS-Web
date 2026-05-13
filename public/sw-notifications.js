/**
 * sw-notifications.js
 * Service Worker mínimo para BIM.OS — maneja notificaciones push de escritorio
 * y el evento "notificationclick" para abrir la URL correcta.
 *
 * Ubicación: /public/sw-notifications.js
 * Se registra desde NotificationPermissionBootstrap / FileUploadNotifier.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

/**
 * Cuando el usuario hace clic en la notificación:
 * - Si hay una pestaña de BIM.OS abierta → la enfoca.
 * - Si no → abre una nueva.
 */
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
