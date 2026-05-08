UPDATE "Project" SET "estatus" = 'INICIO_PENDIENTE' WHERE "estatus" = 'Pendiente';
UPDATE "Project" SET "estatus" = 'EN_PROCESO' WHERE "estatus" = 'EnCurso';
UPDATE "Project" SET "estatus" = 'TERMINADO' WHERE "estatus" = 'Completada';
