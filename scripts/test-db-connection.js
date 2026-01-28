const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);

    const user = await prisma.user.findUnique({
      where: { email: 'sohaib@chromadiv.com' }
    });

    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash start:', user.password ? user.password.substring(0, 10) + '...' : 'NO PASSWORD');
      console.log('Email verified:', user.emailVerified);
    } else {
      console.log('User sohaib@chromadiv.com NOT found.');
    }

    const categories = await prisma.category.findMany();
    console.log(`Categories count: ${categories.length}`);

  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
