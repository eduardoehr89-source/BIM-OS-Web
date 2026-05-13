import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, verifyToken } from "@/lib/auth";
import { labelTaskEstatus } from "@/lib/project-enums";
import { labelRolProfesional } from "@/lib/professional-roles";
import type { TaskEstatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${dd}/${mm}/${y}`;
}

export default async function UsuarioDetallePage({ params }: Props) {
  const { id } = await params;
  const viewerId = await getCurrentUserId();
  if (!viewerId) redirect("/login");

  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.tipo === "ADMIN";

  if (!isAdmin && viewerId !== id) {
    redirect("/usuarios");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      tipo: true,
      rol: true,
      client: { select: { nombre: true } },
      createdAt: true,
    },
  });
  if (!user) notFound();

  const assignedTasks = await prisma.projectTask.findMany({
    where: {
      assignments: { some: { userId: id } },
    },
    orderBy: [{ fechaTermino: "asc" }, { nombre: "asc" }],
    include: {
      project: { select: { id: true, nombre: true } },
      assignments: {
        where: { userId: id },
        select: { isAccepted: true, assignedAt: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-6">
      <div>
        <Link
          href="/usuarios"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          ← Volver a usuarios
        </Link>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{user.nombre}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.tipo} · {labelRolProfesional(user.rol ?? "")}
          {user.client?.nombre ? ` · ${user.client.nombre}` : ""}
        </p>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/40 px-5 py-5">
        <h2 className="text-sm font-semibold text-foreground">Tareas asignadas</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Incluye asignaciones pendientes de aceptar y ya aceptadas.
        </p>

        {assignedTasks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No hay tareas asignadas a este usuario.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tarea
                  </th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Proyecto
                  </th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Vence
                  </th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Asignación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {assignedTasks.map((t) => {
                  const mine = t.assignments[0];
                  const est = t.taskEstatus as TaskEstatus;
                  return (
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="px-3 py-2 font-medium text-foreground">{t.nombre}</td>
                      <td className="px-3 py-2 text-muted-foreground">{t.project.nombre}</td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">
                        {formatDate(t.fechaTermino)}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{labelTaskEstatus(est)}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            mine?.isAccepted
                              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400"
                              : "border border-dashed border-muted-foreground/40 bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {mine?.isAccepted ? "Aceptada" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
