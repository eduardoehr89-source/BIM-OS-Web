import { prisma } from './src/lib/prisma';

async function main() {
  await prisma.user.updateMany({
    where: {
      nombre: {
        in: ['eduardo', 'roberto']
      }
    },
    data: {
      mustChangePassword: true,
      password: '3350'
    }
  });
  console.log('Users updated');
}

main().catch(console.error).finally(() => prisma.$disconnect());
