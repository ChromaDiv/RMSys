import { PrismaClient } from '@prisma/client';

// Fix for BigInt serialization
BigInt.prototype.toJSON = function () { return this.toString() };

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in environment variables!");
} else {
  // Log masked URL for debugging (e.g. mysql://user:***@host:port/db)
  const maskedUrl = DATABASE_URL.replace(/:([^:@]+)@/, ':***@');
  console.log("✅ Connecting to Database:", maskedUrl);
}

const globalForPrisma = globalThis;

// Force reset in dev if models are missing (e.g. after schema change)
if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma && !globalForPrisma.prisma.category) {
  console.log('🔄 Category model missing on cached Prisma client. Resetting...');
  delete globalForPrisma.prisma;
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
