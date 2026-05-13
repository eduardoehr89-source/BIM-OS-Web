"use client";

import { memo, useMemo } from "react";
import type { TaskRow } from "./ProjectTasksSection";

function GanttChartInner({ tasks }: { tasks: TaskRow[] }) {
  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (tasks.length === 0) return { minDate: new Date(), maxDate: new Date(), totalDays: 0 };
    
    // We assume the start date is 7 days before fechaTermino for display purposes if no start date exists.
    // Actually, ProjectTask has createdAt but it's not in TaskRow. We'll use a fixed start for demonstration, 
    // or just assume they started 3 days before their deadline if not available.
    let minD = new Date("2099-01-01").getTime();
    let maxD = new Date("1970-01-01").getTime();

    tasks.forEach(t => {
      const end = new Date(t.fechaTermino).getTime();
      const start = end - (7 * 24 * 60 * 60 * 1000); // assume 7 days duration
      if (start < minD) minD = start;
      if (end > maxD) maxD = end;
    });

    // Add some padding
    minD -= 2 * 24 * 60 * 60 * 1000;
    maxD += 2 * 24 * 60 * 60 * 1000;

    const totalDays = Math.max(1, Math.ceil((maxD - minD) / (1000 * 60 * 60 * 24)));

    return { minDate: new Date(minD), maxDate: new Date(maxD), totalDays };
  }, [tasks]);

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground p-4">Añade tareas para visualizar el cronograma.</p>;
  }

  return (
    <div className="overflow-x-auto pb-6">
      <div className="min-w-[700px] border border-border/60 rounded-xl bg-background overflow-hidden">
        {/* Header */}
        <div className="grid border-b border-border/60 bg-muted/40" style={{ gridTemplateColumns: `200px repeat(${totalDays}, minmax(12px, 1fr))` }}>
          <div className="p-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-r border-border/60">
            Tarea
          </div>
          {Array.from({ length: totalDays }).map((_, i) => {
            const d = new Date(minDate.getTime() + i * 24 * 60 * 60 * 1000);
            const isMonday = d.getDay() === 1;
            return (
              <div key={i} className={`text-[9px] text-center pt-2 text-muted-foreground ${isMonday ? 'border-l border-border/40 bg-muted/30' : ''}`}>
                {isMonday ? d.getDate() : ''}
              </div>
            );
          })}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/40">
          {tasks.map(t => {
            const end = new Date(t.fechaTermino).getTime();
            const start = end - (7 * 24 * 60 * 60 * 1000); // simulated duration
            
            const startDay = Math.floor((start - minDate.getTime()) / (1000 * 60 * 60 * 24));
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            return (
              <div key={t.id} className="grid items-center hover:bg-muted/10 transition-colors" style={{ gridTemplateColumns: `200px repeat(${totalDays}, minmax(12px, 1fr))` }}>
                <div className="p-2 border-r border-border/60 text-xs font-medium text-foreground truncate" title={t.nombre}>
                  {t.nombre}
                </div>
                {Array.from({ length: totalDays }).map((_, i) => {
                  const isTaskDay = i >= startDay && i <= startDay + duration;
                  const isStart = i === startDay;
                  const isEnd = i === startDay + duration;
                  
                  return (
                    <div key={i} className={`h-full py-1.5 px-[1px] ${new Date(minDate.getTime() + i * 86400000).getDay() === 1 ? 'border-l border-border/20' : ''}`}>
                      {isTaskDay && (
                        <div className={`h-4 bg-accent/80 w-full ${isStart ? 'rounded-l-sm' : ''} ${isEnd ? 'rounded-r-sm' : ''}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const GanttChart = memo(GanttChartInner);
