"use client";

import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { TECH_DOC_OPTIONS, labelTechnicalDocType } from "@/lib/project-enums";

type FileWithTech = {
  id: string;
  originalName: string;
  size: number;
  technicalDocType?: string | null;
  version: number;
  uploadedAt: string;
};

export function ProjectTechnicalDocsSection({
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

  const generatedIso = `${isoProy}-${isoOrg}-${isoVol}-${isoNiv}-${isoTipo}-${isoRol}-${isoNum}`.toUpperCase();
  const isIsoValid = isoProy.length > 0 && isoOrg.length > 0 && isoVol.length > 0 && isoNiv.length > 0 && isoTipo.length > 0 && isoRol.length > 0 && isoNum.length > 0;

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
      const res = await fetch(`/api/projects/${projectId}/files`, { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Error");
      }
      e.target.value = "";
      onChanged();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Error al subir PDF");
    } finally {
      setBusy(false);
    }
  }

  async function removeFile(id: string) {
    if (!confirm("Eliminar este documento del proyecto?")) return;
    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    onChanged();
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Documentación técnica en PDF (BEP, OIR, EIR u otros). Solo se aceptan archivos PDF en esta sección.
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
          <input type="file" accept=".pdf,application/pdf" multiple className="hidden" disabled={busy} onChange={onUpload} />
          {busy ? "Subiendo" : "Subir PDF"}
        </label>
      </div>
      <div className="overflow-x-auto mt-6 rounded-2xl bg-muted/40 dark:bg-muted/20">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-border/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Clasificación</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
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
                <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Sin documentación clasificada.
                </td>
              </tr>
            ) : (
              files.map((f) => {
                const ext = "." + (f.originalName.split(".").pop()?.toLowerCase() || "");
                const sizeMb = (f.size / (1024 * 1024)).toFixed(2) + " MB";
                const dateObj = new Date(f.uploadedAt);
                const dateStr = dateObj.toLocaleDateString("es-ES") + " " + dateObj.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                return (
                  <tr key={f.id} className="hover:bg-background/50 dark:hover:bg-background/10">
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        {f.technicalDocType ? labelTechnicalDocType(f.technicalDocType as (typeof TECH_DOC_OPTIONS)[number]) : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{f.originalName}</td>
                    <td className="px-4 py-3 text-muted-foreground">v{f.version}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{sizeMb}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ext}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{dateStr}</td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/api/files/${f.id}/download`} className="mr-3 text-xs font-medium text-accent underline-offset-4 hover:underline">
                        Descargar
                      </a>
                      <button type="button" className="text-destructive hover:underline" title="Eliminar" onClick={() => void removeFile(f.id)}>
                        <Trash2 className="inline h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
