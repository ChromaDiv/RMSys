const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  console.log('Starting DB Test...');
  try {
    const start = Date.now();
    await prisma.$connect();
    console.log(`Connected in ${Date.now() - start}ms`);

    const userCount = await prisma.user.count();
    console.log(`Successfully reached database. User count: ${userCount}`);

    // Check if we can reach the Order table too since that was a recent concern
    const orderCount = await prisma.order.count();
    console.log(`Order table accessible. Count: ${orderCount}`);

  } catch (error) {
    console.error('--- DATABASE TEST FAILED ---');
    console.error('Error Name:', error.name);
    console.error('Error Code:', error.code);
    console.error('Client Version:', error.clientVersion);
    console.error('Message:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
