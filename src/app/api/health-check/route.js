import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env_check: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'UNDEFINED',
      NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL || 'UNDEFINED',
      NODE_ENV: process.env.NODE_ENV,
      HAS_SECRET: !!process.env.NEXTAUTH_SECRET,
      // Do not return the actual secret for security, just confirmation it exists
    },
    message: "If NEXTAUTH_URL is 'localhost' or undefined, Auth will fail."
  });
}
