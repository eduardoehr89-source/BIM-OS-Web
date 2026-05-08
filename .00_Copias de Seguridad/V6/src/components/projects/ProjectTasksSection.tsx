"use client";

import { Check, Pencil, Trash2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TaskComplexity, TaskDiscipline, TaskActivity, TaskEstatus } from "@/generated/prisma";
import { ConfirmDialog, CONFIRM_DELETE_MESSAGE } from "@/components/ui/ConfirmDialog";
import { ShareButton } from "@/components/ShareButton";
import {
  ACTIVITY_OPTIONS,
  COMPLEXITY_OPTIONS,
  DISCIPLINE_OPTIONS,
  TASK_ESTATUS_OPTIONS,
  labelActivity,
  labelComplexity,
  labelDiscipline,
  labelTaskEstatus,
  mergeDisciplineSelectOptions,
} from "@/lib/project-enums";

export type CommentRow = {
  id: string;
  texto: string;
  createdAt: string;
  author: { nombre: string };
};

export type TaskRow = {
  id: string;
  nombre: string;
  disciplina: string;
  fechaTermino: string;
  complejidad: string;
  actividad: string;
  taskEstatus: string;
  completado: boolean;
  comentarios: string;
  comments?: CommentRow[];
  assignments?: {
    userId: string;
    isAccepted: boolean;
    user?: { nombre: string };
  }[];
};

const taField =
  "mt-1 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-0";

function ComplexitySegmented({
  value,
  onChange,
}: {
  value: TaskComplexity;
  onChange: (c: TaskComplexity) => void;
}) {
  return (
    <div className="mt-1 inline-flex flex-wrap gap-1 rounded-lg bg-muted/50 p-1 dark:bg-muted/25">
      {COMPLEXITY_OPTIONS.map((c) => (
        <button
          key={c}
          type="button"
          className={
            value === c
              ? "rounded-md bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm dark:bg-background/80"
              : "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          }
          onClick={() => onChange(c)}
        >
          {labelComplexity(c)}
        </button>
      ))}
    </div>
  );
}

function TaskComments({ task, onCommentAdded }: { task: TaskRow; onCommentAdded: () => void }) {
  const [texto, setTexto] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, taskId: task.id }),
      });
      if (res.ok) {
        setTexto("");
        onCommentAdded();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-border/40 pt-3 pl-1">
      {task.comments && task.comments.length > 0 && (
        <div className="mb-3 space-y-2">
          {task.comments.map((c) => (
            <div key={c.id} className="rounded-md bg-background/50 px-3 py-2 text-sm dark:bg-background/20">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-xs">{c.author.nombre}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("es")} {new Date(c.createdAt).toLocaleTimeString("es", {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="mt-1 text-muted-foreground text-xs">{c.texto}</p>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label className="block flex-1 text-xs font-medium text-muted-foreground">
          <input 
            className="mt-1 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-0" 
            value={texto} 
            onChange={(e) => setTexto(e.target.value)} 
            placeholder="Añadir comentario a la tarea..." 
          />
        </label>
        <button type="submit" disabled={busy || !texto.trim()} className="mb-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70 disabled:opacity-50">
          Enviar
        </button>
      </form>
    </div>
  );
}

export function ProjectTasksSection({
  projectId,
  tasks,
  onChanged,
  disciplineOptions = DISCIPLINE_OPTIONS,
  openCreateSignal = 0,
}: {
  projectId: string;
  tasks: TaskRow[];
  onChanged: () => void;
  disciplineOptions?: readonly TaskDiscipline[];
  /** Cada incremento abre el formulario de nueva tarea (p. ej. desde el header de la página). */
  openCreateSignal?: number;
}) {
  const defaultDiscipline = disciplineOptions[0] ?? "ARQUITECTURA";
  const [nombre, setNombre] = useState("");
  const [disciplina, setDisciplina] = useState<TaskDiscipline>(defaultDiscipline);
  const [fechaTermino, setFechaTermino] = useState(() => new Date().toISOString().slice(0, 10));
  const [complejidad, setComplejidad] = useState<TaskComplexity>(COMPLEXITY_OPTIONS[1]);
  const [actividad, setActividad] = useState<TaskActivity>(ACTIVITY_OPTIONS[0]);
  const [taskEstatus, setTaskEstatus] = useState<TaskEstatus>(TASK_ESTATUS_OPTIONS[0]);
  const [completado, setCompletado] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{id: string; nombre: string}[]>([]);
  const lastOpenSignal = useRef(0);

  useEffect(() => {
    fetch("/api/users/list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableUsers(data.map((u: any) => ({ id: u.id, nombre: u.nombre })));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (openCreateSignal <= 0) return;
    if (openCreateSignal === lastOpenSignal.current) return;
    lastOpenSignal.current = openCreateSignal;
    setShowCreateForm(true);
  }, [openCreateSignal]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          disciplina,
          fechaTermino: new Date(fechaTermino + "T12:00:00").toISOString(),
          complejidad,
          actividad,
          taskEstatus,
          completado,
          comentarios,
          userIds: selectedUsers,
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear");
      setNombre("");
      setCompletado(false);
      setComentarios("");
      setSelectedUsers([]);
      setShowCreateForm(false);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function patchTask(id: string, patch: Record<string, unknown>) {
    const res = await fetch(`/api/projects/${projectId}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("No se pudo actualizar");
    onChanged();
  }

  async function executeDeleteTask(id: string) {
    const res = await fetch(`/api/projects/${projectId}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo eliminar");
    onChanged();
    if (editingId === id) setEditingId(null);
  }

  async function confirmDeleteTask() {
    const id = pendingDeleteTaskId;
    if (!id) return;
    setPendingDeleteTaskId(null);
    try {
      await executeDeleteTask(id);
    } catch {
      /* falló borrado: estado ya cerrado el modal */
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <h3 className="text-sm font-semibold text-foreground">Tareas</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Plus className="h-4 w-4" strokeWidth={1.75} />}
          {showCreateForm ? "CANCELAR" : "NUEVA TAREA"}
        </button>
      </div>

      {showCreateForm && (
        <section className="rounded-2xl bg-muted/10 p-5 border border-border/40 mb-6">
          <form onSubmit={handleCreate}>
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Nueva tarea</p>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] items-end gap-2">
          {/* Nombre */}
          <label className="block text-xs font-medium text-muted-foreground">
            Nombre
            <input
              required
              className={taField}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          {/* Disciplina */}
          <label className="block text-xs font-medium text-muted-foreground">
            Disciplina
            <select
              className={`${taField} cursor-pointer`}
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value as TaskDiscipline)}
            >
              {disciplineOptions.map((d) => (
                <option key={d} value={d}>
                  {labelDiscipline(d)}
                </option>
              ))}
            </select>
          </label>

          {/* Actividad */}
          <label className="block text-xs font-medium text-muted-foreground">
            Actividad
            <select
              className={`${taField} cursor-pointer`}
              value={actividad}
              onChange={(e) => setActividad(e.target.value as TaskActivity)}
            >
              {ACTIVITY_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {labelActivity(a)}
                </option>
              ))}
            </select>
          </label>

          {/* Fecha */}
          <label className="block text-xs font-medium text-muted-foreground">
            Vence
            <input
              required
              type="date"
              className={`${taField} tabular-nums`}
              value={fechaTermino}
              onChange={(e) => setFechaTermino(e.target.value)}
            />
          </label>

          {/* Complejidad */}
          <label className="block text-xs font-medium text-muted-foreground">
            Complejidad
            <select
              className={`${taField} cursor-pointer`}
              value={complejidad}
              onChange={(e) => setComplejidad(e.target.value as TaskComplexity)}
            >
              {COMPLEXITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {labelComplexity(c)}
                </option>
              ))}
            </select>
          </label>

          {/* Estatus de tarea */}
          <label className="block text-xs font-medium text-muted-foreground">
            Estatus
            <select
              className={`${taField} cursor-pointer`}
              value={taskEstatus}
              onChange={(e) => setTaskEstatus(e.target.value as TaskEstatus)}
            >
              {TASK_ESTATUS_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {labelTaskEstatus(e)}
                </option>
              ))}
            </select>
          </label>

          {/* Boton submit */}
          <button
            type="submit"
            disabled={busy}
            className="self-end rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40 whitespace-nowrap"
          >
            Agregar
          </button>
        </div>

        {/* Comentarios y Responsables en fila separada pero compacta */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium text-muted-foreground">
            Comentarios
            <input
              className={`${taField} w-full`}
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Opcional"
            />
          </label>
          <div className="block text-xs font-medium text-muted-foreground">
            Responsables
            <div className="mt-1.5 flex flex-wrap gap-2">
              {availableUsers.map((u) => {
                const selected = selectedUsers.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        setSelectedUsers(prev => prev.filter(id => id !== u.id));
                      } else {
                        setSelectedUsers(prev => [...prev, u.id]);
                      }
                    }}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold transition ${
                      selected 
                        ? "bg-accent text-accent-foreground" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {u.nombre}
                  </button>
                );
              })}
              {availableUsers.length === 0 && <span className="text-muted-foreground/60">No hay usuarios disponibles</span>}
            </div>
          </div>
        </div>
        </form>
      </section>
      )}

      <div>
        {tasks.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Sin tareas registradas.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {tasks.map((t) => (
              <li key={t.id} className="rounded-xl bg-muted/40 px-4 py-4 dark:bg-muted/15">
                {editingId === t.id ? (
                  <EditTaskInline
                    task={t}
                    projectId={projectId}
                    disciplineOptions={mergeDisciplineSelectOptions(disciplineOptions, t.disciplina)}
                    availableUsers={availableUsers}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => {
                      setEditingId(null);
                      onChanged();
                    }}
                  />
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-medium ${t.completado ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.nombre}</span>
                          <span className="rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-background/30">
                            {labelDiscipline(t.disciplina as TaskDiscipline)}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-accent">{labelComplexity(t.complejidad as (typeof COMPLEXITY_OPTIONS)[number])}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs tabular-nums text-muted-foreground">Vence: {new Date(t.fechaTermino).toLocaleDateString("es")}</p>
                          {t.assignments && t.assignments.length > 0 && (
                            <div className="flex items-center gap-1.5 border-l border-border/40 pl-3">
                              {t.assignments.map((a) => (
                                <span 
                                  key={a.userId} 
                                  title={a.isAccepted ? "Responsable activo" : "Pendiente de aceptación"}
                                  className={`inline-flex h-5 items-center justify-center rounded-full bg-slate-800 px-2 text-[9px] font-bold tracking-wider text-slate-300 ring-1 ring-inset ${
                                    a.isAccepted ? "ring-sky-500/50" : "opacity-60 ring-slate-700 border-dashed"
                                  }`}
                                >
                                  {a.user?.nombre?.slice(0, 2).toUpperCase() || "??"}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {t.comentarios.trim() ? <p className="text-sm text-muted-foreground">{t.comentarios}</p> : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                      <ShareButton resourceType="TASK" resourceId={t.id} />
                      <button
                        type="button"
                        title={t.completado ? "Marcar pendiente" : "Marcar completada"}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => void patchTask(t.id, { completado: !t.completado })}
                      >
                        <Check className={`h-4 w-4 ${t.completado ? "text-accent" : ""}`} strokeWidth={1.75} />
                      </button>
                      <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setEditingId(t.id)}>
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button type="button" className="rounded-lg p-2 text-destructive hover:bg-muted" onClick={() => setPendingDeleteTaskId(t.id)}>
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                  {editingId !== t.id && (
                    <TaskComments task={t} onCommentAdded={onChanged} />
                  )}
                </>
              )}
            </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteTaskId !== null}
        title="Eliminar tarea"
        message={CONFIRM_DELETE_MESSAGE}
        onCancel={() => setPendingDeleteTaskId(null)}
        onConfirm={() => void confirmDeleteTask()}
      />
    </div>
  );
}

function EditTaskInline({
  task,
  projectId,
  disciplineOptions,
  availableUsers,
  onCancel,
  onSaved,
}: {
  task: TaskRow;
  projectId: string;
  disciplineOptions: TaskDiscipline[];
  availableUsers: { id: string; nombre: string }[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [nombre, setNombre] = useState(task.nombre);
  const [disciplina, setDisciplina] = useState<TaskDiscipline>(() => task.disciplina as TaskDiscipline);
  const [fechaTermino, setFechaTermino] = useState(new Date(task.fechaTermino).toISOString().slice(0, 10));
  const [complejidad, setComplejidad] = useState<TaskComplexity>(() => task.complejidad as TaskComplexity);
  const [actividad, setActividad] = useState<TaskActivity>(() => task.actividad as TaskActivity);
  const [taskEstatus, setTaskEstatus] = useState<TaskEstatus>(() => task.taskEstatus as TaskEstatus);
  const [completado, setCompletado] = useState(task.completado);
  const [comentarios, setComentarios] = useState(task.comentarios);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(() => task.assignments?.map(a => a.userId) || []);
  const [busy, setBusy] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          disciplina,
          fechaTermino: new Date(fechaTermino + "T12:00:00").toISOString(),
          complejidad,
          actividad,
          taskEstatus,
          completado,
          comentarios,
          userIds: selectedUsers,
        }),
      });
      if (!res.ok) throw new Error("Error");
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] items-end gap-2">
        <label className="block text-xs font-medium text-muted-foreground">
          Nombre
          <input required className={taField} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Disciplina
          <select
            className={`${taField} cursor-pointer`}
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value as TaskDiscipline)}
          >
            {disciplineOptions.map((d) => (
              <option key={d} value={d}>
                {labelDiscipline(d)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Actividad
          <select
            className={`${taField} cursor-pointer`}
            value={actividad}
            onChange={(e) => setActividad(e.target.value as TaskActivity)}
          >
            {ACTIVITY_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {labelActivity(a)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Vence
          <input required type="date" className={`${taField} tabular-nums`} value={fechaTermino} onChange={(e) => setFechaTermino(e.target.value)} />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Complejidad
          <select
            className={`${taField} cursor-pointer`}
            value={complejidad}
            onChange={(e) => setComplejidad(e.target.value as TaskComplexity)}
          >
            {COMPLEXITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {labelComplexity(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Estatus
          <select
            className={`${taField} cursor-pointer`}
            value={taskEstatus}
            onChange={(e) => setTaskEstatus(e.target.value as TaskEstatus)}
          >
            {TASK_ESTATUS_OPTIONS.map((e) => (
              <option key={e} value={e}>
                {labelTaskEstatus(e)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-muted-foreground">
          Comentarios
          <textarea className={`${taField} min-h-[60px]`} rows={2} value={comentarios} onChange={(e) => setComentarios(e.target.value)} />
        </label>
        <div className="block text-xs font-medium text-muted-foreground">
          Responsables
          <div className="mt-1.5 flex flex-wrap gap-2">
            {availableUsers.map((u) => {
              const selected = selectedUsers.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      setSelectedUsers(prev => prev.filter(id => id !== u.id));
                    } else {
                      setSelectedUsers(prev => [...prev, u.id]);
                    }
                  }}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold transition ${
                    selected 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {u.nombre}
                </button>
              );
            })}
            {availableUsers.length === 0 && <span className="text-muted-foreground/60">No hay usuarios disponibles</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-40">
          Guardar
        </button>
        <button type="button" className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
