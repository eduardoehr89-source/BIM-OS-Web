export type DirectorySortKey = "nombre" | "cliente" | "rol" | "proyectoComun";

export type DirectoryUserRow = {
  id: string;
  nombre: string;
  tipo: string;
  rol: string;
  client?: { nombre: string } | null;
  sharesProjectWithViewer: boolean;
};

export function sortDirectoryUsers<T extends DirectoryUserRow>(
  rows: T[],
  key: DirectorySortKey,
  dir: "asc" | "desc",
): T[] {
  const mul = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    switch (key) {
      case "nombre":
        return mul * a.nombre.localeCompare(b.nombre, "es");
      case "cliente":
        return mul * (a.client?.nombre ?? "").localeCompare(b.client?.nombre ?? "", "es");
      case "rol":
        return mul * a.rol.localeCompare(b.rol);
      case "proyectoComun":
        return mul * (Number(b.sharesProjectWithViewer) - Number(a.sharesProjectWithViewer));
      default:
        return 0;
    }
  });
}
