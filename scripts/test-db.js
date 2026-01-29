const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function main() {
  console.log('Testing database connection...');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not defined in environment');
    process.exit(1);
  }

  // Parse URL to check strictly
  try {
    const url = new URL(dbUrl);
    console.log(`User: ${url.username}`);
    console.log(`Host: ${url.hostname}`);
    console.log(`Database: ${url.pathname.substring(1)}`);
    // Check password length and spaces
    console.log(`Password length: ${url.password.length}`);
    console.log(`Password starts with: ${url.password.substring(0, 2)}***`);
    if (url.password.trim() !== url.password) {
      console.warn('⚠️ Password has leading or trailing whitespace!');
    }
  } catch (e) {
    console.error('Invalid URL format:', e.message);
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    // console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
