"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  ChevronDown,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderPlus,
  Paperclip,
  Trash2,
  UserPlus,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ISO_ATTACHMENT_CONTAINERS,
  ISO_ATTACHMENT_LABELS,
  type IsoAttachmentContainer,
} from "@/lib/iso-attachments-constants";
import { TECHNICAL_UPLOAD_ACCEPT } from "@/lib/technical-upload-constants";

export type IsoAttachmentFileRow = {
  id: string;
  originalName: string;
  size: number;
  version: number;
  uploadedAt: string;
  /** Nombre del usuario que subió la versión actual (último evento de subida). */
  uploadedByNombre?: string | null;
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
  /** Reservado; la estructura ISO se asegura al montar el proyecto, no al cambiar de pestaña. */
  active?: boolean;
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

type UserOpt = { id: string; nombre: string };

function ProjectIsoAttachmentsSectionInner({
  projectId,
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

  // Selector de usuario asignado
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [assignedUserId, setAssignedUserId] = useState("");

  useEffect(() => {
    // for-assignment devuelve todos los usuarios (cualquier rol con sesión)
    fetch("/api/users/for-assignment", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setUsers(
            (data as Record<string, unknown>[]).map((u) => ({
              id: String(u.id ?? ""),
              nombre: String(u.nombre ?? ""),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  /** Una sola vez por proyecto al abrirlo (componente montado con este projectId), no al cambiar de pestaña. */
  useEffect(() => {
    if (!projectId) return;
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
  }, [projectId, onReload, onError]);

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
        // Si hay usuario seleccionado, enviar para crear tarea REVISAR
        if (assignedUserId) fd.append("assignedUserId", assignedUserId);
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
    [projectId, onReload, onError, setUploadBusy, assignedUserId],
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
    <div className="flex min-h-[70vh] w-full min-w-0 flex-1 flex-col bg-transparent shadow-none">
      <input
        ref={fileInputRef}
        type="file"
        accept={TECHNICAL_UPLOAD_ACCEPT}
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

        {/* Selector de asignado — siempre visible si canAttach */}
        {canAttach && (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <UserPlus className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <select
              id="attach-assign-user"
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
              title="Asignar revisor (opcional — crea tarea REVISAR automáticamente)"
            >
              <option value="">Sin asignar (no crea tarea)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
            {assignedUserId && (
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                ✓ Creará tarea REVISAR
              </span>
            )}
          </label>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          ISO 19650 · BEP/OIR en «Doc. PDF»
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Árbol — 160px fijo, sin hueco a la izquierda */}
        <nav
          className="box-border !w-[160px] !max-w-[160px] shrink-0 grow-0 overflow-hidden border-r border-border/60 bg-muted/5 py-1.5 pl-0 pr-0"
          aria-label="Carpetas ISO"
        >
          <ul className="space-y-1.5 py-0 pl-0">
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
                    className={`flex min-w-0 items-center gap-0 rounded-md text-sm leading-snug ${
                      isRootSel ? "bg-muted/70 text-foreground" : "text-foreground/90"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex h-7 w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-expanded={isOpen}
                      disabled={!hasSubs}
                      onClick={(e) => toggleExpand(container, e)}
                      title={hasSubs ? (isOpen ? "Contraer" : "Expandir") : ""}
                    >
                      {hasSubs ? (
                        isOpen ? (
                          <ChevronDown className="h-3 w-3" strokeWidth={2} />
                        ) : (
                          <ChevronRight className="h-3 w-3" strokeWidth={2} />
                        )
                      ) : (
                        <span className="inline-block w-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden py-1.5 pr-0.5 text-left hover:bg-muted/40"
                      onClick={() => selectRoot(container)}
                      title={`${TREE_NODE_LABEL[container]} — ${meta.hint}`}
                    >
                      <Folder className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={2} />
                      <span className="min-w-0 truncate font-medium leading-snug">{TREE_NODE_LABEL[container]}</span>
                    </button>
                  </div>
                  {isOpen && hasSubs ? (
                    <ul className="mt-0.5 space-y-0.5 border-l border-border/50 pl-1">
                      {subs.map((sf) => {
                        const subSel =
                          selected?.container === container && selected.subfolderId === sf.id;
                        return (
                          <li key={sf.id}>
                            <div
                              className={`flex min-w-0 items-center gap-0 rounded-md py-0.5 pr-0 text-sm ${
                                subSel ? "bg-muted/70" : ""
                              }`}
                            >
                              <button
                                type="button"
                                className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden py-0.5 text-left leading-snug hover:bg-muted/30"
                                onClick={() => selectSubfolder(container, sf.id)}
                                title={sf.name}
                              >
                                <Folder className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={2} />
                                <span className="min-w-0 truncate">{sf.name}</span>
                              </button>
                              {canManageFolders ? (
                                <button
                                  type="button"
                                  className="shrink-0 p-0.5 text-muted-foreground hover:text-destructive"
                                  title="Eliminar subcarpeta"
                                  onClick={() => setDeleteSubfolder(sf)}
                                >
                                  <Trash2 className="h-3 w-3" strokeWidth={2} />
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

        {/* Panel archivos — sin scroll horizontal */}
        <div
          className={`min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto ${
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
              <div className="min-w-0">
                <table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
                  <colgroup>
                    <col />
                    <col style={{ width: "5rem" }} />
                    <col style={{ width: "2.75rem" }} />
                    <col style={{ width: "4.5rem" }} />
                    <col style={{ width: "2.5rem" }} />
                    <col style={{ width: "7rem" }} />
                    <col style={{ width: "7rem" }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-border bg-muted/10 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="min-w-0 px-2 py-1.5 font-medium">Nombre</th>
                      <th className="px-1 py-1.5 font-medium">Subido</th>
                      <th className="px-1 py-1.5 font-medium">Ver.</th>
                      <th className="px-1 py-1.5 font-medium">Tam.</th>
                      <th className="px-1 py-1.5 font-medium">Ext</th>
                      <th className="px-1 py-1.5 font-medium">Fecha</th>
                      <th className="px-1 py-1.5 text-right font-medium">Acc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listForSelection.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-2 py-6 text-center text-sm text-muted-foreground">
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
                            <td className="min-w-0 overflow-hidden px-2 py-1.5">
                              <span className="flex min-w-0 max-w-full items-center gap-1.5 font-medium text-foreground">
                                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                                <span
                                  className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                                  title={f.originalName}
                                >
                                  {f.originalName}
                                </span>
                              </span>
                            </td>
                            <td className="overflow-hidden px-1 py-1.5 text-xs text-muted-foreground">
                              <span className="block truncate" title={f.uploadedByNombre ?? ""}>
                                {f.uploadedByNombre?.trim() ? f.uploadedByNombre : "—"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-1 py-1.5 text-xs tabular-nums text-muted-foreground">
                              v{f.version}
                            </td>
                            <td className="whitespace-nowrap px-1 py-1.5 text-xs tabular-nums text-muted-foreground">
                              {sizeMb}
                            </td>
                            <td className="truncate px-1 py-1.5 text-xs text-muted-foreground" title={ext}>
                              {ext}
                            </td>
                            <td className="whitespace-nowrap px-1 py-1.5 text-xs tabular-nums text-muted-foreground">
                              {dateStr}
                            </td>
                            <td className="whitespace-nowrap px-1 py-1.5 text-right text-xs">
                              {ext === ".ifc" ? (
                                <button
                                  type="button"
                                  onClick={() => onOpenIfc(f.id)}
                                  className="mr-1 inline-flex items-center justify-center rounded text-accent hover:bg-muted/50 hover:opacity-90"
                                  title="Ver modelo 3D"
                                >
                                  <Box className="h-3.5 w-3.5" strokeWidth={2} />
                                </button>
                              ) : (
                                <a
                                  href={`/api/files/${f.id}/download`}
                                  className="mr-1 inline-flex items-center justify-center rounded text-accent hover:bg-muted/50 hover:opacity-90"
                                  title="Descargar"
                                >
                                  <Download className="h-3.5 w-3.5" strokeWidth={2} />
                                </a>
                              )}
                              {canEditFiles ? (
                                <button
                                  type="button"
                                  className="align-middle text-destructive hover:opacity-80"
                                  title="Papelera"
                                  onClick={() => onTrash({ id: f.id, name: f.originalName })}
                                >
                                  <Trash2 className="inline h-3.5 w-3.5" strokeWidth={2} />
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

export const ProjectIsoAttachmentsSection = memo(ProjectIsoAttachmentsSectionInner);
