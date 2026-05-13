"use client";

import { Brain, FileText, Loader2, Network, Trash2, UserPlus } from "lucide-react";
import { memo, useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { NIP_DIGITS } from "@/lib/nip-validation";
import { TECH_DOC_OPTIONS, labelTechnicalDocType } from "@/lib/project-enums";
import { TECHNICAL_UPLOAD_ACCEPT } from "@/lib/technical-upload-constants";

function MermaidViewer({ code, onClose }: { code: string; onClose: () => void }) {
  const renderId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "default" });
    if (containerRef.current && code) {
      const svgId = `mermaid-svg-${renderId}`;
      mermaid
        .render(svgId, code)
        .then((result) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg;
          }
        })
        .catch((e: Error) => {
          if (containerRef.current) {
            containerRef.current.innerText = "Error renderizando diagrama: " + e.message;
          }
        });
    }
  }, [code, renderId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background max-h-full max-w-4xl overflow-auto rounded-xl p-6 shadow-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Diagrama Mermaid</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">Cerrar</button>
        </div>
        <div ref={containerRef} className="flex justify-center" />
      </div>
    </div>
  );
}

function AnalysisMarkdownViewer({ markdown, onClose }: { markdown: string; onClose: () => void }) {
  const components: Components = {
    code(props) {
      const { className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      const lang = match?.[1] ?? "";
      const codeText = String(children).replace(/\n$/, "");
      if (!match) {
        return (
          <code className="rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-[0.85em]" {...rest}>
            {children}
          </code>
        );
      }
      const prismLang =
        lang === "diff" ? "diff" : lang === "mermaid" ? "markdown" : lang || "text";
      return (
        <SyntaxHighlighter
          language={prismLang}
          style={oneLight}
          customStyle={{
            margin: "0.75rem 0",
            borderRadius: 8,
            fontSize: 13,
            border: "1px solid hsl(var(--border) / 0.5)",
          }}
          PreTag="div"
        >
          {codeText}
        </SyntaxHighlighter>
      );
    },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border/60 shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3">
          <h2 className="text-lg font-semibold">Análisis IA (BEP)</h2>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
            Cerrar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-muted/15 px-4 py-4 text-foreground [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-2 [&_p]:text-sm [&_li]:text-sm [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1.5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

type FileWithTech = {
  id: string;
  originalName: string;
  size: number;
  technicalDocType?: string | null;
  version: number;
  uploadedAt: string;
  uploadEvents?: { uploader: { nombre: string } | null }[];
};

function ProjectTechnicalDocsSectionInner({
  projectId,
  files,
  onChanged,
  onError,
  isAdmin,
}: {
  projectId: string;
  files: FileWithTech[];
  onChanged: () => void;
  onError?: (msg: string | null) => void;
  isAdmin?: boolean;
}) {
  const [docType, setDocType] = useState(TECH_DOC_OPTIONS[0]);
  const [busy, setBusy] = useState(false);
  const [useIso, setUseIso] = useState(false);
  
  // ISO Fields
  const [isoProy, setIsoProy] = useState("");
  const [isoOrg, setIsoOrg] = useState("");
  const [isoVol, setIsoVol] = useState("");
  const [isoNiv, setIsoNiv] = useState("");
  const [isoTipo, setIsoTipo] = useState("");
  const [isoRol, setIsoRol] = useState("");
  const [isoNum, setIsoNum] = useState("");
  const [trashDocId, setTrashDocId] = useState<string | null>(null);

  const [auditMarkdown, setAuditMarkdown] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<{ fileId: string; action: "audit" | "mermaid" } | null>(null);

  // Selector de usuario asignado
  const [users, setUsers] = useState<{ id: string; nombre: string }[]>([]);
  const [assignedUserId, setAssignedUserId] = useState("");

  useEffect(() => {
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

  const generatedIso = `${isoProy}-${isoOrg}-${isoVol}-${isoNiv}-${isoTipo}-${isoRol}-${isoNum}`.toUpperCase();
  const isIsoValid = isoProy.length > 0 && isoOrg.length > 0 && isoVol.length > 0 && isoNiv.length > 0 && isoTipo.length > 0 && isoRol.length > 0 && isoNum.length > 0;

  async function handleAIAction(fileId: string, action: "audit" | "mermaid") {
    setAiLoading({ fileId, action });
    try {
      const mode = action === "audit" ? "analysis" : "mermaid";
      const aiRes = await fetch(`/api/projects/${projectId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, mode }),
      });
      if (!aiRes.ok) {
        const err = (await aiRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || "Error en IA");
      }

      const data = (await aiRes.json()) as { markdown?: string; mermaid?: string; mode?: string };
      if (action === "audit") {
        if (data.markdown) setAuditMarkdown(data.markdown);
      } else if (data.mermaid) {
        setMermaidCode(data.mermaid);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        onError?.(e.message);
      } else {
        onError?.("Error en IA");
      }
    } finally {
      setAiLoading(null);
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;
    
    if (useIso && !isIsoValid) {
      onError?.("Por favor, completa todos los campos del estándar ISO 19650.");
      e.target.value = "";
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("technicalDocType", docType);
      for (const f of Array.from(list)) {
        if (useIso) {
          const ext = f.name.split(".").pop();
          const newFile = new File([f], `${generatedIso}.${ext}`, { type: f.type });
          fd.append("files", newFile);
        } else {
          fd.append("files", f);
        }
      }
      // Si hay usuario asignado, crear tarea REVISAR automáticamente
      if (assignedUserId) fd.append("assignedUserId", assignedUserId);
      const res = await fetch(`/api/projects/${projectId}/files`, { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Error");
      }
      e.target.value = "";
      onChanged();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Documentación técnica clasificada (BEP, OIR, AIR, EIR, etc.): IFC/BCF, Revit, AutoCAD, Navisworks, Office, PDF, TXT/CSV, ZIP e imágenes, según tu flujo BIM y de oficina.
      </p>

      {isAdmin && (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input type="checkbox" checked={useIso} onChange={e => setUseIso(e.target.checked)} className="rounded border-input text-accent focus:ring-accent" />
            Usar Generador ISO 19650
          </label>
          
          {useIso && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-7">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Proyecto
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={6} value={isoProy} onChange={e => setIsoProy(e.target.value)} placeholder="PRJ" />
              </label>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Originador
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={6} value={isoOrg} onChange={e => setIsoOrg(e.target.value)} placeholder="ORG" />
              </label>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Volumen
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={2} value={isoVol} onChange={e => setIsoVol(e.target.value)} placeholder="ZZ" />
              </label>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Nivel
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={2} value={isoNiv} onChange={e => setIsoNiv(e.target.value)} placeholder="ZZ" />
              </label>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Tipo
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={2} value={isoTipo} onChange={e => setIsoTipo(e.target.value)} placeholder="M3" />
              </label>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Rol
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={2} value={isoRol} onChange={e => setIsoRol(e.target.value)} placeholder="A" />
              </label>
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Número
                <input className="mt-1 w-full border-b border-input bg-transparent py-1 text-sm uppercase text-foreground focus:border-accent focus:outline-none" maxLength={4} value={isoNum} onChange={e => setIsoNum(e.target.value)} placeholder="0001" />
              </label>
            </div>
          )}
          {useIso && (
            <p className="mt-3 text-xs text-muted-foreground">
              Nombre generado: <span className="font-mono font-medium text-foreground">{generatedIso}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs font-medium text-muted-foreground">
          Tipo de documento
          <select className="mt-1.5 block w-full min-w-[140px] cursor-pointer border-0 border-b border-input bg-transparent py-2 text-sm focus:border-accent focus:outline-none" value={docType} onChange={(e) => setDocType(e.target.value as typeof docType)}>
            {TECH_DOC_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {labelTechnicalDocType(t)}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-muted/60 px-4 py-3 text-xs font-medium dark:bg-muted/25">
          <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <input
            type="file"
            accept={TECHNICAL_UPLOAD_ACCEPT}
            multiple
            className="hidden"
            disabled={busy}
            onChange={onUpload}
          />
          {busy ? "Subiendo" : "Subir archivos"}
        </label>
        {/* Selector de usuario asignado */}
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserPlus className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <select
            id="techdoc-assign-user"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
            title="Asignar revisor (opcional — crea tarea REVISAR)"
          >
            <option value="">Sin asignar</option>
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
      </div>
      <div className="overflow-x-auto mt-6 rounded-2xl bg-muted/40 dark:bg-muted/20">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Clasificación</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Subido por</th>
              <th className="px-4 py-3 font-medium">Versión</th>
              <th className="px-4 py-3 font-medium">Tamaño</th>
              <th className="px-4 py-3 font-medium">Extensión</th>
              <th className="px-4 py-3 font-medium">Fecha / Hora</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {files.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Sin documentación clasificada.
                </td>
              </tr>
            ) : (
              files.map((f) => {
                const ext = "." + (f.originalName.split(".").pop()?.toLowerCase() || "");
                const sizeMb = (f.size / (1024 * 1024)).toFixed(2) + " MB";
                const dateObj = new Date(f.uploadedAt);
                const dateStr = dateObj.toLocaleDateString("es-ES") + " " + dateObj.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                const aiBusy = aiLoading?.fileId === f.id;
                const auditBusy = aiLoading?.fileId === f.id && aiLoading.action === "audit";
                const mermaidBusy = aiLoading?.fileId === f.id && aiLoading.action === "mermaid";
                return (
                  <tr key={f.id} className="hover:bg-background/50 dark:hover:bg-background/10">
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        {f.technicalDocType ? labelTechnicalDocType(f.technicalDocType as (typeof TECH_DOC_OPTIONS)[number]) : ""}
                      </span>
                    </td>
                    <td className="max-w-[min(24rem,35vw)] px-4 py-3 break-all font-medium text-foreground">{f.originalName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {f.uploadEvents?.[0]?.uploader?.nombre?.trim() ? f.uploadEvents[0].uploader.nombre : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">v{f.version}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{sizeMb}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ext}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{dateStr}</td>
                    <td className="px-3 py-3 sm:px-4">
                      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
                        {f.technicalDocType === "BEP" && (
                          <>
                            <button
                              type="button"
                              title="Revisar el BEP con IA: errores, oportunidades y sugerencias de mejora."
                              aria-label="Análisis IA del BEP"
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sky-500/40 bg-gradient-to-b from-sky-500/[0.12] to-sky-600/[0.06] px-2 py-1.5 text-[11px] font-semibold text-sky-800 shadow-sm ring-1 ring-sky-500/20 transition hover:border-sky-500/55 hover:from-sky-500/[0.18] hover:ring-sky-500/30 disabled:pointer-events-none disabled:opacity-45 dark:text-sky-200 dark:from-sky-400/15 dark:to-sky-950/30 dark:ring-sky-400/25"
                              onClick={() => handleAIAction(f.id, "audit")}
                              disabled={aiBusy}
                            >
                              {auditBusy ? (
                                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" strokeWidth={2} aria-hidden />
                              ) : (
                                <Brain className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                              )}
                              <span className="max-w-[7.5rem] truncate sm:max-w-none">Análisis IA</span>
                            </button>
                            <button
                              type="button"
                              title="Generar un diagrama Mermaid (graph TD) a partir del contenido del BEP."
                              aria-label="Diagrama Mermaid del BEP"
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-muted/50 px-2 py-1.5 text-[11px] font-medium text-foreground/90 transition hover:border-accent/40 hover:bg-muted/80 disabled:pointer-events-none disabled:opacity-45 dark:bg-muted/25"
                              onClick={() => handleAIAction(f.id, "mermaid")}
                              disabled={aiBusy}
                            >
                              {mermaidBusy ? (
                                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" strokeWidth={2} aria-hidden />
                              ) : (
                                <Network className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
                              )}
                              <span className="max-w-[5.5rem] truncate sm:max-w-[10rem]">Diagrama Mermaid</span>
                            </button>
                          </>
                        )}
                        <a
                          href={`/api/files/${f.id}/download`}
                          title="Descargar archivo"
                          className="inline-flex shrink-0 items-center rounded-lg border border-transparent px-2 py-1.5 text-[11px] font-medium text-accent underline-offset-4 transition hover:border-accent/25 hover:bg-accent/5 hover:underline"
                        >
                          Descargar
                        </a>
                        <button
                          type="button"
                          className="inline-flex shrink-0 rounded-md p-1.5 text-destructive transition hover:bg-destructive/10"
                          title="Mover a la papelera"
                          aria-label="Eliminar archivo"
                          onClick={() => setTrashDocId(f.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={trashDocId !== null}
        title="Mover a la papelera"
        message="¿Seguro que quieres mover este archivo a la papelera? Podrás recuperarlo desde la sección de archivos eliminados."
        confirmLabel="Sí, mover a la papelera"
        confirmVariant="destructive"
        requirePin={false}
        onCancel={() => setTrashDocId(null)}
        onConfirm={() => {
          const id = trashDocId;
          setTrashDocId(null);
          if (!id) return;
          void (async () => {
            const res = await fetch(`/api/files/${id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nip: "" }),
            });
            if (res.status === 204) {
              onChanged();
              return;
            }
            const j = (await res.json().catch(() => ({}))) as { error?: string };
            onError?.(j.error ?? "No se pudo mover el archivo a la papelera");
          })();
        }}
      />
      {auditMarkdown && <AnalysisMarkdownViewer markdown={auditMarkdown} onClose={() => setAuditMarkdown(null)} />}
      {mermaidCode && <MermaidViewer code={mermaidCode} onClose={() => setMermaidCode(null)} />}
    </div>
  );
}

export const ProjectTechnicalDocsSection = memo(ProjectTechnicalDocsSectionInner);
