"use client";

import { ArrowLeft, ClipboardList, FolderKanban } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProjectTasksSection, type TaskRow } from "@/components/projects/ProjectTasksSection";
import { useVoiceCommands } from "@/context/VoiceCommandsProvider";
import { notifyDataRefresh, subscribeDataRefresh } from "@/lib/data-sync";
import { TASK_AUTHORING_DISCIPLINES } from "@/lib/project-enums";
import { labelProjectStatus } from "@/lib/project-status";

type ClientOpt = { id: string; nombre: string };

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
    };
  });
}

export function TareasView() {
  const { searchQuery } = useVoiceCommands();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskReloadNonce, setTaskReloadNonce] = useState(0);

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
    return subscribeDataRefresh(() => {
      void loadProjects();
      setTaskReloadNonce((n) => n + 1);
    });
  }, [loadProjects]);

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

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.ubicacion.toLowerCase().includes(q) ||
        p.tipologia.toLowerCase().includes(q) ||
        p.client.nombre.toLowerCase().includes(q) ||
        String(p.ano).includes(q),
    );
  }, [projects, searchQuery]);

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
    setTaskReloadNonce((n) => n + 1);
    notifyDataRefresh({ reason: "projects" });
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
            <ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Contenedor de información · ISO 19650
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">TAREAS</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Jerarquía: selecciona un proyecto (activo contenedor) y gestiona entregables como tareas disciplina-fecha-complejidad, con nomenclatura y campos estructurados.
            </p>
          </div>
        </div>
      </header>

      {loadError && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">{loadError}</div>
      )}

      {!selectedProjectId ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">Selección de proyecto</h2>
            <span className="text-xs tabular-nums text-muted-foreground">
              {filteredProjects.length} / {projects.length}
            </span>
          </div>
          {loadingProjects ? (
            <p className="text-sm text-muted-foreground">Cargando proyectos</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay proyectos que coincidan. Crea uno en{" "}
              <Link href="/proyectos" className="font-medium text-accent underline-offset-4 hover:underline">
                Proyectos
              </Link>
              .
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {filteredProjects.map((p) => {
                const count = p.tasks?.length ?? 0;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(p.id)}
                      className="flex w-full flex-col gap-2 rounded-2xl bg-muted/40 px-4 py-4 text-left transition hover:bg-muted/60 dark:bg-muted/15 dark:hover:bg-muted/25"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                        <span className="truncate">{p.nombre}</span>
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{p.client.nombre}</span>
                      <span className="truncate text-xs text-muted-foreground">{p.ubicacion}</span>
                      <span className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] tabular-nums text-muted-foreground">
                        <span>{p.ano}</span>
                        <span>{labelProjectStatus(p.estatus)}</span>
                        <span>
                          {count} tarea{count === 1 ? "" : "s"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        <section className="space-y-8">
          <div className="flex flex-wrap items-start gap-4">
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Proyectos
            </button>
            <div className="min-w-0 flex-1 border-l border-border/60 pl-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Proyecto activo</p>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{selectedMeta?.nombre ?? "Proyecto"}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {[selectedMeta?.client.nombre, selectedMeta?.ubicacion, selectedMeta ? labelProjectStatus(selectedMeta.estatus) : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          <div className="border-t border-border/60 pt-8">
            <p className="mb-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Registro de entregables (nombre · disciplina · fecha · complejidad · estado)
            </p>
            {tasksLoading ? (
              <p className="text-sm text-muted-foreground">Cargando tareas</p>
            ) : (
              <ProjectTasksSection
                projectId={selectedProjectId}
                tasks={tasks}
                disciplineOptions={TASK_AUTHORING_DISCIPLINES}
                onChanged={handleTasksChanged}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
