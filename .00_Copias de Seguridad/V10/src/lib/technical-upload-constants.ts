/**
 * Extensiones permitidas para subidas de proyecto (BIM, oficina, general).
 * Debe coincidir con la validación en `src/lib/storage.ts` (servidor).
 */
export const TECHNICAL_UPLOAD_EXTENSIONS = [
  ".ifc",
  ".bcf",
  ".docx",
  ".doc",
  ".xlsx",
  ".xls",
  ".pptx",
  ".ppt",
  ".rvt",
  ".rfa",
  ".rte",
  ".dwg",
  ".nwc",
  ".nwd",
  ".pdf",
  ".txt",
  ".csv",
  ".zip",
  ".jpg",
  ".png",
] as const;

/** Valor para el atributo HTML `accept` (solo extensiones). */
export const TECHNICAL_UPLOAD_ACCEPT = [...TECHNICAL_UPLOAD_EXTENSIONS].sort().join(",");

/** Mensaje de error del servidor si la extensión no está en la lista. */
export const TECHNICAL_UPLOAD_REJECT_MESSAGE = `Formato no admitido. Extensiones aceptadas: ${TECHNICAL_UPLOAD_EXTENSIONS.join(", ")}.`;
