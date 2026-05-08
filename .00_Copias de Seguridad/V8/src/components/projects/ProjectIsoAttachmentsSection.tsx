"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderPlus,
  Paperclip,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ISO_ATTACHMENT_CONTAINERS,
  ISO_ATTACHMENT_LABELS,
  type IsoAttachmentContainer,
} from "@/lib/iso-attachments-constants";

export type IsoAttachmentFileRow = {
  id: string;
  originalName: string;
  size: number;
  version: number;
  uploadedAt: string;
  attachment: { container: IsoAttachmentContainer; subfolderId: string | null } | null;
};

export type AttachmentSubfolderRow = {
  id: string;
  container: IsoAttachmentContainer;
  name: string;
};

type UploadTarget = { container: IsoAttachmentContainer; subfolderId: string | null };

type Props = {
  projectId: string;
  active: boolean;
  files: IsoAttachmentFileRow[];
  attachmentSubfolders: AttachmentSubfolderRow[];
  canEditFiles: boolean;
  canManageFolders: boolean;
  uploadBusy: boolean;
  setUploadBusy: (v: boolean) => void;
  onReload: () => Promise<void>;
  onError: (msg: string) => void;
  onTrash: (file: { id: string; name: string }) => void;
  onOpenIfc: (fileId: string) => void;
};

/** Etiquetas cortas tipo ACC / ISO en árbol */
const TREE_NODE_LABEL: Record<IsoAttachmentContainer, string> = {
  WIP: "01_WIP",
  SHARED: "02_SHARED",
  PUBLISHED: "03_PUBLISHED",
  ARCHIVED: "04_ARCHIVED",
};

function fileNameIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return FileText;
  if (ext === "xlsx" || ext === "xls" || ext === "csv") return FileSpreadsheet;
  return FileText;
}

export function ProjectIsoAttachmentsSection({
  projectId,
  active,
  files,
  attachmentSubfolders,
  canEditFiles,
  canManageFolders,
  uploadBusy,
  setUploadBusy,
  onReload,
  onError,
  onTrash,
  onOpenIfc,
}: Props) {
  const [expanded, setExpanded] = useState<Partial<Record<IsoAttachmentContainer, boolean>>>({});
  const [selected, setSelected] = useState<UploadTarget | null>(null);
  const [deleteSubfolder, setDeleteSubfolder] = useState<AttachmentSubfolderRow | null>(null);
  const [contentDragOver, setContentDragOver] = useState(false);
  const pendingTargetRef = useRef<UploadTarget | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!active || !projectId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/iso-structure/ensure`, { method: "POST" });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? "No se pudo preparar carpetas ISO");
        }
        if (!cancelled) await onReload();
      } catch (e) {
        if (!cancelled) onError(e instanceof Error ? e.message : "Error ISO");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active, projectId, onReload, onError]);

  const uploadFiles = useCallback(
    async (target: UploadTarget, list: FileList | File[]) => {
      const arr = Array.from(list).filter((f) => f.size > 0);
      if (arr.length === 0) return;
      setUploadBusy(true);
      try {
        const fd = new FormData();
        for (const f of arr) fd.append("files", f);
        fd.append("isoContainer", target.container);
        if (target.subfolderId) fd.append("isoSubfolderId", target.subfolderId);
        const res = await fetch(`/api/projects/${projectId}/files`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "Subida rechazada");
        }
        await onReload();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Error de subida");
      } finally {
        setUploadBusy(false);
        pendingTargetRef.current = null;
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [projectId, onReload, onError, setUploadBusy],
  );

  function openFilePicker() {
    if (!selected) return;
    pendingTargetRef.current = selected;
    queueMicrotask(() => fileInputRef.current?.click());
  }

  function onHiddenFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const t = pendingTargetRef.current;
    if (!t || !e.target.files?.length) return;
    void uploadFiles(t, e.target.files);
  }

  function toggleExpand(c: IsoAttachmentContainer, e: React.MouseEvent) {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [c]: !prev[c] }));
  }

  function selectRoot(container: IsoAttachmentContainer) {
    setSelected({ container, subfolderId: null });
  }

  function selectSubfolder(container: IsoAttachmentContainer, subfolderId: string) {
    setExpanded((prev) => ({ ...prev, [container]: true }));
    setSelected({ container, subfolderId });
  }

  async function createSubfolder() {
    if (!canManageFolders || !selected) return;
    const container = selected.container;
    const name = window.prompt("Nombre de la nueva carpeta:");
    if (!name?.trim()) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/attachment-subfolders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ container, name: name.trim() }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(j.error ?? "No se pudo crear la carpeta");
      await onReload();
      setExpanded((prev) => ({ ...prev, [container]: true }));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Error");
    }
  }

  async function confirmDeleteSubfolder() {
    if (!deleteSubfolder) return;
    const toDelete = deleteSubfolder;
    try {
      const res = await fetch(
        `/api/projects/${projectId}/attachment-subfolders/${toDelete.id}`,
        { method: "DELETE", credentials: "include" },
      );
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(j.error ?? "No se pudo eliminar");
      setDeleteSubfolder(null);
      if (selected?.subfolderId === toDelete.id) {
        setSelected({ container: toDelete.container, subfolderId: null });
      }
      await onReload();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Error");
      setDeleteSubfolder(null);
    }
  }

  const listForSelection = (() => {
    if (!selected) return [];
    return files.filter((f) => {
      if (!f.attachment || f.attachment.container !== selected.container) return false;
      const sid = f.attachment.subfolderId ?? null;
      return sid === (selected.subfolderId ?? null);
    });
  })();

  const selectionLabel = selected
    ? selected.subfolderId
      ? attachmentSubfolders.find((s) => s.id === selected.subfolderId)?.name ?? "Subcarpeta"
      : `${TREE_NODE_LABEL[selected.container]} · raíz`
    : null;

  const toolbarEnabled = selected !== null;
  const canNewFolder = canManageFolders && toolbarEnabled;
  const canAttach = canEditFiles && toolbarEnabled;

  return (
    <div className="flex min-h-[70vh] w-full flex-1 flex-col bg-transparent shadow-none">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.dwg,.ifc"
        multiple
        className="hidden"
        disabled={uploadBusy}
        onChange={onHiddenFileChange}
      />

      <ConfirmDialog
        open={deleteSubfolder !== null}
        title="Eliminar carpeta"
        message={
          deleteSubfolder
            ? `¿Eliminar «${deleteSubfolder.name}»? Los archivos pasan a la raíz del contenedor.`
            : ""
        }
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        requirePin={false}
        onCancel={() => setDeleteSubfolder(null)}
        onConfirm={() => void confirmDeleteSubfolder()}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/60 bg-transparent px-3 py-3">
        <button
          type="button"
          disabled={!canNewFolder || uploadBusy}
          onClick={() => void createSubfolder()}
          className="inline-flex h-10 min-h-10 items-center justify-center gap-2 rounded-md border-2 border-accent/80 bg-accent/10 px-4 text-sm font-semibold text-accent-foreground hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40 dark:text-foreground"
        >
          <FolderPlus className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={2} aria-hidden />
          Nueva carpeta
        </button>
        <button
          type="button"
          disabled={!canAttach || uploadBusy}
          onClick={() => openFilePicker()}
          className="inline-flex h-10 min-h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Paperclip className="h-[1.05rem] w-[1.05rem] shrink-0" strokeWidth={2} aria-hidden />
          {uploadBusy ? "Subiendo…" : "Adjuntar archivo"}
        </button>
        <span className="ml-auto text-xs text-muted-foreground">
          ISO 19650 · BEP/OIR en «Doc. PDF»
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Árbol — más ancho, más aire */}
        <nav
          className="w-[min(32%,20rem)] min-w-[200px] max-w-[22rem] shrink-0 border-r border-border/60 bg-muted/5 py-2 pl-2 pr-1"
          aria-label="Carpetas ISO"
        >
          <ul className="space-y-2 py-1">
            {ISO_ATTACHMENT_CONTAINERS.map((container) => {
              const subs = attachmentSubfolders.filter((s) => s.container === container);
              const isOpen = expanded[container] === true;
              const hasSubs = subs.length > 0;
              const isRootSel =
                selected?.container === container && selected.subfolderId === null;
              const meta = ISO_ATTACHMENT_LABELS[container];

              return (
                <li key={container} className="select-none">
                  <div
                    className={`flex items-center gap-1 rounded-md text-sm leading-snug ${
                      isRootSel ? "bg-muted/70 text-foreground" : "text-foreground/90"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex h-9 w-8 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-expanded={isOpen}
                      disabled={!hasSubs}
                      onClick={(e) => toggleExpand(container, e)}
                      title={hasSubs ? (isOpen ? "Contraer" : "Expandir") : ""}
                    >
                      {hasSubs ? (
                        isOpen ? (
                          <ChevronDown className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                        ) : (
                          <ChevronRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                        )
                      ) : (
                        <span className="inline-block w-[1.05rem]" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 py-2 pr-2 text-left hover:bg-muted/40"
                      onClick={() => selectRoot(container)}
                      title={meta.hint}
                    >
                      <Folder className="h-[1.05rem] w-[1.05rem] shrink-0 text-muted-foreground" strokeWidth={2} />
                      <span className="min-w-0 break-words font-medium leading-snug">{TREE_NODE_LABEL[container]}</span>
                    </button>
                  </div>
                  {isOpen && hasSubs ? (
                    <ul className="ml-2 mt-1 space-y-1.5 border-l border-border/50 pl-3">
                      {subs.map((sf) => {
                        const subSel =
                          selected?.container === container && selected.subfolderId === sf.id;
                        return (
                          <li key={sf.id}>
                            <div
                              className={`flex items-center gap-1 rounded-md py-1.5 pr-1 text-sm ${
                                subSel ? "bg-muted/70" : ""
                              }`}
                            >
                              <button
                                type="button"
                                className="flex min-w-0 flex-1 items-center gap-2 text-left leading-snug hover:bg-muted/30"
                                onClick={() => selectSubfolder(container, sf.id)}
                              >
                                <Folder className="h-[1.05rem] w-[1.05rem] shrink-0 text-muted-foreground" strokeWidth={2} />
                                <span className="min-w-0 break-words">{sf.name}</span>
                              </button>
                              {canManageFolders ? (
                                <button
                                  type="button"
                                  className="shrink-0 p-1 text-muted-foreground hover:text-destructive"
                                  title="Eliminar subcarpeta"
                                  onClick={() => setDeleteSubfolder(sf)}
                                >
                                  <Trash2 className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                                </button>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Contenido principal */}
        <div
          className={`min-h-0 flex-1 overflow-auto ${
            contentDragOver && canAttach ? "bg-muted/25" : "bg-transparent"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            if (canAttach && selected) setContentDragOver(true);
          }}
          onDragLeave={() => setContentDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setContentDragOver(false);
            if (!canAttach || !selected || uploadBusy) return;
            if (e.dataTransfer.files?.length) void uploadFiles(selected, e.dataTransfer.files);
          }}
        >
          {!selected ? (
            <p className="p-4 text-sm leading-relaxed text-muted-foreground">
              Selecciona una carpeta en el árbol para ver archivos y usar la barra de herramientas.
            </p>
          ) : (
            <>
              <div className="border-b border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                {selectionLabel}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Nombre</th>
                      <th className="px-3 py-2 font-medium">Versión</th>
                      <th className="px-3 py-2 font-medium">Tamaño</th>
                      <th className="px-3 py-2 font-medium">Ext.</th>
                      <th className="px-3 py-2 font-medium">Fecha</th>
                      <th className="px-3 py-2 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listForSelection.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          Sin archivos. Adjuntar o arrastrar aquí.
                        </td>
                      </tr>
                    ) : (
                      listForSelection.map((f) => {
                        const ext = "." + (f.originalName.split(".").pop()?.toLowerCase() || "");
                        const sizeMb = (f.size / (1024 * 1024)).toFixed(2) + " MB";
                        const dateObj = new Date(f.uploadedAt);
                        const dateStr =
                          dateObj.toLocaleDateString("es-ES") +
                          " " +
                          dateObj.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                        const Icon = fileNameIcon(f.originalName);
                        return (
                          <tr key={f.id} className="border-b border-border/50 hover:bg-muted/15">
                            <td className="px-3 py-2">
                              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                                <Icon className="h-[1.05rem] w-[1.05rem] shrink-0 text-muted-foreground" strokeWidth={2} />
                                {f.originalName}
                              </span>
                            </td>
                            <td className="px-3 py-2 tabular-nums text-muted-foreground">v{f.version}</td>
                            <td className="px-3 py-2 tabular-nums text-muted-foreground">{sizeMb}</td>
                            <td className="px-3 py-2 text-muted-foreground">{ext}</td>
                            <td className="px-3 py-2 tabular-nums text-muted-foreground">{dateStr}</td>
                            <td className="px-3 py-2 text-right">
                              {ext === ".ifc" ? (
                                <button
                                  type="button"
                                  onClick={() => onOpenIfc(f.id)}
                                  className="mr-2 text-xs font-medium text-accent underline-offset-2 hover:underline"
                                >
                                  Ver 3D
                                </button>
                              ) : (
                                <a
                                  href={`/api/files/${f.id}/download`}
                                  className="mr-2 text-xs font-medium text-accent underline-offset-2 hover:underline"
                                >
                                  Descargar
                                </a>
                              )}
                              {canEditFiles ? (
                                <button
                                  type="button"
                                  className="align-middle text-destructive hover:opacity-80"
                                  title="Papelera"
                                  onClick={() => onTrash({ id: f.id, name: f.originalName })}
                                >
                                  <Trash2 className="inline h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
