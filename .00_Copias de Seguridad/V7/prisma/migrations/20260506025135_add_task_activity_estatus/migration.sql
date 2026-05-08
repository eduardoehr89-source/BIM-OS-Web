-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "fechaTermino" DATETIME NOT NULL,
    "complejidad" TEXT NOT NULL,
    "actividad" TEXT NOT NULL DEFAULT 'MODELADO',
    "taskEstatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "comentarios" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectTask" ("comentarios", "complejidad", "completado", "createdAt", "disciplina", "fechaTermino", "id", "nombre", "projectId", "updatedAt") SELECT "comentarios", "complejidad", "completado", "createdAt", "disciplina", "fechaTermino", "id", "nombre", "projectId", "updatedAt" FROM "ProjectTask";
DROP TABLE "ProjectTask";
ALTER TABLE "new_ProjectTask" RENAME TO "ProjectTask";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
