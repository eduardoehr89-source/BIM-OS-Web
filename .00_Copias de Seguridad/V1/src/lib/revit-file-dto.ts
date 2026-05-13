const UPLOAD_EVENTS = {
  orderBy: { createdAt: "desc" as const },
  take: 1,
  select: { uploader: { select: { nombre: true } } },
};

export { UPLOAD_EVENTS as REVIT_FILE_UPLOAD_EVENTS };

type FileWithUploads = {
  id: string;
  originalName: string;
  version: number;
  uploadEvents: { uploader: { nombre: string } | null }[];
};

const BASE = process.env.NEXT_PUBLIC_APP_URL || "";

export function projectFileToRevitArchivo(file: FileWithUploads) {
  const autor = file.uploadEvents[0]?.uploader?.nombre?.trim() || "—";
  return {
    Nombre: file.originalName,
    Version: `v${file.version}`,
    Autor: autor,
    UrlDescarga: `${BASE}/api/files/${file.id}/download`,
  };
}
