-- AlterTable
ALTER TABLE "ProjectFile" ADD COLUMN "technicalDocType" TEXT;

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "fechaTermino" DATETIME NOT NULL,
    "complejidad" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "comentarios" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "url" TEXT,
    "fuente" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
