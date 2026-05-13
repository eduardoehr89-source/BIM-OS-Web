import { readFile } from "node:fs/promises";
import path from "node:path";

function isAllowedStoredPath(cwd: string, storedPath: string): boolean {
  const normalized = storedPath.replace(/\\/g, "/");
  const absolute = path.resolve(cwd, storedPath);
  const uploadsRoot = path.resolve(cwd, "storage", "uploads");
  if (absolute.startsWith(uploadsRoot)) return true;
  if (normalized.startsWith("vercel-metadata-only/")) return true;
  return false;
}

export type ProjectFileBufferRow = {
  storedPath: string;
  storageKey: string | null;
  mimeType: string;
};

export async function readProjectFileBuffer(row: ProjectFileBufferRow): Promise<Buffer | null> {
  if (row.storageKey) {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const response = await fetch(row.storageKey, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    } catch {
      return null;
    }
  }

  const cwd = process.cwd();
  if (!isAllowedStoredPath(cwd, row.storedPath)) return null;
  const absolute = path.resolve(cwd, row.storedPath);
  try {
    return await readFile(absolute);
  } catch {
    return null;
  }
}
