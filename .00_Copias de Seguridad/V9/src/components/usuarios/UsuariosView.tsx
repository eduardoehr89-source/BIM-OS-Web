"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Trash2, UserPlus, Plus, X, Pencil, Building, MessageCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ROL_PROFESIONAL_OPCIONES, labelRolProfesional, storedRolToSelectValue } from "@/lib/professional-roles";
import { sortDirectoryUsers, type DirectorySortKey } from "@/lib/messaging-directory-sort";

type UserRow = {
  id: string;
  nombre: string;
  tipo: "ADMIN" | "USER";
  rol: string;
  permisos?: string;
  canManageFolders?: boolean;
  client?: { nombre: string } | null;
  createdAt: string;
  sharesProjectWithViewer?: boolean;
};

type CompanyRow = {
  id: string;
  nombre: string;
};

const TABS_OPCIONES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "proyectos", label: "Proyectos" },
  { id: "tareas", label: "Tareas" },
  { id: "clientes", label: "Clientes" },
  { id: "docs", label: "Docs" },
  { id: "comunicaciones", label: "Comunicaciones" },
  { id: "usuarios", label: "Usuarios" },
  { id: "auditoria", label: "Auditoría" },
];

function SortTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 text-left text-xs font-medium uppercase tracking-wider transition hover:text-foreground ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
        {active ? <span className="tabular-nums opacity-70">{dir === "asc" ? "↑" : "↓"}</span> : null}
      </button>
    </th>
  );
}

export function UsuariosView() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [tipo, setTipo] = useState<"ADMIN" | "USER">("USER");
  const [rolProfesional, setRolProfesional] = useState<string>(ROL_PROFESIONAL_OPCIONES[0].value);
  const [companyId, setCompanyId] = useState<string>("");
  const [newCompanyName, setNewCompanyName] = useState<string>("");
  const [permisos, setPermisos] = useState<string[]>(["dashboard"]);
  const [canManageFolders, setCanManageFolders] = useState(false);

  const [busy, setBusy] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [editing, setEditing] = useState<{
    id: string;
    nombre: string;
    tipo: "ADMIN" | "USER";
    rol: string;
    pin: string;
    companyId: string;
    newCompanyName: string;
    permisos: string[];
    canManageFolders: boolean;
  } | null>(null);
  const [editPinOpen, setEditPinOpen] = useState(false);

  const [sortKey, setSortKey] = useState<DirectorySortKey>("nombre");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openingDm, setOpeningDm] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) setCompanies(await res.json());
    } catch (e) {
      console.log(e);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
        setErrorMsg("");
      } else {
        const data = await res.json().catch(() => ({}));
        setUsers([]);
        setErrorMsg((data as { error?: string }).error || `No se pudo cargar la tabla (${res.status})`);
      }
    } catch (e) {
      console.log("[UsuariosView] loadUsers", e);
      setUsers([]);
      setErrorMsg("Error de red al cargar usuarios");
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadUsers(), loadCompanies()]);
    setLoading(false);
  }, [loadUsers, loadCompanies]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadData();
    });
  }, [loadData]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !pin.trim() || !adminPin.trim()) return;
    if (!companyId && !newCompanyName.trim()) {
      setErrorMsg("Debe seleccionar o crear una Empresa/Cliente");
      return;
    }

    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          pin: pin.trim(),
          tipo,
          rol: rolProfesional,
          adminPin: adminPin.trim(),
          companyId: companyId === "NEW" ? undefined : companyId,
          newCompanyName: companyId === "NEW" ? newCompanyName.trim() : undefined,
          permisos: permisos.join(","),
          canManageFolders: tipo === "ADMIN" || canManageFolders,
        }),
      });
      if (res.ok) {
        setNombre("");
        setPin("");
        setAdminPin("");
        setTipo("USER");
        setRolProfesional(ROL_PROFESIONAL_OPCIONES[0].value);
        setCompanyId("");
        setNewCompanyName("");
        setPermisos(["dashboard"]);
        setCanManageFolders(false);
        setShowCreateForm(false);
        await loadData();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Error al registrar");
      }
    } finally {
      setBusy(false);
    }
  }

  function startEdit(u: UserRow) {
    setShowCreateForm(false);
    setErrorMsg("");
    let cId = "";
    if (u.client) {
      const found = companies.find((c) => c.nombre === u.client?.nombre);
      if (found) cId = found.id;
    }

    setEditing({
      id: u.id,
      nombre: u.nombre,
      tipo: u.tipo,
      rol: storedRolToSelectValue(u.rol),
      pin: "",
      companyId: cId,
      newCompanyName: "",
      permisos: u.permisos ? u.permisos.split(",").map((s) => s.trim()) : ["dashboard"],
      canManageFolders: u.canManageFolders ?? false,
    });
  }

  function submitEditForm(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.companyId && !editing.newCompanyName.trim()) {
      setErrorMsg("Debe seleccionar o crear una Empresa/Cliente");
      return;
    }
    setEditPinOpen(true);
  }

  async function confirmEditWithPin(adminPinConfirm?: string) {
    if (!editing || !adminPinConfirm?.trim()) return;
    setBusy(true);
    setErrorMsg("");
    try {
      const body: Record<string, string | boolean> = {
        id: editing.id,
        nombre: editing.nombre.trim(),
        tipo: editing.tipo,
        rol: editing.rol,
        adminPin: adminPinConfirm.trim(),
        permisos: editing.permisos.join(","),
        canManageFolders: editing.tipo === "ADMIN" || editing.canManageFolders,
      };
      if (editing.pin.trim()) {
        body.pin = editing.pin.trim();
      }
      if (editing.companyId !== "NEW" && editing.companyId) {
        body.companyId = editing.companyId;
      } else if (editing.newCompanyName.trim()) {
        body.newCompanyName = editing.newCompanyName.trim();
      }

      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setEditing(null);
        setEditPinOpen(false);
        await loadData();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "No se pudo actualizar el usuario");
        setEditPinOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }

  function toggleSort(k: DirectorySortKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  const sortedUsers = useMemo(() => {
    const rows = users.map((u) => ({
      ...u,
      sharesProjectWithViewer: u.sharesProjectWithViewer ?? false,
    }));
    return sortDirectoryUsers(rows, sortKey, sortDir);
  }, [users, sortKey, sortDir]);

  async function openDirectMessage(peerId: string) {
    setOpeningDm(peerId);
    try {
      const res = await fetch("/api/comunicaciones/direct", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerUserId: peerId }),
      });
      const j = (await res.json().catch(() => ({}))) as { canalId?: string; error?: string };
      if (res.ok && j.canalId) {
        router.push(`/comunicaciones/${j.canalId}`);
      } else {
        setErrorMsg(j.error || "No se pudo abrir el chat privado");
      }
    } finally {
      setOpeningDm(null);
    }
  }

  async function handleDelete(pin?: string) {
    if (!deleteId || !pin) return;
    try {
      const res = await fetch(`/api/users?id=${deleteId}&adminPin=${encodeURIComponent(pin)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteId(null);
        await loadData();
      } else {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || "No se pudo eliminar el usuario");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Error de conexión");
    }
  }

  const inputClass =
    "mt-1 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-0";

  const rolSelect = (
    <select
      className={`${inputClass} cursor-pointer`}
      value={rolProfesional}
      onChange={(e) => setRolProfesional(e.target.value)}
    >
      {ROL_PROFESIONAL_OPCIONES.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

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
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditing(null);
            }}
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
        <section className="rounded-2xl border border-border/40 bg-muted/10 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            Nuevo Usuario
          </h2>
          <form onSubmit={handleCreate} className="mt-5 grid grid-cols-1 items-end gap-4 lg:grid-cols-6">
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
              Tipo
              <select
                className={`${inputClass} cursor-pointer`}
                value={tipo}
                onChange={(e) => {
                  const v = e.target.value as "ADMIN" | "USER";
                  setTipo(v);
                  if (v === "ADMIN") setCanManageFolders(false);
                }}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Rol (Cargo)
              {rolSelect}
            </label>
            <div className="block lg:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Empresa/Cliente (Obligatorio)
                <select
                  required
                  className={`${inputClass} cursor-pointer`}
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                >
                  <option value="" disabled>-- Selecciona una empresa --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                  <option value="NEW" className="font-bold text-accent">+ Crear nueva empresa</option>
                </select>
              </label>
              {companyId === "NEW" && (
                <input
                  required
                  autoFocus
                  className={`${inputClass} mt-2`}
                  placeholder="Nombre de la nueva empresa"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                />
              )}
            </div>

            <div className="block lg:col-span-6 mt-2 border-t border-border/40 pt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-3">
                Visibilidad de Pestañas
              </label>
              <div className="flex flex-wrap gap-4">
                {TABS_OPCIONES.map((t) => (
                  <label key={t.id} className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permisos.includes(t.id)}
                      onChange={(e) => {
                        if (e.target.checked) setPermisos([...permisos, t.id]);
                        else setPermisos(permisos.filter((p) => p !== t.id));
                      }}
                      className="accent-accent"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="block lg:col-span-6 mt-2 border-t border-border/40 pt-4">
              <label
                className={`flex flex-wrap items-center gap-3 text-sm ${tipo === "ADMIN" ? "cursor-default" : "cursor-pointer"}`}
              >
                <input
                  type="checkbox"
                  className="accent-accent h-4 w-4 shrink-0 rounded border-border"
                  disabled={tipo === "ADMIN"}
                  checked={tipo === "ADMIN" || canManageFolders}
                  onChange={(e) => setCanManageFolders(e.target.checked)}
                />
                <span className="font-medium text-foreground">Permitir gestionar carpetas (Crear/Eliminar)</span>
              </label>
              {tipo === "ADMIN" ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Los usuarios ADMIN tienen este permiso de forma implícita en Adjuntos.
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Permite crear y eliminar subcarpetas dentro de los contenedores ISO en proyectos.
                </p>
              )}
            </div>

            <div className="block lg:col-span-6 border-t border-border/40 pt-4 mt-2">
              <label className="block text-xs font-medium text-muted-foreground max-w-xs">
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
            </div>
            
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50 lg:justify-self-start"
            >
              Registrar
            </button>
          </form>
        </section>
      )}

      {editing && (
        <section className="rounded-2xl border border-border/40 bg-muted/10 p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">Editar usuario</h2>
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setEditing(null)}
              aria-label="Cerrar edición"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
          <form onSubmit={submitEditForm} className="mt-5 grid grid-cols-1 items-end gap-4 lg:grid-cols-6">
            <label className="block text-xs font-medium text-muted-foreground">
              Nombre
              <input
                required
                className={inputClass}
                value={editing.nombre}
                onChange={(e) => setEditing((s) => (s ? { ...s, nombre: e.target.value } : s))}
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Nuevo PIN (opcional)
              <input
                type="password"
                inputMode="numeric"
                className={inputClass}
                value={editing.pin}
                onChange={(e) => setEditing((s) => (s ? { ...s, pin: e.target.value } : s))}
                placeholder="Dejar vacío para no cambiar"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Tipo
              <select
                className={`${inputClass} cursor-pointer`}
                value={editing.tipo}
                onChange={(e) => {
                  const v = e.target.value as "ADMIN" | "USER";
                  setEditing((s) =>
                    s
                      ? {
                          ...s,
                          tipo: v,
                          canManageFolders: v === "ADMIN" ? false : s.canManageFolders,
                        }
                      : s,
                  );
                }}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Rol (Cargo)
              <select
                className={`${inputClass} cursor-pointer`}
                value={editing.rol}
                onChange={(e) => setEditing((s) => (s ? { ...s, rol: e.target.value } : s))}
              >
                {ROL_PROFESIONAL_OPCIONES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="block lg:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Empresa/Cliente (Obligatorio)
                <select
                  required
                  className={`${inputClass} cursor-pointer`}
                  value={editing.companyId}
                  onChange={(e) => setEditing((s) => (s ? { ...s, companyId: e.target.value } : s))}
                >
                  <option value="" disabled>-- Selecciona una empresa --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                  <option value="NEW" className="font-bold text-accent">+ Crear nueva empresa</option>
                </select>
              </label>
              {editing.companyId === "NEW" && (
                <input
                  required
                  autoFocus
                  className={`${inputClass} mt-2`}
                  placeholder="Nombre de la nueva empresa"
                  value={editing.newCompanyName}
                  onChange={(e) => setEditing((s) => (s ? { ...s, newCompanyName: e.target.value } : s))}
                />
              )}
            </div>

            <div className="block lg:col-span-6 mt-2 border-t border-border/40 pt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-3">
                Visibilidad de Pestañas
              </label>
              <div className="flex flex-wrap gap-4">
                {TABS_OPCIONES.map((t) => (
                  <label key={t.id} className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.permisos.includes(t.id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setEditing((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            permisos: isChecked
                              ? [...prev.permisos, t.id]
                              : prev.permisos.filter((p) => p !== t.id),
                          };
                        });
                      }}
                      className="accent-accent"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="block lg:col-span-6 mt-2 border-t border-border/40 pt-4">
              <label
                className={`flex flex-wrap items-center gap-3 text-sm ${
                  editing.tipo === "ADMIN" ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-accent h-4 w-4 shrink-0 rounded border-border"
                  disabled={editing.tipo === "ADMIN"}
                  checked={editing.tipo === "ADMIN" || editing.canManageFolders}
                  onChange={(e) =>
                    setEditing((s) => (s ? { ...s, canManageFolders: e.target.checked } : s))
                  }
                />
                <span className="font-medium text-foreground">Permitir gestionar carpetas (Crear/Eliminar)</span>
              </label>
              {editing.tipo === "ADMIN" ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Los usuarios ADMIN tienen este permiso de forma implícita en Adjuntos.
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Permite crear y eliminar subcarpetas dentro de los contenedores ISO en proyectos.
                </p>
              )}
            </div>

            <div className="lg:col-span-6 flex flex-wrap gap-2 mt-4">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-foreground">Usuarios Registrados</h2>
        <div className="mt-4 overflow-x-auto overflow-hidden rounded-xl border border-border/60 bg-background">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                <SortTh label="Nombre" active={sortKey === "nombre"} dir={sortDir} onClick={() => toggleSort("nombre")} />
                <SortTh label="Empresa" active={sortKey === "cliente"} dir={sortDir} onClick={() => toggleSort("cliente")} />
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tipo</th>
                <SortTh label="Rol" active={sortKey === "rol"} dir={sortDir} onClick={() => toggleSort("rol")} />
                <SortTh
                  label="Proyecto común"
                  active={sortKey === "proyectoComun"}
                  dir={sortDir}
                  onClick={() => toggleSort("proyectoComun")}
                />
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Carpetas ISO
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    No hay usuarios.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{u.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3 w-3 text-muted-foreground/70" />
                        <span>{u.client?.nombre || "Sin asignar"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] tracking-wide text-foreground">{u.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] tracking-wide text-foreground">
                        {labelRolProfesional(u.rol)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                          u.sharesProjectWithViewer
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {u.sharesProjectWithViewer ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                          u.tipo === "ADMIN" || u.canManageFolders
                            ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {u.tipo === "ADMIN" || u.canManageFolders ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="mr-1 inline-flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-500/20 disabled:opacity-50 dark:text-sky-300"
                        title={`Mensaje privado a ${u.nombre}`}
                        disabled={openingDm === u.id}
                        onClick={() => void openDirectMessage(u.id)}
                      >
                        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Mensaje privado
                      </button>
                      <button
                        type="button"
                        className="mr-1 rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        title="Editar"
                        aria-label={`Editar ${u.nombre}`}
                        onClick={() => startEdit(u)}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        title="Eliminar usuario"
                        onClick={() => setDeleteId(u.id)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
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
        requirePin={true}
        onCancel={() => setDeleteId(null)}
        onConfirm={(pin) => void handleDelete(pin)}
      />

      <ConfirmDialog
        open={editPinOpen}
        title="Confirmar cambios"
        message="Introduce tu PIN de administrador para guardar los cambios en este usuario."
        confirmLabel="Guardar"
        confirmVariant="default"
        requirePin={true}
        onCancel={() => setEditPinOpen(false)}
        onConfirm={(pin) => void confirmEditWithPin(pin)}
      />
    </div>
  );
}
