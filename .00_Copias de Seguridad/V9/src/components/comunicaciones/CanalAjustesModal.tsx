"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

type Miembro = { id: string; usuarioId: string; usuario: { id: string; nombre: string } };

type CanalDetail = {
  id: string;
  nombre: string;
  tema: string | null;
  descripcion: string | null;
  permiteTexto: boolean;
  permiteVoz: boolean;
  permiteArchivos: boolean;
  permiteVideo: boolean;
  miembros: Miembro[];
};

type UserOpt = { id: string; nombre: string };

type Props = {
  open: boolean;
  canalId: string;
  canal: CanalDetail;
  onClose: () => void;
  onUpdated: () => void;
};

export function CanalAjustesModal({ open, canalId, canal, onClose, onUpdated }: Props) {
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [addId, setAddId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (!res.ok) return;
    const data = await res.json();
    setUsers(Array.isArray(data) ? data.map((u: { id: string; nombre: string }) => ({ id: u.id, nombre: u.nombre })) : []);
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadUsers();
    setErr("");
  }, [open, loadUsers]);

  const memberIds = new Set(canal.miembros.map((m) => m.usuarioId));

  async function addMember() {
    if (!addId) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/comunicaciones/canales/${canalId}/miembros`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ add: [addId], remove: [] }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr((j as { error?: string }).error || "Error");
        return;
      }
      setAddId("");
      onUpdated();
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(userId: string) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/comunicaciones/canales/${canalId}/miembros`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ add: [], remove: [userId] }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr((j as { error?: string }).error || "Error");
        return;
      }
      onUpdated();
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const addOptions = users.filter((u) => !memberIds.has(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ajustes del canal</h2>
          <button type="button" className="rounded-lg p-2 hover:bg-muted" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">Miembros actuales</p>
        <ul className="mt-2 space-y-1">
          {canal.miembros.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm">
              <span>{m.usuario.nombre}</span>
              <button type="button" className="text-xs text-destructive hover:underline" onClick={() => void removeMember(m.usuarioId)} disabled={busy}>
                Expulsar
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-muted-foreground">Añadir miembro</p>
        <div className="mt-2 flex gap-2">
          <select
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={addId}
            onChange={(e) => setAddId(e.target.value)}
          >
            <option value="">— Usuario —</option>
            {addOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
          <button type="button" disabled={!addId || busy} className="rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground disabled:opacity-50" onClick={() => void addMember()}>
            Añadir
          </button>
        </div>

        {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
      </div>
    </div>
  );
}
