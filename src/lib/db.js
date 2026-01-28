import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

const DATABASE_URL = process.env.DATABASE_URL || "mysql://u384758686_RMSys:Migrate312026@srv2092.hstgr.io:3306/u384758686_RMSys";

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
