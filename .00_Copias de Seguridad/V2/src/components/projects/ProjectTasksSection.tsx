"use client";

import { Check, Pencil, Trash2, Plus, X } from "lucide-react";
import { useState } from "react";
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

export function ProjectTasksSection({
  projectId,
  tasks,
  onChanged,
  disciplineOptions = DISCIPLINE_OPTIONS,
}: {
  projectId: string;
  tasks: TaskRow[];
  onChanged: () => void;
  disciplineOptions?: readonly TaskDiscipline[];
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
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear");
      setNombre("");
      setCompletado(false);
      setComentarios("");
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

        {/* Comentarios en fila separada pero compacta */}
        <label className="mt-2 block text-xs font-medium text-muted-foreground">
          Comentarios
          <input
            className={`${taField} w-full`}
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Opcional"
          />
          </label>
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
                    onCancel={() => setEditingId(null)}
                    onSaved={() => {
                      setEditingId(null);
                      onChanged();
                    }}
                  />
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-medium ${t.completado ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.nombre}</span>
                        <span className="rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-background/30">
                          {labelDiscipline(t.disciplina as TaskDiscipline)}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wide text-accent">{labelComplexity(t.complejidad as (typeof COMPLEXITY_OPTIONS)[number])}</span>
                      </div>
                      <p className="text-xs tabular-nums text-muted-foreground">Vence: {new Date(t.fechaTermino).toLocaleDateString("es")}</p>
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
  onCancel,
  onSaved,
}: {
  task: TaskRow;
  projectId: string;
  disciplineOptions: TaskDiscipline[];
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
      <label className="block text-xs font-medium text-muted-foreground">
        Comentarios
        <textarea className={`${taField} min-h-[60px]`} rows={2} value={comentarios} onChange={(e) => setComentarios(e.target.value)} />
      </label>
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
