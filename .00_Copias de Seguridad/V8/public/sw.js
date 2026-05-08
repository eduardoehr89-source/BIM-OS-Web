/* BIM.OS Service Worker — Notification Controller */
/* Versión 1.2 — chat minimizado vía CHAT_MESSAGE_NOTIFICATION */
/* Sin listener "fetch": /api/* (p. ej. /api/chat, /api/messages, /api/comunicaciones/*) nunca se cachea ni se altera aquí. */

const CACHE_VERSION = 'bimos-sw-v2';

/** True si alguna ventana controlada está en primer plano (visible). */
async function anyWindowClientVisible() {
  const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  return list.some((c) => c.visibilityState === 'visible');
}

/* ─── Instalación ──────────────────────────────────────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/* ─── Push (sin servidor VAPID: solo diagnóstico / futuro) ─────────────────── */
self.addEventListener('push', (event) => {
  console.log('[BIM.OS SW] push event recibido', event);

  const showFromPush = async (title, options) => {
    const visible = await anyWindowClientVisible();
    if (visible) {
      console.log('[BIM.OS SW] push omitido: hay cliente visible');
      return;
    }
    await self.registration.showNotification(title, options);
  };

  let body = 'Notificación push';
  try {
    if (event.data) {
      const t = event.data.text();
      body = t || body;
      try {
        const j = JSON.parse(t);
        if (j.title || j.body) {
          event.waitUntil(
            showFromPush(j.title || 'BIM.OS', {
              body: j.body || body,
              icon: j.icon || '/icon.png',
              badge: '/favicon.ico',
            }),
          );
          return;
        }
      } catch (_) {
        /* usar texto plano */
      }
    }
  } catch (e) {
    console.warn('[BIM.OS SW] push parse error', e);
  }
  event.waitUntil(
    showFromPush('BIM.OS', { body, icon: '/icon.png', badge: '/favicon.ico' }),
  );
});

/* ─── Mensajes desde el cliente principal ──────────────────────────────────── */
self.addEventListener('message', (event) => {
  console.log('[BIM.OS SW] message raw', event.data?.type);

  if (event.data?.type === 'PING') {
    console.log('[BIM.OS SW] PING — SW activo');
    event.source?.postMessage?.({ type: 'PONG', at: Date.now() });
    return;
  }

  if (event.data?.type === 'SHOW_NOTIFICATION_DIRECT') {
    const { title, options } = event.data;
    event.waitUntil(
      (async () => {
        const visible = await anyWindowClientVisible();
        if (visible) return;
        await self.registration.showNotification(title || 'BIM.OS', options || { icon: '/icon.png' });
      })(),
    );
    return;
  }

  /** Radar de archivos: banner nativo obligatorio si ningún cliente está visible. */
  if (event.data?.type === 'FILE_UPLOAD_NOTIFICATION') {
    const { title, body, icon, tag, requireInteraction } = event.data;
    event.waitUntil(
      (async () => {
        const visible = await anyWindowClientVisible();
        if (visible) {
          console.log('[BIM.OS SW] FILE_UPLOAD omitido: cliente visible (toast en página)');
          return;
        }
        await self.registration.showNotification(title || '📁 Alerta de Archivo BIM.OS', {
          body: body || '',
          icon: icon || '/icon.png',
          badge: '/favicon.ico',
          tag: tag || 'file-upload',
          requireInteraction: requireInteraction !== false,
          data: { kind: 'file-upload' },
        });
      })(),
    );
    return;
  }

  /** Chat: mismo criterio de visibilidad que el radar de archivos (Windows / PWA). */
  if (event.data?.type === 'CHAT_MESSAGE_NOTIFICATION') {
    const { title, body, icon, tag, requireInteraction } = event.data;
    event.waitUntil(
      (async () => {
        const visible = await anyWindowClientVisible();
        if (visible) {
          console.log('[BIM.OS SW] CHAT_MESSAGE omitido: cliente visible (toast en página)');
          return;
        }
        await self.registration.showNotification(title || 'Chat BIM.OS', {
          body: body || '',
          icon: icon || '/icon.png',
          badge: '/favicon.ico',
          tag: tag || 'chat-message',
          requireInteraction: requireInteraction !== false,
          data: { kind: 'chat' },
        });
      })(),
    );
    return;
  }

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

  console.log('[BIM.OS SW] SHOW_NOTIFICATION → showNotification', title);
  event.waitUntil(self.registration.showNotification(title, options));
});

/* ─── Click en la notificación → abrir/focalizar la app ──────────────────── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const tag = event.notification.tag || '';
  let targetPath = '/comunicaciones';
  if (tag === 'file-upload') targetPath = '/proyectos';
  else if (typeof tag === 'string' && tag.startsWith('chat-message:')) {
    targetPath = `/comunicaciones/${tag.slice('chat-message:'.length)}`;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((c) => c.url.includes(targetPath));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(targetPath);
    }),
  );
});
