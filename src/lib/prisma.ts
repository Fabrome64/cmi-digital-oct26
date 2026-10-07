import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  
  // Check Vercel Postgres variations (default and custom prefixes like postgres_)
  const postgresUrl =
    process.env.postgres_PRISMA_DATABASE_URL ||
    process.env.postgres_POSTGRES_URL ||
    process.env.postgres_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_DATABASE_URL;

  if (postgresUrl && (!envUrl || envUrl.startsWith('file:'))) {
    return postgresUrl;
  }
  if (directUrl && (!envUrl || envUrl.startsWith('file:'))) {
    return directUrl;
  }
  return envUrl || postgresUrl || directUrl;
}

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
