"use client";

import { Building2, ClipboardList, FilterX, Paperclip, ScrollText, Trash2, Plus, X, Calendar } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProjectTasksSection, type TaskRow } from "@/components/projects/ProjectTasksSection";
import { ProjectTechnicalDocsSection } from "@/components/projects/ProjectTechnicalDocsSection";
import { GanttChart } from "@/components/projects/GanttChart";
import { BimViewer } from "@/components/projects/BimViewer";
import { ShareButton } from "@/components/ShareButton";
import { useVoiceCommands } from "@/context/VoiceCommandsProvider";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";
import { DEFAULT_PROJECT_STATUS, labelProjectStatus, parseProjectStatus, PROJECT_STATUS_OPTIONS, type ProjectStatusCode } from "@/lib/project-status";
import { ConfirmDialog, CONFIRM_DELETE_MESSAGE } from "@/components/ui/ConfirmDialog";

type ClientOpt = { id: string; nombre: string };

type ProjectFileRow = {
  id: string;
  originalName: string;
  size: number;
  technicalDocType?: string | null;
  version: number;
  uploadedAt: string;
};

type ProjectRow = {
  id: string;
  nombre: string;
  ubicacion: string;
  ano: number;
  tipologia: string;
  estatus: ProjectStatusCode;
  clientId: string;
  client: ClientOpt;
  files: ProjectFileRow[];
  tasks: TaskRow[];
};

const field =
  "mt-1.5 w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0";

type WorkspaceTab = "proyecto" | "tareas" | "cronograma" | "docs" | "adjuntos";

type ProjectFormState = {
  nombre: string;
  ubicacion: string;
  clientId: string;
  ano: number;
  tipologia: string;
  estatus: ProjectStatusCode;
};

export function ProjectsView({ userRole }: { userRole?: string }) {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useVoiceCommands();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ifcUrl, setIfcUrl] = useState<string | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("proyecto");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const prevSelectedRef = useRef<string | null>(null);
  const loadSeqRef = useRef(0);

  function selectProject(id: string | null) {
    const prev = prevSelectedRef.current;
    if (id !== null && id !== prev) setWorkspaceTab("proyecto");
    prevSelectedRef.current = id;
    setSelectedId(id);
  }

  const [form, setForm] = useState<ProjectFormState>({
    nombre: "",
    ubicacion: "",
    clientId: "",
    ano: new Date().getFullYear(),
    tipologia: "",
    estatus: DEFAULT_PROJECT_STATUS,
  });

  const [uploadBusy, setUploadBusy] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const seq = ++loadSeqRef.current;
    setError(null);

    const [prOutcome, clOutcome] = await Promise.allSettled([
      fetch("/api/projects").then(async (r) => {
        if (!r.ok) throw new Error("projects");
        return r.json() as Promise<ProjectRow[]>;
      }),
      fetch("/api/clients?activo=true").then(async (r) => {
        if (!r.ok) throw new Error("clients");
        return r.json() as Promise<(ClientOpt & { activo?: boolean })[]>;
      }),
    ]);

    if (seq !== loadSeqRef.current) return;

    const nextProjects = prOutcome.status === "fulfilled" ? prOutcome.value : [];
    const nextClients: ClientOpt[] =
      clOutcome.status === "fulfilled"
        ? clOutcome.value.filter((c) => c.activo !== false).map(({ id, nombre }) => ({ id, nombre }))
        : [];

    setProjects(nextProjects);
    setClients(nextClients);
    setForm((f) => {
      const valid = Boolean(f.clientId && nextClients.some((c) => c.id === f.clientId));
      const clientId = valid ? f.clientId : (nextClients[0]?.id ?? "");
      return { ...f, clientId };
    });

    const projectsFailed = prOutcome.status === "rejected";
    const clientsFailed = clOutcome.status === "rejected";
    if (projectsFailed && clientsFailed) {
      setError("No se pudieron cargar los datos. Comprueba la conexión e intenta de nuevo.");
    } else {
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => {
    return subscribeDataRefresh((detail) => {
      if (detail.reason === "projects") return;
      void load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.estatus !== statusFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const inFiles = p.files.some((f) => f.originalName.toLowerCase().includes(q));
      const inTasks = (p.tasks ?? []).some((t) => t.nombre.toLowerCase().includes(q));
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.ubicacion.toLowerCase().includes(q) ||
        p.tipologia.toLowerCase().includes(q) ||
        p.client.nombre.toLowerCase().includes(q) ||
        String(p.ano).includes(q) ||
        inFiles ||
        inTasks
      );
    });
  }, [projects, statusFilter, searchQuery]);

  const selected = projects.find((p) => p.id === selectedId) ?? null;
  const generalFiles = selected?.files.filter((f) => !f.technicalDocType) ?? [];
  const technicalFiles = selected?.files.filter((f) => f.technicalDocType) ?? [];

  function startCreate() {
    setEditingId(null);
    selectProject(null);
    setShowCreateForm(true);
    setForm({
      nombre: "",
      ubicacion: "",
      clientId: clients[0]?.id ?? "",
      ano: new Date().getFullYear(),
      tipologia: "",
      estatus: DEFAULT_PROJECT_STATUS,
    });
  }

  function startEdit(p: ProjectRow) {
    setEditingId(p.id);
    selectProject(p.id);
    setShowCreateForm(false);
    setForm({
      nombre: p.nombre,
      ubicacion: p.ubicacion,
      clientId: p.clientId,
      ano: p.ano,
      tipologia: p.tipologia,
      estatus: p.estatus,
    });
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.clientId) {
      setError("Selecciona un cliente");
      return;
    }
    const tipologia = form.tipologia.trim();
    if (!tipologia) {
      setError("La tipología es obligatoria");
      return;
    }
    const ano = Math.floor(Number(form.ano));
    if (!Number.isFinite(ano) || ano < 1900 || ano > 2100) {
      setError("Indica un año válido (1900-2100)");
      return;
    }
    const payload = {
      nombre: form.nombre.trim(),
      ubicacion: form.ubicacion.trim(),
      clientId: form.clientId.trim(),
      ano,
      tipologia,
      estatus: form.estatus,
    };
    try {
      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "No se pudo actualizar");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "No se pudo crear");
        }
      }
      await load();
      notifyDataRefresh({ reason: "projects" });
      if (!editingId) {
        setShowCreateForm(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  async function executeDeleteProject(pin?: string) {
    const id = deleteProjectId;
    if (!id || !pin) return;
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}?adminPin=${encodeURIComponent(pin)}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "No se pudo eliminar");
      }
      if (selectedId === id) selectProject(null);
      if (editingId === id) setEditingId(null);
      setDeleteProjectId(null);
      await load();
      notifyDataRefresh({ reason: "projects" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  async function onUploadGeneral(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedId || !e.target.files?.length) return;
    setUploadBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      for (const f of Array.from(e.target.files)) {
        fd.append("files", f);
      }
      const res = await fetch(`/api/projects/${selectedId}/files`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Subida rechazada");
      }
      e.target.value = "";
      await load();
      notifyDataRefresh({ reason: "projects" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de subida");
    } finally {
      setUploadBusy(false);
    }
  }

  const tabs: { id: WorkspaceTab; label: string; Icon: typeof ClipboardList }[] = [
    { id: "proyecto", label: "Proyecto", Icon: Building2 },
    { id: "tareas", label: "Tareas", Icon: ClipboardList },
    { id: "cronograma", label: "Cronograma", Icon: Calendar },
    { id: "docs", label: "Doc. PDF", Icon: ScrollText },
    { id: "adjuntos", label: "Adjuntos", Icon: Paperclip },
  ];

  return (
    <div className="space-y-12">
      {ifcUrl && <BimViewer url={ifcUrl} onClose={() => setIfcUrl(null)} />}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Proyectos</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Datos del proyecto, tareas por disciplina, documentación PDF clasificada y adjuntos generales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(statusFilter !== "all" || searchQuery.trim()) && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
            >
              <FilterX className="h-3.5 w-3.5" strokeWidth={1.75} />
              Limpiar filtros
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
            onClick={() => {
              if (showCreateForm) setShowCreateForm(false);
              else startCreate();
            }}
          >
            {showCreateForm ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Plus className="h-4 w-4" strokeWidth={1.75} />}
            {showCreateForm ? "CANCELAR" : "NUEVO PROYECTO"}
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className="flex flex-col gap-8">
        {selectedId && selected ? (
          <section className="rounded-2xl bg-muted/10 p-6 border border-border/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Proyecto: <span className="text-muted-foreground font-normal">{selected.nombre}</span>
              </h2>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition"
                onClick={() => selectProject(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-1 border-b border-border/60 pb-1">
                {tabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setWorkspaceTab(id)}
                    className={
                      workspaceTab === id
                        ? "inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-foreground"
                        : "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }
                  >
                    <Icon className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} />
                    {label}
                  </button>
                ))}
              </div>

              {workspaceTab === "proyecto" && (
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">{editingId === selected.id ? "Editar proyecto" : "Proyecto seleccionado"}</h2>
                    {editingId === selected.id && <ShareButton resourceType="PROJECT" resourceId={selected.id} />}
                  </div>
                  <form className="mt-6 space-y-5" onSubmit={submitForm}>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Nombre
                      <input required className={field} value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Ubicación
                      <input required className={field} value={form.ubicacion} onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))} />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Cliente
                      <select required className={`${field} cursor-pointer`} value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}>
                        <option value="">Seleccionar</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-6">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Año
                        <input required type="number" className={`${field} tabular-nums`} value={form.ano} onChange={(e) => setForm((f) => ({ ...f, ano: Number(e.target.value) }))} />
                      </label>
                      <label className="block text-xs font-medium text-muted-foreground">
                        Estatus
                        <select
                          className={`${field} cursor-pointer`}
                          value={form.estatus}
                          onChange={(e) => {
                            const s = parseProjectStatus(e.target.value) ?? DEFAULT_PROJECT_STATUS;
                            setForm((f) => ({ ...f, estatus: s }));
                          }}
                        >
                          {PROJECT_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Tipología
                      <input required className={field} value={form.tipologia} onChange={(e) => setForm((f) => ({ ...f, tipologia: e.target.value }))} />
                    </label>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button type="submit" className="rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-foreground hover:opacity-90">
                        Guardar cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {workspaceTab === "tareas" && (
                <ProjectTasksSection
                  projectId={selected.id}
                  tasks={selected.tasks ?? []}
                  onChanged={() => {
                    void load().then(() => notifyDataRefresh({ reason: "projects" }));
                  }}
                />
              )}

              {workspaceTab === "cronograma" && (
                <GanttChart tasks={selected.tasks ?? []} />
              )}

              {workspaceTab === "docs" && (
                <ProjectTechnicalDocsSection
                  projectId={selected.id}
                  files={technicalFiles}
                  onChanged={() => {
                    void load().then(() => notifyDataRefresh({ reason: "projects" }));
                  }}
                  onError={setError}
                  isAdmin={userRole === "ADMIN"}
                />
              )}

              {workspaceTab === "adjuntos" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Archivos generales (PDF, DWG e IFC). No usan clasificación BEP/OIR/EIR.</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-muted/60 px-4 py-3 text-xs font-medium dark:bg-muted/25">
                    <Paperclip className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                    <input type="file" accept=".pdf,.dwg,.ifc" multiple className="hidden" disabled={uploadBusy} onChange={onUploadGeneral} />
                    {uploadBusy ? "Subiendo" : "Adjuntar archivos"}
                  </label>
                  <div className="overflow-x-auto mt-4 rounded-2xl bg-muted/40 dark:bg-muted/20">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className="border-b border-border/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nombre</th>
                          <th className="px-4 py-3 font-medium">Versión</th>
                          <th className="px-4 py-3 font-medium">Tamaño</th>
                          <th className="px-4 py-3 font-medium">Extensión</th>
                          <th className="px-4 py-3 font-medium">Fecha / Hora</th>
                          <th className="px-4 py-3 text-right font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {generalFiles.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">
                              Sin adjuntos.
                            </td>
                          </tr>
                        ) : (
                          generalFiles.map((f) => {
                            const ext = "." + (f.originalName.split(".").pop()?.toLowerCase() || "");
                            const sizeMb = (f.size / (1024 * 1024)).toFixed(2) + " MB";
                            const dateObj = new Date(f.uploadedAt);
                            const dateStr = dateObj.toLocaleDateString("es-ES") + " " + dateObj.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                            return (
                              <tr key={f.id} className="hover:bg-background/50 dark:hover:bg-background/10">
                                <td className="px-4 py-3 font-medium text-foreground">{f.originalName}</td>
                                <td className="px-4 py-3 text-muted-foreground">v{f.version}</td>
                                <td className="px-4 py-3 tabular-nums text-muted-foreground">{sizeMb}</td>
                                <td className="px-4 py-3 text-muted-foreground">{ext}</td>
                                <td className="px-4 py-3 tabular-nums text-muted-foreground">{dateStr}</td>
                                <td className="px-4 py-3 text-right">
                                  {ext === ".ifc" ? (
                                    <button
                                      type="button"
                                      onClick={() => setIfcUrl(`/api/files/${f.id}/ifc`)}
                                      className="mr-3 text-xs font-medium text-accent underline-offset-4 hover:underline"
                                    >
                                      Ver Modelo 3D
                                    </button>
                                  ) : (
                                    <a href={`/api/files/${f.id}/download`} className="mr-3 text-xs font-medium text-accent underline-offset-4 hover:underline">
                                      Descargar
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    className="text-destructive hover:underline"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      if (!confirm("¿Eliminar este adjunto?")) return;
                                      const res = await fetch(`/api/files/${f.id}`, { method: "DELETE" });
                                      if (res.ok) {
                                        await load();
                                        notifyDataRefresh({ reason: "projects" });
                                      }
                                    }}
                                  >
                                    <Trash2 className="inline h-3.5 w-3.5" strokeWidth={1.75} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : showCreateForm ? (
          <section className="rounded-2xl bg-muted/10 p-6 border border-border/40 max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">Nuevo proyecto</h2>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Completa los datos del nuevo proyecto. Podrás añadir tareas y documentación más adelante.</p>
            <form className="mt-6 space-y-5" onSubmit={submitForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block text-xs font-medium text-muted-foreground">
                  Nombre
                  <input required className={field} value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  Ubicación
                  <input required className={field} value={form.ubicacion} onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))} />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block text-xs font-medium text-muted-foreground">
                  Cliente
                  <select required className={`${field} cursor-pointer`} value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}>
                    <option value="">Seleccionar</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  Tipología
                  <input required className={field} value={form.tipologia} onChange={(e) => setForm((f) => ({ ...f, tipologia: e.target.value }))} />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <label className="block md:col-span-2 text-xs font-medium text-muted-foreground">
                  Año
                  <input required type="number" className={`${field} tabular-nums`} value={form.ano} onChange={(e) => setForm((f) => ({ ...f, ano: Number(e.target.value) }))} />
                </label>
                <label className="block md:col-span-2 text-xs font-medium text-muted-foreground">
                  Estatus
                  <select
                    className={`${field} cursor-pointer`}
                    value={form.estatus}
                    onChange={(e) => {
                      const s = parseProjectStatus(e.target.value) ?? DEFAULT_PROJECT_STATUS;
                      setForm((f) => ({ ...f, estatus: s }));
                    }}
                  >
                    {PROJECT_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={clients.length === 0}
                  className="rounded-lg bg-accent px-6 py-2.5 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                >
                  Registrar proyecto
                </button>
                {clients.length === 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">Crea un cliente en Clientes para poder registrar proyectos.</p>
                ) : null}
              </div>
            </form>
          </section>
        ) : null}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Listado</h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              {filtered.length} / {projects.length}
            </span>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-muted/40 dark:bg-muted/20">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Ubicación</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Año</th>
                  <th className="px-4 py-3 font-medium">Tipología</th>
                  <th className="px-4 py-3 font-medium">Estatus</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      Cargando
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      Sin resultados.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        selectedId === p.id ? "cursor-pointer bg-background/70 dark:bg-background/20" : "cursor-pointer hover:bg-background/50 dark:hover:bg-background/10"
                      }
                      onClick={() => {
                        startEdit(p);
                      }}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{p.nombre}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground">{p.ubicacion}</td>
                      <td className="px-4 py-3 text-foreground">{p.client.nombre}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">{p.ano}</td>
                      <td className="max-w-[120px] truncate px-4 py-3 text-muted-foreground">{p.tipologia}</td>
                      <td className="px-4 py-3 text-foreground">{labelProjectStatus(p.estatus)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="mr-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(p);
                          }}
                        >
                          Abrir
                        </button>
                        {userRole === "ADMIN" && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteProjectId(p.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" strokeWidth={1.75} />
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={deleteProjectId !== null}
        title="Eliminar proyecto"
        message={CONFIRM_DELETE_MESSAGE}
        confirmLabel="Eliminar"
        requirePin={true}
        onCancel={() => setDeleteProjectId(null)}
        onConfirm={(pin) => void executeDeleteProject(pin)}
      />
    </div>
  );
}
