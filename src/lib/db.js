import { PrismaClient } from '@prisma/client';

// Fix for BigInt serialization
BigInt.prototype.toJSON = function () { return this.toString() };

// Hardcoded fallback for Hostinger deployment issues
const FALLBACK_DATABASE_URL = "postgresql://postgres:Achaji31.,.@db.pjlifzwsxqbeetliyniw.supabase.co:5432/postgres";

const DATABASE_URL = process.env.DATABASE_URL || FALLBACK_DATABASE_URL;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL missing in env. Using Hardcoded Fallback.");
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

let prismaInstance;

try {
  prismaInstance = globalForPrisma.prisma || new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });
} catch (e) {
  console.error("❌ CRITICAL: Failed to initialize PrismaClient:", e.message);

  // Robust Mock to prevent "is not a function" errors
  const mockModelChain = new Proxy({}, {
    get: () => async () => {
      throw new Error(`Prisma Client failed to initialize. DATABASE_URL: ${DATABASE_URL ? 'Present' : 'Missing'}`);
    }
  });

  prismaInstance = new Proxy({}, {
    get: () => mockModelChain // Returns an object that has methods that throw
  });
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
