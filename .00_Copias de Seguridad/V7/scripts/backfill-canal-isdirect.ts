import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.$executeRawUnsafe(`UPDATE Canal SET isDirect = 1 WHERE tipo = 'DIRECT'`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
