import path from "node:path";

export function assertPdfFilename(filename: string) {
  if (path.extname(filename).toLowerCase() !== ".pdf") {
    throw new Error("La documentación técnica clasificada solo admite archivos PDF");
  }
}

/** BEP: PDF o Word según ISO 19650 (ampliación respecto a solo-PDF). */
export function assertBepDocFilename(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (![".pdf", ".doc", ".docx"].includes(ext)) {
    throw new Error("BEP: solo PDF o Word (.doc, .docx)");
  }
}
