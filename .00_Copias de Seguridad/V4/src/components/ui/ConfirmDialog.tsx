"use client";

import { useState } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  requirePin?: boolean;
  onConfirm: (pin?: string) => void;
  onCancel: () => void;
};

/**
 * Diálogo modal accesible; usa tokens del tema para modo claro y oscuro.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  confirmVariant = "destructive",
  requirePin = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [localPin, setLocalPin] = useState("");

  if (!open) return null;

  const confirmBtn =
    confirmVariant === "destructive"
      ? "rounded-lg bg-destructive px-4 py-2 text-xs font-medium text-destructive-foreground hover:opacity-90"
      : "rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground hover:opacity-90";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/35 backdrop-blur-[2px] dark:bg-zinc-950/60"
        aria-label={cancelLabel}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? "confirm-dialog-title" : undefined}
        aria-describedby="confirm-dialog-desc"
        className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background px-5 py-5 text-foreground shadow-sm"
      >
        {title ? (
          <h2 id="confirm-dialog-title" className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        ) : null}
        <p id="confirm-dialog-desc" className={`text-sm leading-relaxed text-muted-foreground ${title ? "mt-3" : ""}`}>
          {message}
        </p>
        {requirePin && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-muted-foreground">
              Tu PIN (Admin)
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                className="mt-1 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-0"
                value={localPin}
                onChange={(e) => setLocalPin(e.target.value)}
                placeholder="Confirma tu PIN"
              />
            </label>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            onClick={() => {
              setLocalPin("");
              onCancel();
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmBtn}
            disabled={requirePin && !localPin.trim()}
            onClick={() => {
              onConfirm(localPin);
              setLocalPin("");
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export const CONFIRM_DELETE_MESSAGE = "¿Estás seguro de que deseas eliminar este elemento?";
