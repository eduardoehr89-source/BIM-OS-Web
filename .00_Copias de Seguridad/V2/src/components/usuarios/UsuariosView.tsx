"use client";

import { useState, useEffect } from "react";
import { Users, Trash2, UserPlus, Plus, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type UserRow = {
  id: string;
  nombre: string;
  rol: "ADMIN" | "USER";
  createdAt: string;
};

export function UsuariosView() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [rol, setRol] = useState<"ADMIN" | "USER">("USER");
  const [busy, setBusy] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !pin.trim() || !adminPin.trim()) return;
    
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), pin: pin.trim(), rol, adminPin: adminPin.trim() }),
      });
      if (res.ok) {
        setNombre("");
        setPin("");
        setAdminPin("");
        setRol("USER");
        setShowCreateForm(false);
        await loadUsers();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Error al registrar");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/users?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteId(null);
        await loadUsers();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const inputClass = "mt-1 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-0";

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
              <Users className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Gestión de Usuarios</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Administración de personal autorizado y control de accesos al sistema.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Plus className="h-4 w-4" strokeWidth={1.75} />}
            {showCreateForm ? "CANCELAR" : "NUEVO USUARIO"}
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMsg}</div>
      )}

      {showCreateForm && (
        <section className="rounded-2xl bg-muted/10 p-6 border border-border/40">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            Nuevo Usuario
          </h2>
          <form onSubmit={handleCreate} className="mt-5 grid grid-cols-1 items-end gap-4 sm:grid-cols-5">
            <label className="block text-xs font-medium text-muted-foreground">
              Nombre
              <input
                required
                className={inputClass}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Maria"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Nuevo PIN (Usuario)
              <input
                required
                type="password"
                inputMode="numeric"
                className={inputClass}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Rol
              <select
                className={`${inputClass} cursor-pointer`}
                value={rol}
                onChange={(e) => setRol(e.target.value as "ADMIN" | "USER")}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Tu PIN (Admin)
              <input
                required
                type="password"
                inputMode="numeric"
                className={inputClass}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Confirma tu PIN"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50 sm:justify-self-start"
            >
              Registrar
            </button>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-foreground">Usuarios Registrados</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-background">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No hay usuarios.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{u.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] tracking-wide text-foreground">
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        title="Eliminar usuario"
                        onClick={() => setDeleteId(u.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar a este usuario? Se perderá su acceso al sistema de forma permanente."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
