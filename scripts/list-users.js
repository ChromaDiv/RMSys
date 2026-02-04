const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all users...');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      orders: {
        select: { id: true },
        take: 1
      }
    }
  });

  console.log('Total Users:', users.length);
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: "${u.email}" | Name: ${u.name} | OrderCount: ${u.orders.length > 0 ? '>0' : '0'}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
