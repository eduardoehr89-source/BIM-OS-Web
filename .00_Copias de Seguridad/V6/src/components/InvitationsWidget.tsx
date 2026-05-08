"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

type Invitation = {
  id: string;
  resourceType: string;
  sender: { nombre: string };
};

export function InvitationsWidget() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // Polling simple cada 30s
    return () => clearInterval(interval);
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/invitations");
      if (res.ok) setInvitations(await res.json());
    } catch (e) {}
  }

  async function handleAction(id: string, action: "ACCEPT" | "REJECT") {
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {}
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {invitations.length > 0 && (
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-destructive" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-border/60 bg-background p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Invitaciones Pendientes
            </h3>
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {invitations.length === 0 ? (
              <p className="p-2 text-center text-xs text-muted-foreground">Nada pendiente.</p>
            ) : (
              invitations.map((inv) => (
                <div key={inv.id} className="mb-1 flex flex-col gap-2 rounded-lg bg-muted/40 p-3 text-xs">
                  <p className="text-foreground">
                    <span className="font-semibold">{inv.sender.nombre}</span> te invita a un{" "}
                    <span className="font-semibold">{inv.resourceType}</span>.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(inv.id, "ACCEPT")}
                      className="flex-1 rounded border border-border/60 bg-background py-1 font-medium transition hover:border-accent hover:text-accent"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleAction(inv.id, "REJECT")}
                      className="flex-1 rounded border border-border/60 bg-background py-1 font-medium transition hover:border-destructive hover:text-destructive"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
