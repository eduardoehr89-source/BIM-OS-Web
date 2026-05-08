"use client";

import { FilterX, Trash2, UserPlus, Users, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useVoiceCommands } from "@/context/VoiceCommandsProvider";
import { ConfirmDialog, CONFIRM_DELETE_MESSAGE } from "@/components/ui/ConfirmDialog";
import { ShareButton } from "@/components/ShareButton";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";
import { labelProjectStatus } from "@/lib/project-status";

type ClientItem = {
  id: string;
  nombre: string;
  activo: boolean;
  _count?: { projects: number };
};

type ClientDetail = ClientItem & {
  projects: Array<{
    id: string;
    nombre: string;
    ubicacion: string;
    ano: number;
    tipologia: string;
    estatus: string;
    files: Array<{ id: string; originalName: string }>;
  }>;
};

const field =
  "mt-1.5 w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0";

export function ClientesView({ userRole }: { userRole?: string }) {
  const { searchQuery, setSearchQuery } = useVoiceCommands();
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

  const loadListSeqRef = useRef(0);

  const loadList = useCallback(async () => {
    const seq = ++loadListSeqRef.current;
    setError(null);
    try {
      const res = await fetch("/api/clients?activo=true");
      if (!res.ok) throw new Error("No se pudieron cargar clientes");
      const data = (await res.json()) as ClientItem[];
      if (seq !== loadListSeqRef.current) return;
      setList(data);
      setSelectedId((prev) => {
        if (prev && data.some((c) => c.id === prev)) return prev;
        return data[0]?.id ?? null;
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
        return res.json() as Promise<ClientDetail>;
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
    if (!detail?.projects) return [];
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

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    const nombre = newName.trim();
    if (!nombre) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, activo: true }),
      });
      if (!res.ok) throw new Error("No se pudo crear");
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
          >
            {showCreateForm ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Plus className="h-4 w-4" strokeWidth={1.75} />}
            {showCreateForm ? "CANCELAR" : "NUEVO CLIENTE"}
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {showCreateForm && (
        <section className="rounded-2xl bg-muted/10 p-6 border border-border/40 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              Nuevo Cliente
            </h2>
            <button
              type="button"
              className="p-1 text-muted-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={createClient} className="flex flex-wrap items-end gap-4">
            <label className="min-w-[200px] flex-1 text-xs font-medium text-muted-foreground">
              Nombre
              <input className={field} placeholder="Ej. Arquitectura S.A." value={newName} onChange={(e) => setNewName(e.target.value)} />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              {creating ? "Guardando" : "Guardar"}
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
                    <button
                      type="button"
                      title="Eliminar cliente"
                      className="shrink-0 border-l border-border/40 px-3 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteClientTarget(c);
                      }}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </button>
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
              visibleProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {detail.projects.length === 0 ? "Este cliente no tiene proyectos." : "Ningún proyecto coincide con la búsqueda."}
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
                          <td className="py-3 font-medium text-foreground">{p.nombre}</td>
                          <td className="max-w-[160px] truncate py-3 text-muted-foreground">{p.ubicacion}</td>
                          <td className="py-3 tabular-nums text-muted-foreground">{p.ano}</td>
                          <td className="max-w-[120px] truncate py-3 text-muted-foreground">{p.tipologia}</td>
                          <td className="py-3 text-foreground">{labelProjectStatus(p.estatus)}</td>
                          <td className="py-3">
                            <ul className="space-y-1">
                              {p.files.map((f) => (
                                <li key={f.id}>
                                  <a href={`/api/files/${f.id}/download`} className="text-xs font-medium text-accent underline-offset-4 hover:underline">
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
              )
            ) : (
              <p className="text-sm text-muted-foreground">Sin datos.</p>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={deleteClientTarget !== null}
        title="Eliminar cliente"
        message={CONFIRM_DELETE_MESSAGE}
        requirePin={true}
        onCancel={() => setDeleteClientTarget(null)}
        onConfirm={(pin) => void executeDeleteClient(pin)}
      />
    </div>
  );
}
