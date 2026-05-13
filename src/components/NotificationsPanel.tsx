"use client";

import { Bell, X, Trash2, CheckCheck, FolderOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Notif = {
  id: string;
  tipo: string;
  titulo: string;
  cuerpo: string;
  projectId: string | null;
  fileName: string | null;
  uploaderName: string | null;
  leida: boolean;
  createdAt: string;
};

/**
 * NotificationsPanel
 *
 * Campana persistente en la barra superior que muestra el historial de
 * notificaciones guardadas en DB. Incluye:
 * - Badge rojo con el número de no leídas
 * - "✓ Marcar todas como leídas"
 * - "🗑 Limpiar" (eliminar todas)
 * - "✕" para cerrar el panel
 * - Eliminar notificación individual
 */
export function NotificationsPanel() {
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => !n.leida).length;

  // Carga inicial y polling cada 30 s
  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 30_000);
    return () => clearInterval(id);
  }, []);

  // Cerrar al hacer clic fuera del panel
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Al abrir el panel → marcar todas como leídas automáticamente
  useEffect(() => {
    if (open && unreadCount > 0) {
      void markAllRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function load() {
    try {
      const res = await fetch("/api/notifications", { credentials: "same-origin" });
      if (res.ok) setItems(await res.json() as Notif[]);
    } catch { /* noop */ }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
        credentials: "same-origin",
      });
      setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch { /* noop */ }
  }

  async function clearAll() {
    setLoading(true);
    try {
      await fetch("/api/notifications", { method: "DELETE", credentials: "same-origin" });
      setItems([]);
    } catch { /* noop */ } finally {
      setLoading(false);
    }
  }

  async function deleteOne(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE", credentials: "same-origin" });
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch { /* noop */ }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="relative inline-block" ref={panelRef}>
      {/* ── Botón campana ── */}
      <button
        id="notifications-bell-btn"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-900" />
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          className="absolute right-0 z-50 mt-2 flex w-80 flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl ring-1 ring-black/20"
          style={{ maxHeight: "28rem" }}
        >
          {/* Cabecera */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Notificaciones
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <>
                  <button
                    id="notif-mark-read-btn"
                    type="button"
                    onClick={() => void markAllRead()}
                    className="rounded p-1 text-slate-500 transition hover:text-slate-200"
                    title="Marcar todas como leídas"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="notif-clear-btn"
                    type="button"
                    onClick={() => void clearAll()}
                    disabled={loading}
                    className="rounded p-1 text-slate-500 transition hover:text-red-400"
                    title="Limpiar todas"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button
                id="notif-close-btn"
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-500 transition hover:text-slate-200"
                title="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <Bell className="h-8 w-8 text-slate-700" strokeWidth={1} />
                <p className="text-xs text-slate-500">Sin notificaciones</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-800">
                {items.map((n) => (
                  <li
                    key={n.id}
                    className={`group relative flex gap-3 px-4 py-3 transition ${
                      n.leida ? "opacity-60" : "bg-slate-800/30"
                    }`}
                  >
                    {/* Ícono tipo */}
                    <div className="mt-0.5 shrink-0">
                      <FolderOpen className="h-4 w-4 text-blue-400" strokeWidth={1.75} />
                    </div>

                    {/* Contenido */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-slate-200">
                        {n.titulo}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                        {n.cuerpo}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>

                    {/* Botón eliminar individual */}
                    <button
                      type="button"
                      onClick={() => void deleteOne(n.id)}
                      className="absolute right-3 top-3 hidden rounded p-0.5 text-slate-600 transition hover:text-red-400 group-hover:flex"
                      title="Eliminar"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pie */}
          {items.length > 0 && (
            <div className="shrink-0 border-t border-slate-800 px-4 py-2 text-center">
              <span className="text-[10px] text-slate-600">
                {items.length} notificación{items.length !== 1 ? "es" : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
