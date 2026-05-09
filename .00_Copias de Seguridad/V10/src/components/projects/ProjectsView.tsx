"use client";

import { Building2, ClipboardList, FilterX, Paperclip, ScrollText, Trash2, Plus, X, Calendar } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProjectTasksSection, type TaskRow } from "@/components/projects/ProjectTasksSection";
import { ProjectTechnicalDocsSection } from "@/components/projects/ProjectTechnicalDocsSection";
import { ProjectIsoAttachmentsSection, type AttachmentSubfolderRow, type IsoAttachmentFileRow } from "@/components/projects/ProjectIsoAttachmentsSection";
import { GanttChart } from "@/components/projects/GanttChart";
import { BimViewer } from "@/components/projects/BimViewer";
import { ShareButton } from "@/components/ShareButton";
import { useVoiceCommands } from "@/context/VoiceCommandsProvider";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";
import { DEFAULT_PROJECT_STATUS, labelProjectStatus, parseProjectStatus, PROJECT_STATUS_OPTIONS, type ProjectStatusCode } from "@/lib/project-status";
import { PROJECT_DISCIPLINE_OPTIONS, disciplinesCsvToArray } from "@/lib/project-disciplines";
import { ConfirmDialog, CONFIRM_DELETE_MESSAGE } from "@/components/ui/ConfirmDialog";
import { NIP_DIGITS } from "@/lib/nip-validation";

type ClientOpt = { id: string; nombre: string };

type ProjectFileRow = {
  id: string;
  originalName: string;
  size: number;
  technicalDocType?: string | null;
  version: number;
  uploadedAt: string;
  attachment?: { id: string; container: string; subfolderId?: string | null } | null;
  uploadEvents?: { uploader: { nombre: string } | null }[];
};

type ProjectRow = {
  id: string;
  nombre: string;
  ubicacion: string;
  ano: number;
  tipologia: string;
  estatus: ProjectStatusCode;
  clientId: string;
  ownerId?: string | null;
  sharedWith?: { id: string }[];
  attachmentSubfolders?: { id: string; container: string; name: string }[];
  bepFileId?: string | null;
  projectCode?: string | null;
  disciplinesInvolved?: string;
  milestoneSd?: string | null;
  milestoneDd?: string | null;
  milestoneCd?: string | null;
  milestoneLicitacion?: string | null;
  milestoneAsBuilt?: string | null;
  client: ClientOpt;
  files: ProjectFileRow[];
  tasks: TaskRow[];
};

const field =
  "mt-1.5 w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0";
const dateField = `${field} dark:[color-scheme:dark]`;

function isoDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

type WorkspaceTab = "proyecto" | "tareas" | "cronograma" | "docs" | "adjuntos";

type ProjectFormState = {
  nombre: string;
  ubicacion: string;
  clientId: string;
  ano: number;
  tipologia: string;
  estatus: ProjectStatusCode;
  projectCode: string;
  disciplines: string[];
  milestoneSd: string;
  milestoneDd: string;
  milestoneCd: string;
  milestoneLicitacion: string;
  milestoneAsBuilt: string;
};

export function ProjectsView({
  userRole,
  userId = "",
  canManageFolders = false,
}: {
  userRole?: string;
  userId?: string;
  canManageFolders?: boolean;
}) {
  const canManageProjects = userRole === "ADMIN";
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
    projectCode: "",
    disciplines: [],
    milestoneSd: "",
    milestoneDd: "",
    milestoneCd: "",
    milestoneLicitacion: "",
    milestoneAsBuilt: "",
  });

  const [uploadBusy, setUploadBusy] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [trashFileTarget, setTrashFileTarget] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => {
    const seq = ++loadSeqRef.current;
    setError(null);

    const [prOutcome, clOutcome] = await Promise.allSettled([
      fetch("/api/projects").then(async (r) => {
        if (!r.ok) throw new Error("projects");
        const raw = await r.json();
        if (!Array.isArray(raw)) throw new Error("projects");
        return raw as ProjectRow[];
      }),
      fetch("/api/clients?activo=true").then(async (r) => {
        if (!r.ok) throw new Error("clients");
        const raw = await r.json();
        if (!Array.isArray(raw)) throw new Error("clients");
        return raw as (ClientOpt & { activo?: boolean })[];
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

  const reloadProjectData = useCallback(async () => {
    await load();
    notifyDataRefresh({ reason: "projects" });
  }, [load]);

  const handleProjectDataChanged = useCallback(() => {
    void load().then(() => notifyDataRefresh({ reason: "projects" }));
  }, [load]);

  const handleIsoAttachmentsError = useCallback((msg: string) => {
    setError(msg || null);
  }, []);

  const handleTrashIsoFile = useCallback((f: { id: string; name: string }) => {
    setTrashFileTarget(f);
  }, []);

  const handleOpenIfcViewer = useCallback((fileId: string) => {
    setIfcUrl(`/api/files/${fileId}/ifc`);
  }, []);

  useEffect(() => {
    if (!canManageProjects && showCreateForm) setShowCreateForm(false);
  }, [canManageProjects, showCreateForm]);

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
      const files = Array.isArray(p.files) ? p.files : [];
      const tasks = Array.isArray(p.tasks) ? p.tasks : [];
      const inFiles = files.some((f) => f.originalName.toLowerCase().includes(q));
      const inTasks = tasks.some((t) => t.nombre.toLowerCase().includes(q));
      const clientNombre = p.client?.nombre ?? "";
      return (
        p.nombre.toLowerCase().includes(q) ||
        (p.projectCode ?? "").toLowerCase().includes(q) ||
        p.ubicacion.toLowerCase().includes(q) ||
        p.tipologia.toLowerCase().includes(q) ||
        clientNombre.toLowerCase().includes(q) ||
        String(p.ano).includes(q) ||
        inFiles ||
        inTasks
      );
    });
  }, [projects, statusFilter, searchQuery]);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  const canEditIsoAttachments = useMemo(() => {
    if (!selected || !userId) return false;
    if (userRole === "ADMIN") return true;
    if (selected.ownerId === userId) return true;
    return (selected.sharedWith ?? []).some((u) => u.id === userId);
  }, [selected, userId, userRole]);

  const isoAttachmentFiles = useMemo(() => {
    if (!Array.isArray(selected?.files)) return [];
    return selected.files
      .filter((f) => !f.technicalDocType && f.attachment)
      .map((f) => ({
        ...f,
        uploadedByNombre: f.uploadEvents?.[0]?.uploader?.nombre ?? null,
      }));
  }, [selected]);
  const technicalFiles = useMemo(() => {
    if (!Array.isArray(selected?.files)) return [];
    return selected.files.filter((f) => f.technicalDocType);
  }, [selected]);

  const selectedTasks = useMemo(() => {
    if (!selected) return [];
    return Array.isArray(selected.tasks) ? selected.tasks : [];
  }, [selected]);

  function startCreate() {
    if (!canManageProjects) return;
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
      projectCode: "",
      disciplines: [],
      milestoneSd: "",
      milestoneDd: "",
      milestoneCd: "",
      milestoneLicitacion: "",
      milestoneAsBuilt: "",
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
      projectCode: p.projectCode ?? "",
      disciplines: disciplinesCsvToArray(p.disciplinesInvolved),
      milestoneSd: isoDateInputValue(p.milestoneSd),
      milestoneDd: isoDateInputValue(p.milestoneDd),
      milestoneCd: isoDateInputValue(p.milestoneCd),
      milestoneLicitacion: isoDateInputValue(p.milestoneLicitacion),
      milestoneAsBuilt: isoDateInputValue(p.milestoneAsBuilt),
    });
  }

  function openViewOnly(p: ProjectRow) {
    setEditingId(null);
    selectProject(p.id);
    setShowCreateForm(false);
    setForm({
      nombre: p.nombre,
      ubicacion: p.ubicacion,
      clientId: p.clientId,
      ano: p.ano,
      tipologia: p.tipologia,
      estatus: p.estatus,
      projectCode: p.projectCode ?? "",
      disciplines: disciplinesCsvToArray(p.disciplinesInvolved),
      milestoneSd: isoDateInputValue(p.milestoneSd),
      milestoneDd: isoDateInputValue(p.milestoneDd),
      milestoneCd: isoDateInputValue(p.milestoneCd),
      milestoneLicitacion: isoDateInputValue(p.milestoneLicitacion),
      milestoneAsBuilt: isoDateInputValue(p.milestoneAsBuilt),
    });
  }

  function openProjectRow(p: ProjectRow) {
    if (canManageProjects) startEdit(p);
    else openViewOnly(p);
  }

  function toggleDiscipline(key: string) {
    setForm((f) => ({
      ...f,
      disciplines: f.disciplines.includes(key) ? f.disciplines.filter((k) => k !== key) : [...f.disciplines, key],
    }));
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!canManageProjects) return;
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
      projectCode: form.projectCode.trim() || null,
      disciplines: form.disciplines,
      milestoneSd: form.milestoneSd || null,
      milestoneDd: form.milestoneDd || null,
      milestoneCd: form.milestoneCd || null,
      milestoneLicitacion: form.milestoneLicitacion || null,
      milestoneAsBuilt: form.milestoneAsBuilt || null,
    };
    try {
      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const raw = await res.text();
          let msg = raw;
          try {
            const j = JSON.parse(raw) as { error?: string };
            msg = j.error ?? raw;
          } catch {
            /* plain text */
          }
          throw new Error(msg || "No se pudo actualizar");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const raw = await res.text();
          let msg = raw;
          try {
            const j = JSON.parse(raw) as { error?: string };
            msg = j.error ?? raw;
          } catch {
            /* plain text e.g. Unauthorized */
          }
          throw new Error(msg || "No se pudo crear");
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

  const tabs: { id: WorkspaceTab; label: string; Icon: typeof ClipboardList }[] = [
    { id: "proyecto", label: "INFORMACIÓN", Icon: Building2 },
    { id: "tareas", label: "TAREAS", Icon: ClipboardList },
    { id: "cronograma", label: "CRONOGRAMA", Icon: Calendar },
    { id: "docs", label: "DOC PDF", Icon: ScrollText },
    { id: "adjuntos", label: "DOCS", Icon: Paperclip },
  ];

  return (
    <div className={selectedId && selected ? "space-y-2" : "space-y-12"}>
      {ifcUrl && <BimViewer url={ifcUrl} onClose={() => setIfcUrl(null)} />}
      {!(selectedId && selected) ? (
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
            {canManageProjects && (
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
            )}
          </div>
        </header>
      ) : null}

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className={`flex flex-col ${selectedId && selected ? "gap-3" : "gap-8"}`}>
        {selectedId && selected ? (
          <section className="mt-0 border-0 bg-transparent p-0 shadow-none">
            <div className="border-b border-border">
              <div className="flex flex-wrap gap-1">
                {tabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setWorkspaceTab(id)}
                    className={
                      workspaceTab === id
                        ? "inline-flex items-center gap-1.5 border-b-2 border-accent px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-foreground -mb-px"
                        : "inline-flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                    }
                  >
                    <Icon className="h-3.5 w-3.5 opacity-80" strokeWidth={1.75} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 py-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-foreground">{selected.nombre}</span>
                {!selected.bepFileId || selected.estatus === "INCOMPLETO" ? (
                  <span className="shrink-0 rounded bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                    ISO incompleto (sin BEP)
                  </span>
                ) : (
                  <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-400">
                    Activo (BEP vinculado)
                  </span>
                )}
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                onClick={() => selectProject(null)}
                aria-label="Cerrar proyecto"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="pt-3">
              <div
                className={workspaceTab === "proyecto" ? "block" : "hidden"}
                aria-hidden={workspaceTab !== "proyecto"}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">
                      {canManageProjects
                        ? editingId === selected.id
                          ? "Editar proyecto"
                          : "Proyecto seleccionado"
                        : "Proyecto (solo lectura)"}
                    </h2>
                    {canManageProjects && editingId === selected.id ? (
                      <ShareButton resourceType="PROJECT" resourceId={selected.id} />
                    ) : null}
                  </div>
                  {!canManageProjects ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Solo los administradores pueden modificar datos del proyecto. Puedes revisar tareas, documentos y subir adjuntos en los proyectos compartidos contigo.
                    </p>
                  ) : null}
                  <form className="mt-6 space-y-5" onSubmit={submitForm}>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Código de proyecto (ISO 19650)
                      <input
                        required={false}
                        disabled={!canManageProjects}
                        placeholder="Opcional, único en cartera"
                        className={field}
                        value={form.projectCode}
                        onChange={(e) => setForm((f) => ({ ...f, projectCode: e.target.value }))}
                      />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Nombre
                      <input
                        required={canManageProjects}
                        disabled={!canManageProjects}
                        className={field}
                        value={form.nombre}
                        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Ubicación
                      <input
                        required={canManageProjects}
                        disabled={!canManageProjects}
                        className={field}
                        value={form.ubicacion}
                        onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
                      />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Cliente
                      {canManageProjects ? (
                        <select
                          required
                          className={`${field} cursor-pointer`}
                          value={form.clientId}
                          onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
                        >
                          <option value="">Seleccionar</option>
                          {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1.5 text-sm text-foreground">{selected.client.nombre}</p>
                      )}
                    </label>
                    <div className="grid grid-cols-2 gap-6">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Año
                        <input
                          required={canManageProjects}
                          disabled={!canManageProjects}
                          type="number"
                          className={`${field} tabular-nums`}
                          value={form.ano}
                          onChange={(e) => setForm((f) => ({ ...f, ano: Number(e.target.value) }))}
                        />
                      </label>
                      <label className="block text-xs font-medium text-muted-foreground">
                        Estatus
                        {!selected.bepFileId ? (
                          <p className="mt-1 text-[10px] font-normal text-muted-foreground">
                            Sin BEP vinculado el estatus queda en INCOMPLETO (ISO 19650).
                          </p>
                        ) : null}
                        <select
                          disabled={!canManageProjects || !selected.bepFileId}
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
                      <input
                        required={canManageProjects}
                        disabled={!canManageProjects}
                        className={field}
                        value={form.tipologia}
                        onChange={(e) => setForm((f) => ({ ...f, tipologia: e.target.value }))}
                      />
                    </label>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Disciplinas involucradas</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {PROJECT_DISCIPLINE_OPTIONS.map(({ key, label }) => (
                          <button
                            key={key}
                            type="button"
                            disabled={!canManageProjects}
                            onClick={() => toggleDiscipline(key)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              form.disciplines.includes(key)
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            } disabled:pointer-events-none disabled:opacity-50`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Hitos de entrega</p>
                      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block text-[11px] font-medium text-muted-foreground">
                          SD — Diseño esquemático
                          <input
                            type="date"
                            disabled={!canManageProjects}
                            className={dateField}
                            value={form.milestoneSd}
                            onChange={(e) => setForm((f) => ({ ...f, milestoneSd: e.target.value }))}
                          />
                        </label>
                        <label className="block text-[11px] font-medium text-muted-foreground">
                          DD — Desarrollo de diseño
                          <input
                            type="date"
                            disabled={!canManageProjects}
                            className={dateField}
                            value={form.milestoneDd}
                            onChange={(e) => setForm((f) => ({ ...f, milestoneDd: e.target.value }))}
                          />
                        </label>
                        <label className="block text-[11px] font-medium text-muted-foreground">
                          CD — Documentación de construcción
                          <input
                            type="date"
                            disabled={!canManageProjects}
                            className={dateField}
                            value={form.milestoneCd}
                            onChange={(e) => setForm((f) => ({ ...f, milestoneCd: e.target.value }))}
                          />
                        </label>
                        <label className="block text-[11px] font-medium text-muted-foreground">
                          Licitación
                          <input
                            type="date"
                            disabled={!canManageProjects}
                            className={dateField}
                            value={form.milestoneLicitacion}
                            onChange={(e) => setForm((f) => ({ ...f, milestoneLicitacion: e.target.value }))}
                          />
                        </label>
                        <label className="block text-[11px] font-medium text-muted-foreground">
                          As-Built
                          <input
                            type="date"
                            disabled={!canManageProjects}
                            className={dateField}
                            value={form.milestoneAsBuilt}
                            onChange={(e) => setForm((f) => ({ ...f, milestoneAsBuilt: e.target.value }))}
                          />
                        </label>
                      </div>
                    </div>
                    {canManageProjects ? (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button type="submit" className="rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-foreground hover:opacity-90">
                          Guardar cambios
                        </button>
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>

              <div
                className={workspaceTab === "tareas" ? "block" : "hidden"}
                aria-hidden={workspaceTab !== "tareas"}
              >
                <ProjectTasksSection
                  projectId={selected.id}
                  projectClientName={selected.client.nombre}
                  tasks={selectedTasks}
                  onChanged={handleProjectDataChanged}
                />
              </div>

              <div
                className={workspaceTab === "cronograma" ? "block" : "hidden"}
                aria-hidden={workspaceTab !== "cronograma"}
              >
                <GanttChart tasks={selectedTasks} />
              </div>

              <div
                className={workspaceTab === "docs" ? "block" : "hidden"}
                aria-hidden={workspaceTab !== "docs"}
              >
                <ProjectTechnicalDocsSection
                  projectId={selected.id}
                  files={technicalFiles}
                  onChanged={handleProjectDataChanged}
                  onError={setError}
                  isAdmin={userRole === "ADMIN"}
                />
              </div>

              <div
                className={workspaceTab === "adjuntos" ? "block min-h-[70vh]" : "hidden"}
                aria-hidden={workspaceTab !== "adjuntos"}
              >
                <ProjectIsoAttachmentsSection
                  projectId={selected.id}
                  active={workspaceTab === "adjuntos"}
                  files={isoAttachmentFiles as unknown as IsoAttachmentFileRow[]}
                  attachmentSubfolders={(selected.attachmentSubfolders ?? []) as AttachmentSubfolderRow[]}
                  canEditFiles={canEditIsoAttachments}
                  canManageFolders={userRole === "ADMIN" || canManageFolders}
                  uploadBusy={uploadBusy}
                  setUploadBusy={setUploadBusy}
                  onReload={reloadProjectData}
                  onError={handleIsoAttachmentsError}
                  onTrash={handleTrashIsoFile}
                  onOpenIfc={handleOpenIfcViewer}
                />
              </div>
            </div>
          </section>
        ) : canManageProjects && showCreateForm ? (
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
              <label className="block text-xs font-medium text-muted-foreground">
                Código de proyecto (ISO 19650)
                <input
                  className={field}
                  placeholder="Opcional, único en cartera"
                  value={form.projectCode}
                  onChange={(e) => setForm((f) => ({ ...f, projectCode: e.target.value }))}
                />
              </label>
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
                  <p className="mt-1 text-[10px] font-normal text-muted-foreground">
                    Se registra como INCOMPLETO hasta vincular un BEP en Doc. PDF.
                  </p>
                  <select disabled className={`${field} cursor-not-allowed opacity-70`} value={form.estatus}>
                    {PROJECT_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Disciplinas involucradas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PROJECT_DISCIPLINE_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleDiscipline(key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        form.disciplines.includes(key)
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Hitos de entrega</p>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-[11px] font-medium text-muted-foreground">
                    SD — Diseño esquemático
                    <input
                      type="date"
                      className={field}
                      value={form.milestoneSd}
                      onChange={(e) => setForm((f) => ({ ...f, milestoneSd: e.target.value }))}
                    />
                  </label>
                  <label className="block text-[11px] font-medium text-muted-foreground">
                    DD — Desarrollo de diseño
                    <input
                      type="date"
                      className={field}
                      value={form.milestoneDd}
                      onChange={(e) => setForm((f) => ({ ...f, milestoneDd: e.target.value }))}
                    />
                  </label>
                  <label className="block text-[11px] font-medium text-muted-foreground">
                    CD — Documentación de construcción
                    <input
                      type="date"
                      className={field}
                      value={form.milestoneCd}
                      onChange={(e) => setForm((f) => ({ ...f, milestoneCd: e.target.value }))}
                    />
                  </label>
                  <label className="block text-[11px] font-medium text-muted-foreground">
                    Licitación
                    <input
                      type="date"
                      className={field}
                      value={form.milestoneLicitacion}
                      onChange={(e) => setForm((f) => ({ ...f, milestoneLicitacion: e.target.value }))}
                    />
                  </label>
                  <label className="block text-[11px] font-medium text-muted-foreground">
                    As-Built
                    <input
                      type="date"
                      className={field}
                      value={form.milestoneAsBuilt}
                      onChange={(e) => setForm((f) => ({ ...f, milestoneAsBuilt: e.target.value }))}
                    />
                  </label>
                </div>
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

        {!(selectedId && selected) ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Listado</h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              {filtered.length} / {projects.length}
            </span>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-muted/40 dark:bg-muted/20">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-border/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Código</th>
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
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                      Cargando
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
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
                        openProjectRow(p);
                      }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{p.nombre}</span>
                      </td>
                      <td className="max-w-[100px] truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                        {p.projectCode ?? "—"}
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground">{p.ubicacion}</td>
                      <td className="px-4 py-3 text-foreground">{p.client.nombre}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">{p.ano}</td>
                      <td className="max-w-[120px] truncate px-4 py-3 text-muted-foreground">{p.tipologia}</td>
                      <td className="px-4 py-3">
                        {!p.bepFileId || p.estatus === "INCOMPLETO" ? (
                          <span className="inline-flex w-[100px] items-center justify-center rounded-md border border-orange-500/30 bg-orange-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-800 dark:border-orange-400/30 dark:bg-orange-400/15 dark:text-orange-400">
                            INCOMPLETO
                          </span>
                        ) : (
                          <span className="inline-flex w-[100px] items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-400">
                            COMPLETO
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="mr-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectRow(p);
                          }}
                        >
                          Abrir
                        </button>
                        {canManageProjects && (
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
        ) : null}
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
      <ConfirmDialog
        open={trashFileTarget !== null}
        title="Confirmar eliminación"
        message="Ingrese su NIP para continuar"
        confirmLabel="Mover a la papelera"
        confirmVariant="destructive"
        requirePin={true}
        secretFieldLabel="NIP"
        secretPlaceholder="4 dígitos"
        secretExactLength={NIP_DIGITS}
        onCancel={() => setTrashFileTarget(null)}
        onConfirm={(nip) => {
          const t = trashFileTarget;
          setTrashFileTarget(null);
          if (!t || !nip) return;
          void (async () => {
            const res = await fetch(`/api/files/${t.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nip }),
            });
            if (res.status === 204) {
              await load();
              notifyDataRefresh({ reason: "projects" });
              return;
            }
            const j = (await res.json().catch(() => ({}))) as { error?: string };
            setError(j.error ?? "No se pudo mover el archivo a la papelera");
          })();
        }}
      />
    </div>
  );
}
