"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type UserOpt = { id: string; nombre: string };
type ClientOpt = { id: string; nombre: string };
type ProjectOpt = { id: string; nombre: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

export function NuevoCanalModal({ open, onClose, onCreated }: Props) {
  const [nombre, setNombre] = useState("");
  const [tema, setTema] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [proyectoId, setProyectoId] = useState("");
  const [permiteTexto, setPermiteTexto] = useState(true);
  const [permiteVoz, setPermiteVoz] = useState(true);
  const [permiteArchivos, setPermiteArchivos] = useState(true);
  const [permiteVideo, setPermiteVideo] = useState(true);
  const [userFilter, setUserFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [projects, setProjects] = useState<ProjectOpt[]>([]);
  const [clientPick, setClientPick] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadMeta = useCallback(async () => {
    const [uRes, cRes, pRes] = await Promise.all([
      fetch("/api/users"),
      fetch("/api/clients"),
      fetch("/api/projects"),
    ]);
    if (uRes.ok) {
      const data = await uRes.json();
      setUsers(Array.isArray(data) ? data.map((x: { id: string; nombre: string }) => ({ id: x.id, nombre: x.nombre })) : []);
    }
    if (cRes.ok) {
      const data = await cRes.json();
      setClients(Array.isArray(data) ? data.map((x: { id: string; nombre: string }) => ({ id: x.id, nombre: x.nombre })) : []);
    }
    if (pRes.ok) {
      const data = await pRes.json();
      setProjects(Array.isArray(data) ? data.map((x: { id: string; nombre: string }) => ({ id: x.id, nombre: x.nombre })) : []);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadMeta();
    setError("");
  }, [open, loadMeta]);

  const filteredUsers = useMemo(() => {
    const q = userFilter.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.nombre.toLowerCase().includes(q));
  }, [users, userFilter]);

  function toggleUser(id: string) {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function addClientTeam() {
    if (!clientPick) return;
    const res = await fetch(`/api/comunicaciones/client-users?clientId=${encodeURIComponent(clientPick)}`);
    if (!res.ok) return;
    const data = await res.json();
    const list = (data.users ?? []) as UserOpt[];
    setSelectedIds((prev) => {
      const n = new Set(prev);
      for (const u of list) n.add(u.id);
      return n;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/comunicaciones/canales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          tema: tema.trim() || null,
          descripcion: descripcion.trim() || null,
          proyectoId: proyectoId || null,
          usuarioIds: [...selectedIds],
          permiteTexto,
          permiteVoz,
          permiteArchivos,
          permiteVideo,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((j as { error?: string }).error || "Error al crear");
        return;
      }
      setNombre("");
      setTema("");
      setDescripcion("");
      setProyectoId("");
      setSelectedIds(new Set());
      onCreated();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">Nuevo canal</h2>
          <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Información básica</h3>
            <label className="block text-xs font-medium text-muted-foreground">
              Nombre del canal *
              <input required className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Tema / asunto
              <input className={inputClass} value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Asunto o línea de tema" />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Descripción (opcional)
              <textarea className={`${inputClass} min-h-[72px]`} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </label>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Asociación</h3>
            <label className="block text-xs font-medium text-muted-foreground">
              Vincular a un proyecto
              <select className={`${inputClass} cursor-pointer`} value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}>
                <option value="">— Sin vincular —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Miembros</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Añade personas por buscador o incorpora de golpe todos los usuarios vinculados a un cliente (empresa).
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <select
                className={`${inputClass} max-w-xs flex-1 cursor-pointer`}
                value={clientPick}
                onChange={(e) => setClientPick(e.target.value)}
              >
                <option value="">Cliente (empresa)…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <button type="button" className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted" onClick={addClientTeam}>
                Añadir equipo del cliente
              </button>
            </div>
            <input
              className={`${inputClass} mt-3`}
              placeholder="Buscar usuario para añadir…"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/60 p-2">
              {filteredUsers.map((u) => (
                <label key={u.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50">
                  <input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => toggleUser(u.id)} />
                  <span>{u.nombre}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">El administrador actual se añade siempre al crear el canal.</p>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Configuración de medios</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs hover:bg-muted/30">
                <input type="checkbox" checked={permiteTexto} onChange={(e) => setPermiteTexto(e.target.checked)} />
                Permitir mensajes de texto
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs hover:bg-muted/30">
                <input type="checkbox" checked={permiteVoz} onChange={(e) => setPermiteVoz(e.target.checked)} />
                Permitir mensajes de voz
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs hover:bg-muted/30">
                <input type="checkbox" checked={permiteArchivos} onChange={(e) => setPermiteArchivos(e.target.checked)} />
                Permitir envío de archivos
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs hover:bg-muted/30">
                <input type="checkbox" checked={permiteVideo} onChange={(e) => setPermiteVideo(e.target.checked)} />
                Permitir videollamada
              </label>
            </div>
          </section>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={busy} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50">
              Crear canal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
