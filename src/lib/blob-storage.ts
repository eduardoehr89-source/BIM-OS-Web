import { del, getDownloadUrl, put } from "@vercel/blob";

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export function isBlobConfigured(): boolean {
  return Boolean(blobToken());
}

/** Sube el archivo al store de Vercel Blob. Requiere `BLOB_READ_WRITE_TOKEN`. */
export async function putProjectFileBlob(
  projectId: string,
  originalName: string,
  file: File,
): Promise<{ pathname: string; url: string; downloadUrl: string; size: number }> {
  const token = blobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN no está configurado");
  }

  const base = originalName.replace(/^.*[/\\]/, "");
  const safe = base.replace(/[^\w.\-\u00C0-\u024f]+/g, "_") || "file";
  const pathname = `projects/${projectId}/${crypto.randomUUID()}-${safe}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    token,
    contentType: file.type?.trim() || "application/octet-stream",
  });

  return {
    pathname: blob.pathname,
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    size: typeof file.size === "number" && file.size >= 0 ? file.size : 0,
  };
}

/**
 * URL para forzar descarga (p. ej. plugin Revit / navegador).
 * `storageKey` debe ser la URL pública devuelta por `put`.
 */
export function getBlobDownloadUrl(blobPublicUrl: string): string {
  return getDownloadUrl(blobPublicUrl);
}

/** Elimina un blob por su URL (mejor esfuerzo; ignora errores). */
export async function deleteBlobByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const token = blobToken();
  if (!token) return;
  try {
    await del(url, { token });
  } catch {
    /* noop */
  }
}
