const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Testing registration flow...');

  const email = 'test_agent_' + Date.now() + '@example.com';
  const password = 'password123';
  const name = 'Test Agent';

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists (unexpected for unique email)');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    console.log('✅ Registration simulation successful!');
    console.log('Created user:', user.email);

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Cleanup successful');

  } catch (error) {
    console.error('❌ Registration simulation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
