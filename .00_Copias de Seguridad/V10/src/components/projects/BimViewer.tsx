"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import * as THREE from "three";

function resolveFetchUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (typeof window === "undefined") {
    return pathOrUrl;
  }
  return `${window.location.origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function BimViewer({ url, onClose }: { url: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viewer: {
      dispose: () => void | Promise<void>;
      IFC: {
        setWasmPath: (p: string) => Promise<void>;
        loadIfc: (file: File, fit?: boolean, onError?: (e: unknown) => void) => Promise<unknown>;
      };
    } | null = null;
    let mounted = true;

    async function init() {
      if (!containerRef.current) {
        console.log("[BimViewer] init skipped: container ref not ready");
        return;
      }
      console.log("[BimViewer] init start", { url });

      try {
        const wasmUrl = resolveFetchUrl("/wasm/web-ifc.wasm");
        let wasmCheck = await fetch(wasmUrl, { method: "HEAD", credentials: "same-origin" });
        if (wasmCheck.status === 405 || wasmCheck.status === 501) {
          wasmCheck = await fetch(wasmUrl, {
            credentials: "same-origin",
            headers: { Range: "bytes=0-0" },
          });
        }
        const wasmOk = wasmCheck.ok || wasmCheck.status === 206;
        if (!wasmOk) {
          console.error("[BimViewer] WASM check failed", { status: wasmCheck.status, wasmUrl });
          throw new Error(`WASM no disponible (HTTP ${wasmCheck.status}). Comprueba public/wasm/web-ifc.wasm`);
        }
        console.log("[BimViewer] WASM reachable", { status: wasmCheck.status, wasmUrl });

        const ifcFetchUrl = resolveFetchUrl(url);
        const ifcRes = await fetch(ifcFetchUrl, { credentials: "include" });
        console.log("[BimViewer] IFC fetch response", { status: ifcRes.status, statusText: ifcRes.statusText, url: ifcFetchUrl });

        if (!ifcRes.ok) {
          const errBody = await ifcRes.text().catch(() => "");
          console.error("[BimViewer] IFC fetch error body (preview)", errBody.slice(0, 500));
          throw new Error(`No se pudo obtener el IFC (HTTP ${ifcRes.status})`);
        }

        const buf = await ifcRes.arrayBuffer();
        console.log("[BimViewer] IFC bytes received", { byteLength: buf.byteLength });

        const { IfcViewerAPI } = await import("web-ifc-viewer");

        viewer = new IfcViewerAPI({
          container: containerRef.current,
          backgroundColor: new THREE.Color(0x0f172a),
        });

        await viewer.IFC.setWasmPath("/wasm/");
        console.log("[BimViewer] setWasmPath completed: /wasm/");

        const file = new File([buf], "model.ifc", { type: "application/octet-stream" });
        const model = await viewer.IFC.loadIfc(file, true, (parseErr) => {
          console.error("[BimViewer] loadIfc onError (parser / WASM)", parseErr);
        });

        if (!model) {
          throw new Error("El visor no pudo parsear el IFC (modelo nulo). Revisa errores de WASM o formato del archivo.");
        }

        console.log("[BimViewer] IFC model loaded");
        if (mounted) setLoading(false);
      } catch (err) {
        console.error("[BimViewer] Error loading IFC (caught):", err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "No se pudo cargar el modelo 3D. Verifica que el archivo sea un .ifc válido.",
          );
          setLoading(false);
        }
      }
    }

    void init();

    return () => {
      mounted = false;
      if (viewer) {
        try {
          void viewer.dispose();
        } catch (e) {
          console.warn("[BimViewer] dispose:", e);
        }
      }
    };
  }, [url]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-6">
        <h2 className="text-sm font-semibold text-zinc-100">Visor BIM IFC</h2>
        <button
          type="button"
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          onClick={onClose}
          aria-label="Cerrar visor"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="relative min-h-0 flex-1 bg-slate-950" ref={containerRef}>
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-zinc-400" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-medium tracking-wide text-zinc-300">Procesando geometría BIM...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm">
            <p className="max-w-md text-center text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
