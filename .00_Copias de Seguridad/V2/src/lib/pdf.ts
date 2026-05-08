import path from "node:path";

export function assertPdfFilename(filename: string) {
  if (path.extname(filename).toLowerCase() !== ".pdf") {
    throw new Error("La documentación técnica clasificada solo admite archivos PDF");
  }
}
