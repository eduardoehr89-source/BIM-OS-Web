"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PendingTaskCard({ taskId, taskName, projectName }: { taskId: string, taskName: string, projectName: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    setBusy(true);
    try {
      const res = await fetch("/api/tasks/assignments/accept", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      if (!res.ok) throw new Error("Error al aceptar");
      toast.success("Tarea aceptada correctamente", {
        description: `Ya eres responsable de: ${taskName}`
      });
      router.refresh();
    } catch {
      toast.error("No se pudo aceptar la tarea");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/50 bg-background/50 p-4 shadow-sm dark:bg-background/20">
      <div>
        <p className="text-xs font-medium text-sky-600 dark:text-sky-400">{projectName}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{taskName}</p>
      </div>
      <button 
        onClick={handleAccept}
        disabled={busy}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2} />
        {busy ? "Aceptando..." : "Aceptar Tarea"}
      </button>
    </div>
  );
}
