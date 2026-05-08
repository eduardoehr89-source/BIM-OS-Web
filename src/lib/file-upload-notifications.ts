export type FileAlertSettingsSlice = {
  fileExtensionsFilter: string;
  userWatchlist: string;
};

/** Normaliza entradas tipo ".pdf", "pdf", ",rvt  .ifc" → lista ".pdf", ".rvt", ".ifc" */
export function parseExtensionsCsv(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .map((s) => (s.startsWith(".") ? s : `.${s}`));
}

export function fileExtensionMatches(originalName: string, extensions: string[]): boolean {
  if (extensions.length === 0) return false;
  const dot = originalName.lastIndexOf(".");
  if (dot < 0) return false;
  const ext = originalName.slice(dot).toLowerCase();
  return extensions.includes(ext);
}

export function parseUserIdsCsv(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Recibe alertas de todas las subidas si no hay reglas (filtros vacíos).
 * Con reglas: dispara si coincide la extensión O si el autor está en la lista (OR).
 * No notifica al propio usuario que subió el archivo.
 */
export function shouldNotifyAdminOfFileUpload(
  settings: FileAlertSettingsSlice | null,
  opts: {
    originalName: string;
    uploaderId: string | null;
    viewerId: string;
  },
): boolean {
  const { originalName, uploaderId, viewerId } = opts;

  if (uploaderId && uploaderId === viewerId) return false;

  const extCsv = settings?.fileExtensionsFilter?.trim() ?? "";
  const watchCsv = settings?.userWatchlist?.trim() ?? "";

  const extRules = parseExtensionsCsv(extCsv);
  const watchIds = parseUserIdsCsv(watchCsv);

  const hasExtRules = extRules.length > 0;
  const hasWatchRules = watchIds.length > 0;

  if (!hasExtRules && !hasWatchRules) return true;

  const extMatch = hasExtRules && fileExtensionMatches(originalName, extRules);
  const userMatch = hasWatchRules && uploaderId != null && watchIds.includes(uploaderId);

  return extMatch || userMatch;
}
