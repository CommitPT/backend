import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  await prisma.roles.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { uuid: v4(), name: 'ADMIN', level: 100 },
  });

  await prisma.roles.upsert({
    where: { name: 'MEMBER' },
    update: {},
    create: { uuid: v4(), name: 'MEMBER', level: 10 },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
