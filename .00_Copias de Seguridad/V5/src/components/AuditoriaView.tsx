"use client";

import { useEffect, useState } from "react";
import { Shield, Activity } from "lucide-react";

type AuditLogRow = {
  id: string;
  accion: "CREAR" | "EDITAR" | "BORRAR";
  recurso: string;
  detalles: string | null;
  timestamp: string;
  usuario: {
    nombre: string;
    tipo: string;
    rol: string;
  };
};

export function AuditoriaView() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/audit");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
            <Shield className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Log de Auditoría</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Trazabilidad de acciones críticas en el repositorio técnico. (Solo visible para Administradores).
            </p>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha / Hora</th>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Acción</th>
              <th className="px-4 py-3 font-medium">Recurso</th>
              <th className="px-4 py-3 font-medium">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Cargando...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Sin registros.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const dateObj = new Date(log.timestamp);
                const dateStr = dateObj.toLocaleDateString("es-ES") + " " + dateObj.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                return (
                  <tr key={log.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{dateStr}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{log.usuario.nombre}</td>
                    <td className="px-4 py-3 text-foreground">
                      <span className={`rounded px-2 py-0.5 text-[10px] tracking-wide font-medium ${log.accion === 'BORRAR' ? 'bg-destructive/10 text-destructive' : log.accion === 'CREAR' ? 'bg-accent/10 text-accent' : 'bg-muted text-foreground'}`}>
                        {log.accion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] tracking-wide text-foreground">
                        {log.recurso}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-sm truncate" title={log.detalles || ""}>
                      {log.detalles || "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
