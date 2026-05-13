"use client";

import { useCallback, useEffect, useState } from "react";
import { labelRolProfesional, storedRolToSelectValue } from "@/lib/professional-roles";

const ROLES = [
  "ARQUITECTO",
  "BIM MANAGER",
  "COORDINADOR BIM",
  "ESPECIALISTA BIM",
  "GERENTE BIM",
  "INGENIERO ELÉCTRICO",
  "INGENIERO ESTRUCTURAL",
  "INGENIERO MECÁNICO",
  "MODELADOR BIM JR",
  "MODELADOR BIM SR",
] as const;

type UserRow = {
  id: string;
  nombre: string;
  tipo: string;
  rol: string | null;
};

export function UsuariosPageClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [edit, setEdit] = useState<UserRow | null>(null);
  const [tipo, setTipo] = useState<"ADMIN" | "USER">("USER");
  const [rol, setRol] = useState<string>(ROLES[0]);
  const [adminPin, setAdminPin] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "No se pudo cargar");
        setUsers([]);
        return;
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Error de red");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function openEdit(u: UserRow) {
    setEdit(u);
    setTipo(u.tipo === "ADMIN" ? "ADMIN" : "USER");
    setRol(storedRolToSelectValue(u.rol ?? ""));
    setAdminPin("");
    setModalOpen(true);
    setError("");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit || !adminPin.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: edit.id,
          nombre: edit.nombre,
          tipo,
          rol,
          adminPin: adminPin.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Error al guardar");
        return;
      }
      setModalOpen(false);
      setEdit(null);
      await loadUsers();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Usuarios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tipo (permisos) y rol (cargo profesional).</p>
      </header>

      {error && !modalOpen && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay usuarios.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{u.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.tipo}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.rol != null && u.rol !== "" ? labelRolProfesional(u.rol) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1 text-xs hover:bg-muted"
                      onClick={() => openEdit(u)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Editar usuario</h2>
            <p className="mt-1 text-sm text-muted-foreground">{edit.nombre}</p>

            <form onSubmit={saveEdit} className="mt-6 space-y-4">
              <label className="block text-xs font-medium text-muted-foreground">
                Tipo
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as "ADMIN" | "USER")}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-muted-foreground">
                Rol
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-medium text-muted-foreground">
                PIN administrador
                <input
                  type="password"
                  inputMode="numeric"
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  autoComplete="off"
                />
              </label>

              {error && modalOpen && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                  onClick={() => {
                    setModalOpen(false);
                    setEdit(null);
                    setError("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
