import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryExpenses } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createExpenseTableSQL = `
CREATE TABLE IF NOT EXISTS "Expense" (
  "id" TEXT NOT NULL,
  "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "concepto" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "proveedor" TEXT,
  "monto" DOUBLE PRECISION NOT NULL,
  "medioPago" TEXT NOT NULL DEFAULT 'Transferencia',
  "comprobante" TEXT,
  "observaciones" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);`;

function parseLocalDate(fechaVal: any): Date {
  if (!fechaVal) return new Date();
  if (typeof fechaVal === 'string') {
    if (fechaVal.includes('T')) return new Date(fechaVal);
    return new Date(`${fechaVal}T12:00:00`);
  }
  return new Date(fechaVal);
}

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { fecha: 'desc' },
    });
    return NextResponse.json(expenses, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error on GET /api/expenses, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createExpenseTableSQL);
      const expenses = await prisma.expense.findMany({ orderBy: { fecha: 'desc' } });
      return NextResponse.json(expenses, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemoryExpenses(), { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const dataToSave = {
    fecha: parseLocalDate(body.fecha),
    concepto: body.concepto || 'Gasto General',
    categoria: body.categoria || 'Otros',
    proveedor: body.proveedor || null,
    monto: Number(body.monto) || 0,
    medioPago: body.medioPago || 'Transferencia',
    comprobante: body.comprobante || null,
    observaciones: body.observaciones || null,
  };

  try {
    const expense = await prisma.expense.create({ data: dataToSave });
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.warn('DB error on POST /api/expenses, creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createExpenseTableSQL);
      const expense = await prisma.expense.create({ data: dataToSave });
      return NextResponse.json(expense, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating expense:', retryError);
      return NextResponse.json({ error: 'Error al guardar el gasto en la base de datos' }, { status: 500 });
    }
  }
}
