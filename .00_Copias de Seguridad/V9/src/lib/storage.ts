import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { TECHNICAL_UPLOAD_EXTENSIONS, TECHNICAL_UPLOAD_REJECT_MESSAGE } from "@/lib/technical-upload-constants";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");

const TECHNICAL_UPLOAD_EXT = new Set<string>(TECHNICAL_UPLOAD_EXTENSIONS);

/** Atributo `accept` para inputs de subida (misma lista que validación servidor). */
export { TECHNICAL_UPLOAD_ACCEPT } from "@/lib/technical-upload-constants";

export function uploadsRoot() {
  return UPLOAD_ROOT;
}

export function assertAllowedExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (!TECHNICAL_UPLOAD_EXT.has(ext)) {
    throw new Error(TECHNICAL_UPLOAD_REJECT_MESSAGE);
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
  if (!TECHNICAL_UPLOAD_EXT.has(ext)) {
    throw new Error(TECHNICAL_UPLOAD_REJECT_MESSAGE);
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
