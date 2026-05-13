"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FilterX,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProjectTasksSection, type TaskRow } from "@/components/projects/ProjectTasksSection";
import { useVoiceCommands } from "@/context/VoiceCommandsProvider";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";
import { labelDiscipline, labelTaskEstatus, TASK_AUTHORING_DISCIPLINES } from "@/lib/project-enums";
import { labelProjectStatus } from "@/lib/project-status";
import type { TaskDiscipline, TaskEstatus } from "@/generated/prisma";

type ClientOpt = { id: string; nombre: string };

type ClientListItem = { id: string; nombre: string; _count?: { projects: number } };

type ProjectSummary = {
  id: string;
  nombre: string;
  ubicacion: string;
  ano: number;
  tipologia: string;
  estatus: string;
  client: ClientOpt;
  tasks: TaskRow[];
};

export type GlobalTaskListItem = TaskRow & {
  projectId: string;
  projectNombre: string;
  projectClientNombre: string;
  relatedFileName?: string | null;
};

function normalizeTasks(raw: unknown): TaskRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const t = item as Record<string, unknown>;
    const ft = t.fechaTermino;
    let fechaIso: string;
    if (typeof ft === "string") fechaIso = ft;
    else if (ft instanceof Date) fechaIso = ft.toISOString();
    else {
      const d = new Date(String(ft));
      fechaIso = Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    }
    return {
      id: String(t.id ?? ""),
      nombre: String(t.nombre ?? ""),
      disciplina: String(t.disciplina ?? ""),
      fechaTermino: fechaIso,
      complejidad: String(t.complejidad ?? ""),
      actividad: String(t.actividad ?? "MODELADO"),
      taskEstatus: String(t.taskEstatus ?? "PENDIENTE"),
      completado: Boolean(t.completado),
      comentarios: String(t.comentarios ?? ""),
      clienteNombre: t.clienteNombre != null ? String(t.clienteNombre) : undefined,
    };
  });
}

function normalizeGlobalTasks(raw: unknown): GlobalTaskListItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const t = item as Record<string, unknown>;
    const proj = t.project as Record<string, unknown> | undefined;
    const client = proj?.client as Record<string, unknown> | undefined;
    const ft = t.fechaTermino;
    let fechaIso: string;
    if (typeof ft === "string") fechaIso = ft;
    else if (ft instanceof Date) fechaIso = ft.toISOString();
    else {
      const d = new Date(String(ft));
      fechaIso = Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    }
    const assignments = Array.isArray(t.assignments)
      ? t.assignments.map((a) => {
          const ar = a as Record<string, unknown>;
          const u = ar.user as Record<string, unknown> | undefined;
          return {
            userId: String(ar.userId ?? ""),
            isAccepted: Boolean(ar.isAccepted),
            user: u ? { nombre: String(u.nombre ?? "") } : undefined,
          };
        })
      : undefined;
    return {
      id: String(t.id ?? ""),
      nombre: String(t.nombre ?? ""),
      disciplina: String(t.disciplina ?? ""),
      fechaTermino: fechaIso,
      complejidad: String(t.complejidad ?? ""),
      actividad: String(t.actividad ?? "MODELADO"),
      taskEstatus: String(t.taskEstatus ?? "PENDIENTE"),
      completado: Boolean(t.completado),
      comentarios: String(t.comentarios ?? ""),
      clienteNombre: t.clienteNombre != null ? String(t.clienteNombre) : undefined,
      assignments,
      projectId: String(proj?.id ?? ""),
      projectNombre: String(proj?.nombre ?? ""),
      projectClientNombre: String(client?.nombre ?? ""),
      relatedFileName: t.relatedFile
        ? String((t.relatedFile as Record<string, unknown>).originalName ?? "")
        : null,
    };
  });
}

function empresaDisplay(t: GlobalTaskListItem): string {
  const override = t.clienteNombre?.trim();
  if (override) return override;
  return t.projectClientNombre || "—";
}

function AssigneeStack({ task }: { task: GlobalTaskListItem }) {
  const list = task.assignments ?? [];
  if (list.length === 0) {
    return <span className="text-[11px] text-muted-foreground">—</span>;
  }
  return (
    <div className="flex max-w-[220px] flex-wrap gap-1">
      {list.map((a) => (
        <span
          key={a.userId}
          title={a.user?.nombre ?? a.userId}
          className={`inline-flex h-6 min-w-[1.5rem] shrink-0 items-center justify-center rounded-full px-1.5 text-[9px] font-bold tracking-wide ring-1 ring-inset ${
            a.isAccepted
              ? "bg-slate-800 text-slate-200 ring-sky-500/40 dark:bg-slate-900/90"
              : "border border-dashed border-muted-foreground/40 bg-muted/40 text-muted-foreground opacity-80"
          }`}
        >
          {(a.user?.nombre ?? "?").slice(0, 2).toUpperCase()}
        </span>
      ))}
    </div>
  );
}

function TaskEstatusBadge({ task }: { task: GlobalTaskListItem }) {
  const est = task.taskEstatus as TaskEstatus;
  const done = task.completado;
  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
        done
          ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400"
          : "bg-muted/80 text-foreground ring-border dark:bg-muted/40"
      }`}
    >
      {labelTaskEstatus(est)}
    </span>
  );
}

export function TareasView() {
  const { searchQuery, setSearchQuery } = useVoiceCommands();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskReloadNonce, setTaskReloadNonce] = useState(0);
  const [taskOpenCreateSignal, setTaskOpenCreateSignal] = useState(0);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [newTaskContextOpen, setNewTaskContextOpen] = useState(false);
  const [ctxClientId, setCtxClientId] = useState<string | null>(null);
  const [ctxProjectId, setCtxProjectId] = useState<string | null>(null);

  const [globalTasks, setGlobalTasks] = useState<GlobalTaskListItem[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Tareas pendientes de aceptar (asignadas pero aún no aceptadas)
  const [pendingTasks, setPendingTasks] = useState<GlobalTaskListItem[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const projectsSeqRef = useRef(0);

  const loadProjects = useCallback(async () => {
    const seq = ++projectsSeqRef.current;
    setLoadError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("No se pudieron cargar los proyectos");
      const data = (await res.json()) as ProjectSummary[];
      if (seq !== projectsSeqRef.current) return;
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      if (seq !== projectsSeqRef.current) return;
      setLoadError(e instanceof Error ? e.message : "Error");
      setProjects([]);
    } finally {
      if (seq === projectsSeqRef.current) setLoadingProjects(false);
    }
  }, []);

  const loadGlobalTasks = useCallback(async () => {
    setGlobalError(null);
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        let msg = "No se pudieron cargar las tareas";
        try {
          const j = (await res.json()) as { error?: string };
          if (typeof j.error === "string" && j.error.trim()) msg = j.error.trim();
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const data = await res.json();
      if (!Array.isArray(data)) { setGlobalTasks([]); return; }
      setGlobalTasks(normalizeGlobalTasks(data));
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : "Error");
      setGlobalTasks([]);
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  const loadPendingTasks = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await fetch("/api/tasks/pending");
      if (!res.ok) { setPendingTasks([]); return; }
      const data = await res.json();
      setPendingTasks(Array.isArray(data) ? normalizeGlobalTasks(data) : []);
    } catch {
      setPendingTasks([]);
    } finally {
      setPendingLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadProjects();
    });
    return () => {
      cancelled = true;
    };
  }, [loadProjects]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) void loadGlobalTasks(); });
    return () => { cancelled = true; };
  }, [loadGlobalTasks]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) void loadPendingTasks(); });
    return () => { cancelled = true; };
  }, [loadPendingTasks]);

  const loadClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("clients");
      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) {
        setClients(
          data.map((c) => {
            const row = c as Record<string, unknown>;
            return {
              id: String(row.id ?? ""),
              nombre: String(row.nombre ?? ""),
              _count:
                row._count && typeof row._count === "object" && row._count !== null && "projects" in row._count
                  ? { projects: Number((row._count as { projects?: unknown }).projects ?? 0) }
                  : undefined,
            };
          }),
        );
      } else {
        setClients([]);
      }
    } catch {
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadClients();
    });
    return () => {
      cancelled = true;
    };
  }, [loadClients]);

  useEffect(() => {
    return subscribeDataRefresh(() => {
      void loadProjects();
      void loadClients();
      void loadGlobalTasks();
      setTaskReloadNonce((n) => n + 1);
    });
  }, [loadProjects, loadClients, loadGlobalTasks]);

  async function handleAccept(taskId: string, accept: boolean) {
    setAcceptingId(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
        credentials: "same-origin",
      });
      if (res.ok) {
        await Promise.all([loadPendingTasks(), loadGlobalTasks()]);
      }
    } catch {
      /* noop */
    } finally {
      setAcceptingId(null);
    }
  }

  useEffect(() => {
    if (!selectedProjectId) return;

    let cancelled = false;
    const id = selectedProjectId;

    const pending = Promise.resolve().then(() => {
      if (!cancelled) setTasksLoading(true);
    });

    fetch(`/api/projects/${id}/tasks`)
      .then(async (res) => {
        await pending;
        if (!res.ok) throw new Error("fetch");
        return res.json();
      })
      .then((raw) => {
        if (!cancelled) setTasks(normalizeTasks(raw));
      })
      .catch(() => {
        if (!cancelled) setTasks([]);
      })
      .finally(() => {
        if (!cancelled) setTasksLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProjectId, taskReloadNonce]);

  const selectedMeta = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  useEffect(() => {
    if (!selectedProjectId || projects.length === 0) return;
    if (projects.some((p) => p.id === selectedProjectId)) return;
    queueMicrotask(() => {
      setSelectedProjectId(null);
    });
  }, [projects, selectedProjectId]);

  function handleTasksChanged() {
    void loadProjects();
    void loadGlobalTasks();
    void loadPendingTasks();
    setTaskReloadNonce((n) => n + 1);
    notifyDataRefresh({ reason: "projects" });
  }

  const projectsForCtxClient = useMemo(() => {
    if (!ctxClientId) return [];
    return projects.filter((p) => p.client.id === ctxClientId);
  }, [projects, ctxClientId]);

  const filteredGlobalTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return globalTasks;
    return globalTasks.filter((t) => {
      const emp = empresaDisplay(t).toLowerCase();
      return (
        t.nombre.toLowerCase().includes(q) ||
        t.projectNombre.toLowerCase().includes(q) ||
        emp.includes(q)
      );
    });
  }, [globalTasks, searchQuery]);

  function handleHeaderNewTask() {
    if (selectedProjectId) {
      setTaskOpenCreateSignal((n) => n + 1);
      return;
    }
    setNewTaskContextOpen(true);
    setCtxClientId(null);
    setCtxProjectId(null);
  }

  function confirmNewTaskContext() {
    if (!ctxProjectId) return;
    setSelectedProjectId(ctxProjectId);
    setNewTaskContextOpen(false);
    setCtxClientId(null);
    setCtxProjectId(null);
    setTaskOpenCreateSignal((n) => n + 1);
  }

  function cancelNewTaskContext() {
    setNewTaskContextOpen(false);
    setCtxClientId(null);
    setCtxProjectId(null);
  }

  const canStartNewTaskFlow = !loadingProjects && !loadingClients && (projects.length > 0 || clients.length > 0);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
              <ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Contenedor de información · ISO 19650
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">TAREAS</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Listado global de entregables: filtra por tarea, proyecto o empresa. Usa el asistente para crear tareas bajo el proyecto correcto.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!canStartNewTaskFlow}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
            onClick={handleHeaderNewTask}
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            + NUEVA TAREA
          </button>
        </div>
      </header>

      {loadError && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{loadError}</div>
      )}

      {newTaskContextOpen && (
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 dark:bg-muted/10">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nueva tarea</p>
          <p className="mt-1 text-sm text-foreground">Selecciona cliente y proyecto para registrar la tarea.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium text-muted-foreground">
              Cliente / Empresa
              <select
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                value={ctxClientId ?? ""}
                onChange={(e) => {
                  const v = e.target.value || null;
                  setCtxClientId(v);
                  setCtxProjectId(null);
                }}
              >
                <option value="">{loadingClients ? "Cargando…" : "Elige un cliente"}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <div className="block text-xs font-medium text-muted-foreground">
              <span className="block">Proyecto</span>
              {!ctxClientId ? (
                <p className="mt-1.5 rounded-lg border border-dashed border-border/60 bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                  Primero elige un cliente.
                </p>
              ) : projectsForCtxClient.length === 0 ? (
                <div className="mt-1.5 space-y-3 rounded-lg border border-border/60 bg-background/50 px-3 py-3 text-sm text-muted-foreground">
                  <p>Este cliente no tiene proyectos. Ve a la pestaña Proyectos para crear uno.</p>
                  <Link
                    href="/proyectos"
                    className="inline-flex items-center rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
                  >
                    Ir a Proyectos
                  </Link>
                </div>
              ) : (
                <select
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  value={ctxProjectId ?? ""}
                  onChange={(e) => setCtxProjectId(e.target.value || null)}
                >
                  <option value="">Elige un proyecto</option>
                  {projectsForCtxClient.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!ctxProjectId}
              onClick={confirmNewTaskContext}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={cancelNewTaskContext}
              className="rounded-lg border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {selectedProjectId && (
        <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/10 p-5 dark:bg-muted/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Alta de tarea</p>
              <h2 className="text-base font-semibold tracking-tight text-foreground">{selectedMeta?.nombre ?? "Proyecto"}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {[selectedMeta?.client.nombre, selectedMeta?.ubicacion, selectedMeta ? labelProjectStatus(selectedMeta.estatus) : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedProjectId(null);
                setNewTaskContextOpen(false);
                setCtxClientId(null);
                setCtxProjectId(null);
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Volver al listado
            </button>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Formulario de entregable (mismo registro que en Proyectos · Tareas)
          </p>
          {tasksLoading ? (
            <p className="text-sm text-muted-foreground">Cargando tareas del proyecto</p>
          ) : (
            <ProjectTasksSection
              projectId={selectedProjectId}
              projectClientName={selectedMeta?.client.nombre ?? null}
              tasks={tasks}
              disciplineOptions={TASK_AUTHORING_DISCIPLINES}
              onChanged={handleTasksChanged}
              openCreateSignal={taskOpenCreateSignal}
            />
          )}
        </section>
      )}

      {/* ── Bandeja: tareas asignadas pendientes de aceptar ── */}
      {!pendingLoading && pendingTasks.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Tareas pendientes de aceptar
              <span className="ml-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pendingTasks.length}
              </span>
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Estas tareas te fueron asignadas. Acéptalas para que aparezcan en tu listado de trabajo.
          </p>
          <ul className="space-y-2">
            {pendingTasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-background px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{t.nombre}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {t.projectNombre}
                    {t.relatedFileName && (
                      <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        📎 {t.relatedFileName}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                    Vence: {new Date(t.fechaTermino).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={acceptingId === t.id}
                    onClick={() => void handleAccept(t.id, true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/25 disabled:opacity-50 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                    Aceptar
                  </button>
                  <button
                    type="button"
                    disabled={acceptingId === t.id}
                    onClick={() => void handleAccept(t.id, false)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-600 ring-1 ring-red-500/20 transition hover:bg-red-500/20 disabled:opacity-50 dark:text-red-400"
                  >
                    <XCircle className="h-3 w-3" strokeWidth={2} />
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="relative min-w-[200px] max-w-md flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tarea, proyecto o empresa…"
              className="h-9 w-full rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:bg-background/80"
              aria-label="Filtrar tareas"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {searchQuery.trim() ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted"
                onClick={() => setSearchQuery("")}
              >
                <FilterX className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Limpiar
              </button>
            ) : null}
            <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5 dark:bg-muted/20">
              <button
                type="button"
                title="Vista tabla"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-sm dark:bg-background/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Lista
              </button>
              <button
                type="button"
                title="Vista fichas"
                onClick={() => setViewMode("cards")}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition ${
                  viewMode === "cards"
                    ? "bg-background text-foreground shadow-sm dark:bg-background/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Fichas
              </button>
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {filteredGlobalTasks.length} / {globalTasks.length}
            </span>
          </div>
        </div>

        {globalError && (
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{globalError}</div>
        )}

        {globalLoading ? (
          <p className="text-sm text-muted-foreground">Cargando tareas</p>
        ) : filteredGlobalTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {globalTasks.length === 0
              ? "No hay tareas visibles para tu usuario."
              : "Ninguna tarea coincide con la búsqueda."}
          </p>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/30 dark:bg-card/10">
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-[11px] text-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/40 dark:bg-muted/25">
                  <th className="w-[22%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Tarea</th>
                  <th className="w-[16%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Proyecto</th>
                  <th className="w-[12%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Empresa</th>
                  <th className="w-[18%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Responsables</th>
                  <th className="w-[10%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Estatus</th>
                  <th className="w-[10%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Vence</th>
                  <th className="w-[12%] px-2 py-2 font-semibold uppercase tracking-wide text-muted-foreground">Archivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredGlobalTasks.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border/50 transition hover:bg-muted/25 dark:hover:bg-muted/15"
                  >
                    <td className="px-2 py-1.5 align-middle">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className={`truncate font-medium ${t.completado ? "text-muted-foreground line-through" : ""}`}>
                          {t.nombre}
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">
                          {labelDiscipline(t.disciplina as TaskDiscipline)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      <Link
                        href="/proyectos"
                        className="line-clamp-2 font-medium text-accent underline-offset-2 hover:underline"
                        title="Abrir módulo Proyectos"
                      >
                        {t.projectNombre || "—"}
                      </Link>
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      <span className="line-clamp-2 text-muted-foreground">{empresaDisplay(t)}</span>
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      <AssigneeStack task={t} />
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      <TaskEstatusBadge task={t} />
                    </td>
                    <td className="px-2 py-1.5 align-middle tabular-nums text-muted-foreground">
                      {new Date(t.fechaTermino).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      {t.relatedFileName ? (
                        <span
                          className="inline-block max-w-[10rem] truncate rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          title={t.relatedFileName}
                        >
                          📎 {t.relatedFileName}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredGlobalTasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/15 p-3 dark:bg-muted/10"
              >
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${t.completado ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {t.nombre}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{labelDiscipline(t.disciplina as TaskDiscipline)}</p>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="shrink-0 font-medium uppercase tracking-wider text-muted-foreground">Proyecto</span>
                    <Link href="/proyectos" className="min-w-0 truncate font-medium text-accent underline-offset-2 hover:underline">
                      {t.projectNombre || "—"}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="shrink-0 font-medium uppercase tracking-wider text-muted-foreground">Empresa</span>
                    <span className="min-w-0 truncate text-muted-foreground">{empresaDisplay(t)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <TaskEstatusBadge task={t} />
                    <span className="tabular-nums text-muted-foreground">
                      Vence {new Date(t.fechaTermino).toLocaleDateString("es")}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border/40 pt-2">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Responsables</p>
                  <AssigneeStack task={t} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
