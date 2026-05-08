/**
 * Ejecutar una sola vez (o cuando quieras re-sincronizar):
 *   npx tsx scripts/migrate-iso-attachments-wip.ts
 *
 * Asigna a WIP (01_WIP) todos los ProjectFile generales del proyecto que aún no tienen fila Attachment.
 */
import "dotenv/config";
import { migrateAllOrphanProjectFilesToWipAttachments } from "../src/lib/iso-attachments";

async function main() {
  const { projectCount, fileCount } = await migrateAllOrphanProjectFilesToWipAttachments();
  console.log(
    `[migrate-iso-attachments-wip] Proyectos tocados: ${projectCount}, archivos vinculados a 01_WIP: ${fileCount}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
