import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let dbStatus = 'UNKNOWN';
    let dbError = null;

    try {
      // Try to connect/query
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED';
    } catch (e) {
      dbStatus = 'FAILED';
      dbError = e.message;
    }

    // Fetch public IP for whitelisting with timeout
    let serverIp = 'Unknown';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      const ipRes = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (ipRes.ok) {
        const ipData = await ipRes.json();
        serverIp = ipData.ip;
      }
    } catch (e) {
      serverIp = 'Failed to fetch: ' + e.message;
    }

    // Safe debug extraction from process.env.DATABASE_URL
    const dbEnv = process.env.DATABASE_URL || '';
    let maskedDbInfo = {
      exists: !!dbEnv,
      host: 'N/A',
      user: 'N/A',
      database: 'N/A',
      passwordLength: 0,
      passwordStart: 'N/A',
      protocol: 'N/A'
    };

    try {
      if (dbEnv) {
        // Manual parsing to avoid URL errors if protocol is missing
        // mysql://user:pass@host:port/db
        const urlParts = new URL(dbEnv);
        maskedDbInfo.host = urlParts.hostname;
        maskedDbInfo.user = urlParts.username;
        maskedDbInfo.database = urlParts.pathname.replace('/', '');
        maskedDbInfo.passwordLength = urlParts.password.length;
        maskedDbInfo.passwordStart = urlParts.password.substring(0, 2) + '***';
        maskedDbInfo.protocol = urlParts.protocol;
      }
    } catch (parseErr) {
      maskedDbInfo.parseError = parseErr.message;
    }

    return NextResponse.json({
      env_check: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'UNDEFINED',
        NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL || 'UNDEFINED',
        NODE_ENV: process.env.NODE_ENV,
        HAS_SECRET: !!process.env.NEXTAUTH_SECRET,
        SERVER_IP: serverIp // Useful for Remote MySQL whitelisting
      },
      db_check: {
        status: dbStatus,
        error: dbError,
        debug: maskedDbInfo
      },
      message: "Check env_check.SERVER_IP. Ensure this IP is whitelisted in Hostinger 'Remote MySQL'."
    });
  } catch (globalError) {
    return NextResponse.json({
      status: 'CRITICAL_FAILURE',
      error: globalError.message,
      stack: globalError.stack
    }, { status: 200 }); // Return 200 to see the error JSON
  }
}
