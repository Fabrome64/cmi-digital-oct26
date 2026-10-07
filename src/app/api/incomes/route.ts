import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryIncomes, createMemoryIncome } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createIncomeTableSQL = `
CREATE TABLE IF NOT EXISTS "Income" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT,
  "clienteNombre" TEXT NOT NULL,
  "servicio" TEXT NOT NULL,
  "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "importe" DOUBLE PRECISION NOT NULL,
  "observaciones" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);`;

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const incomes = await prisma.income.findMany({
      orderBy: { fecha: 'desc' },
      include: { cliente: true },
    });
    return NextResponse.json(incomes, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error on GET /api/incomes, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createIncomeTableSQL);
      const incomes = await prisma.income.findMany({ orderBy: { fecha: 'desc' } });
      return NextResponse.json(incomes, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemoryIncomes(), { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const dataToSave = {
    clienteId: body.clienteId || null,
    clienteNombre: body.clienteNombre || 'Cliente Contado',
    servicio: body.servicio || 'SITIO WEB',
    fecha: body.fecha ? new Date(body.fecha) : new Date(),
    importe: Number(body.importe) || 0,
    observaciones: body.observaciones || null,
  };

  const memoryIncome = createMemoryIncome({
    ...dataToSave,
    fecha: dataToSave.fecha.toISOString(),
  });

  try {
    const income = await prisma.income.create({ data: dataToSave });
    return NextResponse.json(income, { status: 201 });
  } catch (error: any) {
    console.warn('DB error on POST /api/incomes, auto creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createIncomeTableSQL);
      const income = await prisma.income.create({ data: dataToSave });
      return NextResponse.json(income, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating income:', retryError);
      return NextResponse.json(memoryIncome, { status: 201 });
    }
  }
}
