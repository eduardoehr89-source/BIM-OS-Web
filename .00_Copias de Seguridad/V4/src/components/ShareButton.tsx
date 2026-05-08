"use client";

import { useState, useEffect } from "react";
import { Share2, Users } from "lucide-react";

type UserOpt = { id: string; nombre: string; tipo?: string; rol?: string };

export function ShareButton({
  resourceType,
  resourceId,
}: {
  resourceType: "PROJECT" | "CLIENT" | "TASK";
  resourceId: string;
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (open && users.length === 0) {
      // Usar un endpoint público (o el mismo de usuarios pero permitiendo acceso a USER)
      // Como el GET /api/users está bloqueado solo para ADMIN, 
      // voy a modificarlo o crearé un endpoint pequeño en este componente (o asumimos que existe).
      // Crearemos /api/users/list para que cualquier usuario vea los nombres de los demas.
      fetch("/api/users/list")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setUsers(data);
        });
    }
  }, [open, users.length]);

  async function handleShare(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser,
          resourceType,
          resourceId,
        }),
      });
      if (res.ok) {
        setMsg("Invitación enviada.");
        setTimeout(() => setOpen(false), 1500);
      } else {
        const d = await res.json();
        setMsg(d.error || "Error al invitar.");
      }
    } catch (error) {
      setMsg("Error interno.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
      >
        <Share2 className="h-3.5 w-3.5" />
        Compartir
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-border/60 bg-background p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
          <form onSubmit={handleShare} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Invitar Colaborador
            </h3>
            <select
              required
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="" disabled>Seleccione un usuario...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Enviando..." : "Enviar Invitación"}
            </button>
            {msg && <p className="text-center text-[10px] text-muted-foreground">{msg}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
