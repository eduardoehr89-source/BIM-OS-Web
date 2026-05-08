-- Normaliza cualquier valor que no coincida con enum ProjectStatus (evita lecturas/groupBy inválidos).
UPDATE "Project"
SET "estatus" = 'INICIO_PENDIENTE'
WHERE "estatus" NOT IN ('INICIO_PENDIENTE', 'EN_PROCESO', 'PAUSADO', 'TERMINADO', 'CANCELADO');
