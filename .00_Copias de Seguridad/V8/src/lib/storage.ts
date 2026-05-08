import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");

const ALLOWED_EXT = new Set([".pdf", ".dwg", ".ifc"]);

/** PDF / Word para BEP y documentos ISO de cliente (OIR, AIR, EIR). */
const ISO_DOC_EXT = new Set([".pdf", ".doc", ".docx"]);

export function uploadsRoot() {
  return UPLOAD_ROOT;
}

export function assertAllowedExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`Extensión no permitida: solo ${[...ALLOWED_EXT].join(", ")}`);
  }
}

export async function saveProjectUpload(
  projectId: string,
  originalName: string,
  file: File,
): Promise<{ storedPath: string; size: number; mimeType: string }> {
  assertAllowedExtension(originalName);
  const safeBase = path.basename(originalName).replace(/[^\w.\-\u00C0-\u024f]+/g, "_");
  const unique = `${crypto.randomUUID()}-${safeBase}`;
  const dir = path.join(UPLOAD_ROOT, projectId);
  await mkdir(dir, { recursive: true });
  const absolutePath = path.join(dir, unique);
  const relativePath = path.relative(process.cwd(), absolutePath);

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buf);

  return {
    storedPath: relativePath.replace(/\\/g, "/"),
    size: buf.length,
    mimeType: file.type || "application/octet-stream",
  };
}

export function assertIsoClientDocExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (!ISO_DOC_EXT.has(ext)) {
    throw new Error(`Documento ISO: solo ${[...ISO_DOC_EXT].join(", ")}`);
  }
}

export async function saveClientUpload(
  clientId: string,
  originalName: string,
  file: File,
): Promise<{ storedPath: string; size: number; mimeType: string }> {
  assertIsoClientDocExtension(originalName);
  const safeBase = path.basename(originalName).replace(/[^\w.\-\u00C0-\u024f]+/g, "_");
  const unique = `${crypto.randomUUID()}-${safeBase}`;
  const dir = path.join(UPLOAD_ROOT, "clients", clientId);
  await mkdir(dir, { recursive: true });
  const absolutePath = path.join(dir, unique);
  const relativePath = path.relative(process.cwd(), absolutePath);

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buf);

  return {
    storedPath: relativePath.replace(/\\/g, "/"),
    size: buf.length,
    mimeType: file.type || "application/octet-stream",
  };
}
