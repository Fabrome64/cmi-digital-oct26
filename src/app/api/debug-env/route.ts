import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const postgresPrismaUrl = process.env.POSTGRES_PRISMA_URL || '';
  const postgresUrl = process.env.POSTGRES_URL || '';

  const mask = (str: string) => {
    if (!str) return 'NOT_SET';
    if (str.startsWith('file:')) return 'file: (SQLite local)';
    if (str.startsWith('postgres://') || str.startsWith('postgresql://')) {
      const parts = str.split('@');
      return `postgres://*****@${parts[1] || 'hidden'}`;
    }
    return 'OTHER: ' + str.substring(0, 10) + '...';
  };

  return NextResponse.json({
    DATABASE_URL: mask(dbUrl),
    POSTGRES_PRISMA_URL: mask(postgresPrismaUrl),
    POSTGRES_URL: mask(postgresUrl),
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || '0',
    VERCEL_ENV: process.env.VERCEL_ENV || 'not_set',
  });
}
