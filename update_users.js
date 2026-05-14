const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: {
      nombre: {
        in: ['eduardo', 'roberto']
      }
    },
    data: {
      mustChangePassword: true
    }
  });
  console.log('Users updated');
}

main().catch(console.error).finally(() => prisma.$disconnect());
