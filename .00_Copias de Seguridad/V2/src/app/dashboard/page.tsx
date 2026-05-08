import { FolderOpen, LayoutDashboard, Percent, ListChecks } from "lucide-react";
import Link from "next/link";
import { ProjectStatus, TaskEstatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { labelProjectStatus, } from "@/lib/project-status";
import { labelTaskEstatus } from "@/lib/project-enums";
import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

/** Orden fijo alineado con `enum ProjectStatus` en schema.prisma (solo miembros del enum generado). */
const PROJECT_STATUS_ORDER = [
  ProjectStatus.INICIO_PENDIENTE,
  ProjectStatus.EN_PROCESO,
  ProjectStatus.PAUSADO,
  ProjectStatus.TERMINADO,
  ProjectStatus.CANCELADO,
] as const;

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const projectWhere = {
    OR: [
      { ownerId: userId },
      { sharedWith: { some: { id: userId } } }
    ]
  };

  const total = await prisma.project.count({ where: projectWhere });
  const terminados = await prisma.project.count({
    where: { ...projectWhere, estatus: ProjectStatus.TERMINADO },
  });
  const avanceGlobal = total === 0 ? 0 : Math.round((terminados / total) * 100);

  const grouped = await prisma.project.groupBy({
    by: ["estatus"],
    where: projectWhere,
    _count: { id: true },
  });

  const countsByStatus = Object.fromEntries(grouped.map((g) => [g.estatus, g._count.id])) as Record<
    string,
    number
  >;

  const totalClientes = await prisma.client.count({ where: projectWhere });

  // ── Resumen de tareas por estatus (Privacidad Estricta) ──
  const taskWhere = { ownerId: userId };
  const TASK_ESTATUS_ORDER: TaskEstatus[] = ["PENDIENTE", "EN_PROCESO", "PAUSADA", "COMPLETADA"];
  const tasksTotal = await prisma.projectTask.count({ where: taskWhere });
  const groupedTasks = await prisma.projectTask.groupBy({
    by: ["taskEstatus"],
    where: taskWhere,
    _count: { id: true },
  });
  const countsByTaskEstatus = Object.fromEntries(
    groupedTasks.map((g) => [g.taskEstatus, g._count.id])
  ) as Record<string, number>;

  const orden = [...PROJECT_STATUS_ORDER];
  const maxBar = Math.max(1, ...orden.map((k) => countsByStatus[k] ?? 0));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
          <LayoutDashboard className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Cartera de proyectos y avance global según estado operativo.
          </p>
        </div>
      </div>

      {/* ── Métricas principales ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Proyectos totales */}
        <article className="rounded-2xl bg-muted/50 px-5 py-4 dark:bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <p className="text-xs font-medium uppercase tracking-wide">Proyectos</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total registrados</p>
        </article>

        {/* Clientes */}
        <article className="rounded-2xl bg-muted/50 px-5 py-4 dark:bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="h-4 w-4" strokeWidth={1.75} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-xs font-medium uppercase tracking-wide">Clientes</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{totalClientes}</p>
          <p className="mt-1 text-xs text-muted-foreground">Registrados</p>
        </article>

        {/* Avance global */}
        <article className="rounded-2xl bg-muted/50 px-5 py-4 dark:bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <p className="text-xs font-medium uppercase tracking-wide">Avance global</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{avanceGlobal}%</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/80 dark:bg-background/40">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${avanceGlobal}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Terminados: {terminados} / {total}
          </p>
        </article>

        {/* Acceso rápido */}
        <article className="rounded-2xl bg-muted/50 px-5 py-4 dark:bg-muted/30">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Acceso rapido</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/proyectos" className="font-medium text-accent underline-offset-4 hover:underline">
              Gestionar proyectos
            </Link>
            <Link href="/clientes" className="font-medium text-accent underline-offset-4 hover:underline">
              Gestionar clientes
            </Link>
          </div>
        </article>
      </div>

      {/* ── Secciones Secundarias (Grid comprimido) ── */}
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        {/* ── Distribución por estatus ── */}
        <section className="rounded-2xl bg-muted/40 px-5 py-5 dark:bg-muted/20">
          <h2 className="text-sm font-semibold text-foreground">Estatus de proyectos</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Distribución porcentual por estado operativo</p>
          <div className="mt-4 space-y-3">
            {orden.map((key) => {
              const n = countsByStatus[key] ?? 0;
              const pctReal = total > 0 ? Math.round((n / total) * 100) : 0;
              const barWidth = maxBar > 0 ? Math.round((n / maxBar) * 100) : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {labelProjectStatus(key)}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background/70 dark:bg-background/30">
                    <div className="h-full rounded-full bg-accent/80 dark:bg-accent/70 transition-[width]" style={{ width: `${barWidth}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs tabular-nums text-foreground">
                    {n} <span className="text-[10px] text-muted-foreground">({pctReal}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Resumen de tareas ── */}
        <section className="rounded-2xl bg-muted/40 px-5 py-5 dark:bg-muted/20">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Resumen de tareas</h2>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Distribucion por estado operativo — {tasksTotal} total</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {TASK_ESTATUS_ORDER.map((est) => {
              const n = countsByTaskEstatus[est] ?? 0;
              return (
                <div key={est} className="rounded-xl bg-background/60 px-3 py-2 dark:bg-background/20">
                  <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{labelTaskEstatus(est)}</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{n}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
