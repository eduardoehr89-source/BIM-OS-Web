import { FolderOpen, LayoutDashboard, Percent, ListChecks, Users } from "lucide-react";
import Link from "next/link";
import { ProjectStatus, TaskEstatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { labelProjectStatus } from "@/lib/project-status";
import { labelTaskEstatus } from "@/lib/project-enums";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PendingTaskCard } from "@/components/dashboard/PendingTaskCard";

export const dynamic = "force-dynamic";

/** Orden fijo alineado con `enum ProjectStatus` en schema.prisma. */
const PROJECT_STATUS_ORDER = [
  ProjectStatus.INCOMPLETO,
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

  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.tipo === "ADMIN";

  const resourceWhere = isAdmin 
    ? {} 
    : {
        OR: [{ ownerId: userId }, { sharedWith: { some: { id: userId } } }],
      };

  const tasksWhere = isAdmin
    ? {}
    : {
        OR: [
          { ownerId: userId },
          { assignments: { some: { userId, isAccepted: true } } }
        ]
      };

  let total = 0;
  let terminados = 0;
  let countsByStatus: Record<string, number> = {};
  let totalClientes = 0;
  let tasksTotal = 0;
  let countsByTaskEstatus: Record<string, number> = {};
  let workload: { nombre: string; count: number }[] = [];
  let pendingTasks: { id: string; nombre: string; project: { nombre: string } }[] = [];
  let loadError: string | null = null;

  try {
    const [t, term, grouped, tc, tt, groupedTasks, pendingAssign] = await Promise.all([
      prisma.project.count({ where: resourceWhere }),
      prisma.project.count({
        where: { ...resourceWhere, estatus: ProjectStatus.TERMINADO },
      }),
      prisma.project.groupBy({
        by: ["estatus"],
        where: resourceWhere,
        _count: { id: true },
      }),
      prisma.client.count({ where: resourceWhere }),
      prisma.projectTask.count({ where: tasksWhere }),
      prisma.projectTask.groupBy({
        by: ["taskEstatus"],
        where: tasksWhere,
        _count: { id: true },
      }),
      prisma.projectTask.findMany({
        where: {
          assignments: { some: { userId, isAccepted: false } }
        },
        select: { id: true, nombre: true, project: { select: { nombre: true } } }
      }),
    ]);

    total = t;
    terminados = term;
    countsByStatus = Object.fromEntries(grouped.map((g) => [g.estatus, g._count.id]));
    totalClientes = tc;
    tasksTotal = tt;
    countsByTaskEstatus = Object.fromEntries(groupedTasks.map((g) => [g.taskEstatus, g._count.id]));
    pendingTasks = pendingAssign;

    if (isAdmin) {
      const tasksByOwner = await prisma.projectTask.groupBy({
        by: ["ownerId"],
        _count: { id: true },
        where: { completado: false },
      });
      const ownerIds = tasksByOwner.map((g) => g.ownerId).filter(Boolean) as string[];
      const ownersInfo =
        ownerIds.length > 0
          ? await prisma.user.findMany({
              where: { id: { in: ownerIds } },
              select: { id: true, nombre: true },
            })
          : [];
      const ownerMap = Object.fromEntries(ownersInfo.map((o) => [o.id, o.nombre]));
      workload = tasksByOwner
        .map((g) => ({
          nombre: g.ownerId ? ownerMap[g.ownerId] ?? "Usuario" : "Sin asignar",
          count: g._count.id,
        }))
        .sort((a, b) => b.count - a.count);
    }
  } catch (e) {
    console.error("[DashboardPage] Prisma", e);
    loadError = "No se pudieron cargar las estadísticas. Los datos se muestran en cero; recarga o revisa la base de datos.";
  }

  const avanceGlobal = total === 0 ? 0 : Math.round((terminados / total) * 100);
  const orden = [...PROJECT_STATUS_ORDER];
  const maxBar = Math.max(1, ...orden.map((k) => countsByStatus[k] ?? 0));
  const TASK_ESTATUS_ORDER: TaskEstatus[] = ["PENDIENTE", "EN_PROCESO", "PAUSADA", "COMPLETADA"];
  const maxWorkload = workload.length > 0 ? Math.max(1, ...workload.map((w) => w.count)) : 1;

  return (
    <div className="space-y-10">
      {loadError ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
          {loadError}
        </div>
      ) : null}

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl bg-muted/50 px-5 py-4 dark:bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <p className="text-xs font-medium uppercase tracking-wide">Proyectos</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total registrados</p>
        </article>

        <article className="rounded-2xl bg-muted/50 px-5 py-4 dark:bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg
              className="h-4 w-4"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-xs font-medium uppercase tracking-wide">Clientes</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{totalClientes}</p>
          <p className="mt-1 text-xs text-muted-foreground">Registrados</p>
        </article>

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
      
      {pendingTasks.length > 0 && (
        <section className="rounded-2xl border border-sky-500/20 bg-sky-500/5 px-5 py-5 dark:border-sky-400/20 dark:bg-sky-400/5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            <h2 className="text-sm font-semibold text-foreground">Bandeja de entrada</h2>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Tienes tareas pendientes de aceptar</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pendingTasks.map(t => (
              <PendingTaskCard key={t.id} taskId={t.id} taskName={t.nombre} projectName={t.project.nombre} />
            ))}
          </div>
        </section>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-2">
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
                    <div
                      className="h-full rounded-full bg-accent/80 transition-[width] dark:bg-accent/70"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs tabular-nums text-foreground">
                    {n} <span className="text-[10px] text-muted-foreground">({pctReal}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-muted/40 px-5 py-5 dark:bg-muted/20">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Resumen de tareas</h2>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Distribucion por estado operativo — {tasksTotal} total
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {TASK_ESTATUS_ORDER.map((est) => {
              const n = countsByTaskEstatus[est] ?? 0;
              return (
                <div key={est} className="rounded-xl bg-background/60 px-3 py-2 dark:bg-background/20">
                  <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {labelTaskEstatus(est)}
                  </p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{n}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {isAdmin && (
        <section className="rounded-2xl bg-muted/40 px-5 py-5 dark:bg-muted/20">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Carga de trabajo del equipo</h2>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Tareas activas (no completadas) por usuario</p>
          <div className="mt-4 space-y-3">
            {workload.length === 0 ? (
              <p className="text-xs text-muted-foreground">No hay tareas activas.</p>
            ) : (
              workload.map((w, i) => {
                const barWidth = maxWorkload > 0 ? Math.round((w.count / maxWorkload) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 truncate text-[11px] font-medium tracking-wide text-muted-foreground">
                      {w.nombre}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background/70 dark:bg-background/30">
                      <div
                        className="h-full rounded-full bg-accent/80 transition-[width] dark:bg-accent/70"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs tabular-nums text-foreground">
                      {w.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
