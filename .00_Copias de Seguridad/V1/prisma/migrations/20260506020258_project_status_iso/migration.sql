-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipologia" TEXT NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'INICIO_PENDIENTE',
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("ano", "clientId", "createdAt", "estatus", "id", "nombre", "tipologia", "ubicacion", "updatedAt") SELECT "ano", "clientId", "createdAt", "estatus", "id", "nombre", "tipologia", "ubicacion", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
