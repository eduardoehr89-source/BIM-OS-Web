-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invitation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SharedClients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SharedClients_A_fkey" FOREIGN KEY ("A") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SharedClients_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SharedProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SharedProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SharedProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SharedTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SharedTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SharedTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("activo", "createdAt", "id", "nombre", "updatedAt") SELECT "activo", "createdAt", "id", "nombre", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipologia" TEXT NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'INICIO_PENDIENTE',
    "clientId" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("ano", "clientId", "createdAt", "estatus", "id", "nombre", "tipologia", "ubicacion", "updatedAt") SELECT "ano", "clientId", "createdAt", "estatus", "id", "nombre", "tipologia", "ubicacion", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
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
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectTask_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectTask" ("actividad", "comentarios", "complejidad", "completado", "createdAt", "disciplina", "fechaTermino", "id", "nombre", "projectId", "taskEstatus", "updatedAt") SELECT "actividad", "comentarios", "complejidad", "completado", "createdAt", "disciplina", "fechaTermino", "id", "nombre", "projectId", "taskEstatus", "updatedAt" FROM "ProjectTask";
DROP TABLE "ProjectTask";
ALTER TABLE "new_ProjectTask" RENAME TO "ProjectTask";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_SharedClients_AB_unique" ON "_SharedClients"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedClients_B_index" ON "_SharedClients"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SharedProjects_AB_unique" ON "_SharedProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedProjects_B_index" ON "_SharedProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SharedTasks_AB_unique" ON "_SharedTasks"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedTasks_B_index" ON "_SharedTasks"("B");
