import { prisma } from "./src/lib/prisma";

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      OR: [
        { nombre: { equals: "eduardo", mode: "insensitive" } },
        { nombre: { equals: "roberto", mode: "insensitive" } },
      ],
    },
    data: {
      mustChangePassword: true,
      password: "3350",
    },
  });
  console.log(`Users updated: ${result.count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
