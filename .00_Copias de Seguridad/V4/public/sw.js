/* BIM.OS Service Worker — Notification Controller */
/* Versión 1.0 */

const CACHE_VERSION = 'bimos-sw-v1';

/* ─── Instalación ──────────────────────────────────────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/* ─── Mensajes desde el cliente principal ──────────────────────────────────── */
self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SHOW_NOTIFICATION') return;

  const {
    senderName,
    channelName,
    messageText,
    isAdmin,
    detalle,           // 'BREVE' | 'INTERMEDIO' | 'COMPLETO'
    silenced,          // bool — ya calculado por el cliente
    tag,
  } = event.data;

  // Respetar silencio — no mostrar nada
  if (silenced) return;

  let title = 'BIM.OS';
  let body  = 'Tienes una nueva notificación.';
  const adminPrefix = isAdmin ? '[ADMIN] ' : '';

  switch (detalle) {
    case 'COMPLETO':
      title = `${adminPrefix}${senderName} (${channelName})`;
      body  = messageText || '…';
      break;
    case 'INTERMEDIO':
      title = `${adminPrefix}${senderName}`;
      body  = `Envió un mensaje en ${channelName}`;
      break;
    case 'BREVE':
    default:
      title = 'Sistema BIM.OS';
      body  = isAdmin ? '[ADMIN] Tienes un mensaje importante.' : 'Tienes una nueva notificación.';
      break;
  }

  const options = {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: tag || 'bimos-notif',
    renotify: true,
    requireInteraction: isAdmin,   // Los mensajes de admin requieren dismiss manual
    data: { channelName, senderName },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ─── Click en la notificación → abrir/focalizar la app ──────────────────── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarlacla
        const existing = clientList.find((c) => c.url.includes('/comunicaciones'));
        if (existing) {
          return existing.focus();
        }
        return self.clients.openWindow('/comunicaciones');
      })
  );
});
