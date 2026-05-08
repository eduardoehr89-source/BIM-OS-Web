import "dotenv/config";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma";

function resolveSqlitePath(): string {
  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) {
    let p = url.slice("file:".length);
    if (p.startsWith("//")) p = p.slice(2);
    return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p.replace(/^\.\//, ""));
  }
  return path.join(process.cwd(), "prisma", "dev.db");
}

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: resolveSqlitePath() }),
});

async function main() {
  const count = await prisma.knowledgeReference.count();
  if (count === 0) {
    await prisma.knowledgeReference.createMany({
      data: [
        {
          category: "NORMAS",
          titulo: "ISO 19650 (gestión de información BIM)",
          descripcion: "Marco para organización y digitalización de información sobre proyectos y activos.",
          url: "https://www.iso.org/standard/73879.html",
          fuente: "ISO",
          orden: 1,
        },
        {
          category: "ESTANDARES",
          titulo: "National BIM Standard – United States (NBIMS-US)",
          descripcion: "Referencia de estándares abiertos aplicables a procesos BIM.",
          url: "https://www.nationalbimstandard.org/",
          fuente: "buildingSMART alliance",
          orden: 1,
        },
        {
          category: "CONCEPTOS",
          titulo: "BEP / OIR / EIR",
          descripcion: "BEP: plan de ejecución BIM; OIR: requisitos del organizador; EIR: requisitos del empleador.",
          fuente: "ISO 19650 / práctica común AEC",
          orden: 1,
        },
        {
          category: "REGLAMENTOS",
          titulo: "Marco regulatorio local",
          descripcion: "Consulta normativa municipal, estatal y federal aplicable al sitio del proyecto.",
          fuente: "Dependencias locales",
          orden: 1,
        },
      ],
    });
    console.log("Knowledge seed OK.");
  } else {
    console.log("Knowledge seed skipped (already has rows).");
  }

  // Asegurar que existe el usuario admin inicial
  let admin = await prisma.user.findFirst({
    where: { nombre: "Eduardo" }
  });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        nombre: "Eduardo",
        pin: "3350",
        rol: "ADMIN"
      }
    });
    console.log("Admin user 'Eduardo' created.");
  } else {
    console.log("Admin user 'Eduardo' already exists.");
  }

  // Asignar ownerId a registros huérfanos
  const clientsUpdated = await prisma.client.updateMany({
    where: { ownerId: null },
    data: { ownerId: admin.id }
  });
  const projectsUpdated = await prisma.project.updateMany({
    where: { ownerId: null },
    data: { ownerId: admin.id }
  });
  const tasksUpdated = await prisma.projectTask.updateMany({
    where: { ownerId: null },
    data: { ownerId: admin.id }
  });
  console.log(`Ownership updated: ${clientsUpdated.count} clients, ${projectsUpdated.count} projects, ${tasksUpdated.count} tasks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
