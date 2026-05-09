"use client";

import { FilterX, Trash2, UserPlus, Users, Plus, X, Pencil } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useVoiceCommands } from "@/context/VoiceCommandsProvider";
import { ConfirmDialog, CONFIRM_DELETE_MESSAGE } from "@/components/ui/ConfirmDialog";
import { ShareButton } from "@/components/ShareButton";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";
import { labelProjectStatus } from "@/lib/project-status";
import { TECHNICAL_UPLOAD_ACCEPT } from "@/lib/technical-upload-constants";

type ClientItem = {
  id: string;
  nombre: string;
  activo: boolean;
  _count?: { projects: number };
};

type ClientDetail = ClientItem & {
  oirFile?: { id: string; originalName: string } | null;
  airFile?: { id: string; originalName: string } | null;
  eirFile?: { id: string; originalName: string } | null;
  projects: Array<{
    id: string;
    nombre: string;
    ubicacion: string;
    ano: number;
    tipologia: string;
    estatus: string;
    bepFileId?: string | null;
    files: Array<{ id: string; originalName: string }>;
  }>;
};

const field =
  "mt-1.5 w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0";

export function ClientesView({ userRole }: { userRole?: string }) {
  const { searchQuery, setSearchQuery } = useVoiceCommands();
  const canManageClients = userRole === "ADMIN";
  const [list, setList] = useState<ClientItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailRefreshNonce, setDetailRefreshNonce] = useState(0);

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteClientTarget, setDeleteClientTarget] = useState<ClientItem | null>(null);

  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editPinOpen, setEditPinOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isoPinOpen, setIsoPinOpen] = useState(false);
  const [isoBusy, setIsoBusy] = useState(false);
  const [isoDraft, setIsoDraft] = useState<{ oir: File | null; air: File | null; eir: File | null }>({
    oir: null,
    air: null,
    eir: null,
  });

  const loadListSeqRef = useRef(0);

  useEffect(() => {
    if (!canManageClients && showCreateForm) setShowCreateForm(false);
  }, [canManageClients, showCreateForm]);

  const loadList = useCallback(async () => {
    const seq = ++loadListSeqRef.current;
    setError(null);
    try {
      const res = await fetch("/api/clients?activo=true");
      if (!res.ok) throw new Error("No se pudieron cargar clientes");
      const data = (await res.json()) as unknown;
      if (!Array.isArray(data)) throw new Error("Respuesta de clientes inválida");
      const rows = data as ClientItem[];
      if (seq !== loadListSeqRef.current) return;
      setList(rows);
      setSelectedId((prev) => {
        if (prev && rows.some((c) => c.id === prev)) return prev;
        return rows[0]?.id ?? null;
      });
    } catch (e) {
      if (seq !== loadListSeqRef.current) return;
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      if (seq === loadListSeqRef.current) setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadList();
    });
    return () => {
      cancelled = true;
    };
  }, [loadList]);

  useEffect(() => {
    return subscribeDataRefresh(() => {
      void loadList();
      setDetailRefreshNonce((n) => n + 1);
    });
  }, [loadList]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.nombre.toLowerCase().includes(q));
  }, [list, searchQuery]);

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;
    const id = selectedId;

    const pendingUi = Promise.resolve().then(() => {
      if (cancelled) return;
      setLoadingDetail(true);
      setDetail(null);
      setDetailError(null);
    });

    fetch(`/api/clients/${id}`)
      .then(async (res) => {
        await pendingUi;
        if (!res.ok) throw new Error("No se pudo cargar el detalle del cliente.");
        const raw: unknown = await res.json();
        if (!raw || typeof raw !== "object" || !("id" in raw) || typeof (raw as { id: unknown }).id !== "string") {
          throw new Error("Respuesta de detalle inválida");
        }
        return raw as ClientDetail;
      })
      .then((d) => {
        if (cancelled || d.id !== id) return;
        setDetail(d);
      })
      .catch((e) => {
        if (!cancelled) setDetailError(e instanceof Error ? e.message : "Error");
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, detailRefreshNonce]);

  const visibleProjects = useMemo(() => {
    if (!detail?.projects || !Array.isArray(detail.projects)) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return detail.projects;
    return detail.projects.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.ubicacion.toLowerCase().includes(q) ||
        p.tipologia.toLowerCase().includes(q) ||
        p.files.some((f) => f.originalName.toLowerCase().includes(q)),
    );
  }, [detail, searchQuery]);

  async function createClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nombre = newName.trim();
    if (!nombre) return;
    const form = e.currentTarget;
    const oir = form.querySelector<HTMLInputElement>('input[name="oir"]')?.files?.[0];
    const air = form.querySelector<HTMLInputElement>('input[name="air"]')?.files?.[0];
    const eir = form.querySelector<HTMLInputElement>('input[name="eir"]')?.files?.[0];
    if (!oir?.size || !air?.size || !eir?.size) {
      setError("OIR, AIR y EIR son obligatorios (PDF o Word).");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("nombre", nombre);
      fd.append("oir", oir);
      fd.append("air", air);
      fd.append("eir", eir);
      const res = await fetch("/api/clients", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "No se pudo crear");
      }
      const created = (await res.json()) as ClientItem;
      setNewName("");
      setShowCreateForm(false);
      await loadList();
      setSelectedId(created.id);
      notifyDataRefresh({ reason: "clients" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setCreating(false);
    }
  }

  async function executeIsoReplace(pin?: string) {
    if (!detail || !pin) return;
    const uploads: { role: "oir" | "air" | "eir"; file: File }[] = [];
    if (isoDraft.oir) uploads.push({ role: "oir", file: isoDraft.oir });
    if (isoDraft.air) uploads.push({ role: "air", file: isoDraft.air });
    if (isoDraft.eir) uploads.push({ role: "eir", file: isoDraft.eir });
    if (uploads.length === 0) {
      setIsoPinOpen(false);
      return;
    }
    setIsoBusy(true);
    setError(null);
    try {
      for (const u of uploads) {
        const fd = new FormData();
        fd.append("adminPin", pin);
        fd.append("role", u.role);
        fd.append("file", u.file);
        const res = await fetch(`/api/clients/${detail.id}/iso-doc`, { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "Error al subir documento ISO");
        }
      }
      setIsoDraft({ oir: null, air: null, eir: null });
      setIsoPinOpen(false);
      setDetailRefreshNonce((n) => n + 1);
      notifyDataRefresh({ reason: "clients" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsoBusy(false);
    }
  }

  async function executeDeleteClient(pin?: string) {
    if (!deleteClientTarget || !pin) return;
    const id = deleteClientTarget.id;
    setError(null);
    try {
      const res = await fetch(`/api/clients/${id}?adminPin=${encodeURIComponent(pin)}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "No se pudo eliminar el cliente");
      }
      setDeleteClientTarget(null);
      if (selectedId === id) setSelectedId(null);
      await loadList();
      notifyDataRefresh({ reason: "clients" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setDeleteClientTarget(null);
    }
  }

  async function executeEditClient(pin?: string) {
    if (!editingClient || !pin || !editName.trim()) return;
    const id = editingClient.id;
    setSavingEdit(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: editName.trim(), adminPin: pin }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "No se pudo actualizar el cliente");
      }
      setEditingClient(null);
      setEditPinOpen(false);
      await loadList();
      notifyDataRefresh({ reason: "clients" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setEditPinOpen(false);
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
          <Users className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Clientes</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Vista maestro-detalle: al elegir un cliente se cargan sus proyectos. La voz puede filtrar por nombre o refinar la tabla con buscar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {searchQuery.trim() && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <FilterX className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Limpiar búsqueda
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={!canManageClients}
            title={!canManageClients ? "Solo administradores pueden crear empresas" : undefined}
          >
            {showCreateForm ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Plus className="h-4 w-4" strokeWidth={1.75} />}
            {showCreateForm ? "CANCELAR" : "NUEVO CLIENTE"}
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {showCreateForm && canManageClients && (
        <section className="rounded-2xl bg-muted/10 p-6 border border-border/40 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              Nuevo cliente (ISO 19650)
            </h2>
            <button
              type="button"
              className="p-1 text-muted-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={createClient} className="space-y-4">
            <label className="block text-xs font-medium text-muted-foreground">
              Nombre de la empresa
              <input
                className={field}
                placeholder="Ej. Arquitectura S.A."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-xs font-medium text-muted-foreground">
                OIR (PDF/Word) *
                <input name="oir" type="file" accept={TECHNICAL_UPLOAD_ACCEPT} required className="mt-1 block w-full text-xs text-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1" />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                AIR (PDF/Word) *
                <input name="air" type="file" accept={TECHNICAL_UPLOAD_ACCEPT} required className="mt-1 block w-full text-xs text-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1" />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                EIR (PDF/Word) *
                <input name="eir" type="file" accept={TECHNICAL_UPLOAD_ACCEPT} required className="mt-1 block w-full text-xs text-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1" />
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Perfil normativo: los tres documentos son obligatorios. Solo administradores pueden registrar empresas nuevas.
            </p>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              {creating ? "Guardando" : "Registrar empresa"}
            </button>
          </form>
        </section>
      )}

      {editingClient && (
        <section className="rounded-2xl bg-muted/10 p-6 border border-border/40 max-w-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Editar Cliente
            </h2>
            <button
              type="button"
              className="p-1 text-muted-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setEditingClient(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editName.trim()) setEditPinOpen(true);
            }}
            className="flex flex-wrap items-end gap-4"
          >
            <label className="min-w-[200px] flex-1 text-xs font-medium text-muted-foreground">
              Nombre
              <input required className={field} value={editName} onChange={(e) => setEditName(e.target.value)} />
            </label>
            <button
              type="submit"
              disabled={savingEdit}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              {savingEdit ? "Guardando" : "Guardar cambios"}
            </button>
          </form>
        </section>
      )}

      <div className="grid min-h-[420px] gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-foreground">Activos</h2>
            <span className="text-xs tabular-nums text-muted-foreground">{filteredList.length}</span>
          </div>
          <ul className="max-h-[480px] divide-y divide-border/50 overflow-y-auto rounded-2xl bg-muted/40 dark:bg-muted/20">
            {loadingList ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">Cargando</li>
            ) : filteredList.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">Sin clientes.</li>
            ) : (
              filteredList.map((c) => (
                <li key={c.id} className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 px-4 py-3.5 text-left text-sm transition ${
                      selectedId === c.id ? "bg-background/80 dark:bg-background/25" : "hover:bg-background/40 dark:hover:bg-background/10"
                    }`}
                  >
                    <span className="font-medium text-foreground">{c.nombre}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {c._count?.projects ?? 0} proyecto{(c._count?.projects ?? 0) === 1 ? "" : "s"}
                    </span>
                  </button>
                  {userRole === "ADMIN" && (
                    <div className="flex shrink-0 border-l border-border/40">
                      <button
                        type="button"
                        title="Editar cliente"
                        className="px-3 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingClient(c);
                          setEditName(c.nombre);
                        }}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </button>
                      <button
                        type="button"
                        title="Eliminar cliente"
                        className="border-l border-border/40 px-3 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteClientTarget(c);
                        }}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </button>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </aside>

        <section className="lg:col-span-8">
          <div className="mb-4 px-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Proyectos del cliente</h2>
              {detail && detail.id === selectedId && !loadingDetail && !detailError && (
                <ShareButton resourceType="CLIENT" resourceId={detail.id} />
              )}
            </div>
            {detail && detail.id === selectedId && !loadingDetail && !detailError && (
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{detail.nombre}</span>
                {searchQuery.trim() && (
                  <span className="ml-2 text-xs tabular-nums text-muted-foreground">
                    ({visibleProjects.length} coincidencia
                    {visibleProjects.length === 1 ? "" : "s"})
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-muted/40 px-5 py-6 dark:bg-muted/20">
            {!selectedId ? (
              <p className="text-sm text-muted-foreground">Selecciona un cliente.</p>
            ) : loadingDetail ? (
              <p className="text-sm text-muted-foreground">Cargando proyectos</p>
            ) : detailError ? (
              <p className="text-sm text-destructive">{detailError}</p>
            ) : detail && detail.id === selectedId ? (
              <>
                {canManageClients ? (
                  <div className="mb-6 rounded-xl border border-border/50 bg-background/40 p-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Requisitos de información (OIR · AIR · EIR)
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      PDF o Word. Sustituye los que necesites y confirma con tu PIN de administrador.
                    </p>
                    <div className="mt-4 space-y-2">
                      {(
                        [
                          ["OIR", "oir", detail.oirFile] as const,
                          ["AIR", "air", detail.airFile] as const,
                          ["EIR", "eir", detail.eirFile] as const,
                        ] as const
                      ).map(([label, role, meta]) => (
                        <div
                          key={role}
                          className="flex flex-wrap items-center gap-3 border-b border-border/30 py-2 last:border-0"
                        >
                          <span className="w-10 text-xs font-semibold text-foreground">{label}</span>
                          {meta ? (
                            <a
                              href={`/api/files/${meta.id}/download`}
                              className="max-w-[200px] truncate text-xs font-medium text-accent underline-offset-4 hover:underline"
                            >
                              {meta.originalName}
                            </a>
                          ) : (
                            <span className="text-xs text-amber-600 dark:text-amber-500">Pendiente</span>
                          )}
                          <input
                            type="file"
                            accept={TECHNICAL_UPLOAD_ACCEPT}
                            className="max-w-[200px] text-[10px] text-foreground file:mr-1 file:rounded file:border-0 file:bg-muted file:px-2 file:py-0.5"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setIsoDraft((d) => ({ ...d, [role]: f }));
                              e.target.value = "";
                            }}
                          />
                          {isoDraft[role] ? (
                            <span className="text-[10px] text-muted-foreground">→ {isoDraft[role]!.name}</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={isoBusy || (!isoDraft.oir && !isoDraft.air && !isoDraft.eir)}
                      onClick={() => setIsoPinOpen(true)}
                      className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
                    >
                      {isoBusy ? "Subiendo…" : "Guardar documentos ISO"}
                    </button>
                  </div>
                ) : null}
                {visibleProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {detail.projects.length === 0
                      ? "Este cliente no tiene proyectos."
                      : "Ningún proyecto coincide con la búsqueda."}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="border-b border-border/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="pb-3 font-medium">Nombre</th>
                          <th className="pb-3 font-medium">Ubicación</th>
                          <th className="pb-3 font-medium">Año</th>
                          <th className="pb-3 font-medium">Tipología</th>
                          <th className="pb-3 font-medium">Estatus</th>
                          <th className="pb-3 font-medium">Archivos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {visibleProjects.map((p) => (
                          <tr key={p.id} className="align-top">
                            <td className="py-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-foreground">{p.nombre}</span>
                                {!p.bepFileId ? (
                                  <span className="rounded-md bg-orange-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-orange-700 dark:text-orange-400">
                                    Sin BEP
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className="max-w-[160px] truncate py-3 text-muted-foreground">{p.ubicacion}</td>
                            <td className="py-3 tabular-nums text-muted-foreground">{p.ano}</td>
                            <td className="max-w-[120px] truncate py-3 text-muted-foreground">{p.tipologia}</td>
                            <td className="py-3 text-foreground">{labelProjectStatus(p.estatus)}</td>
                            <td className="py-3">
                              <ul className="space-y-1">
                                {p.files.map((f) => (
                                  <li key={f.id}>
                                    <a
                                      href={`/api/files/${f.id}/download`}
                                      className="text-xs font-medium text-accent underline-offset-4 hover:underline"
                                    >
                                      {f.originalName}
                                    </a>
                                  </li>
                                ))}
                                {p.files.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-6 text-xs text-muted-foreground">
                      Alta y edición en{" "}
                      <Link href="/proyectos" className="font-medium text-accent underline-offset-4 hover:underline">
                        Proyectos
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sin datos.</p>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={isoPinOpen}
        title="Documentos ISO"
        message="Introduce tu PIN de administrador para aplicar los reemplazos OIR / AIR / EIR seleccionados."
        confirmLabel="Subir"
        confirmVariant="default"
        requirePin={true}
        onCancel={() => setIsoPinOpen(false)}
        onConfirm={(pin) => void executeIsoReplace(pin)}
      />

      <ConfirmDialog
        open={deleteClientTarget !== null}
        title="Eliminar cliente"
        message={CONFIRM_DELETE_MESSAGE}
        requirePin={true}
        onCancel={() => setDeleteClientTarget(null)}
        onConfirm={(pin) => void executeDeleteClient(pin)}
      />

      <ConfirmDialog
        open={editPinOpen}
        title="Confirmar cambios"
        message="Introduce tu PIN de administrador para guardar los cambios en este cliente."
        confirmLabel="Guardar"
        confirmVariant="default"
        requirePin={true}
        onCancel={() => setEditPinOpen(false)}
        onConfirm={(pin) => void executeEditClient(pin)}
      />
    </div>
  );
}
