import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryExpenses, createMemoryExpense } from '@/lib/memoryDataStore';

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { fecha: 'desc' },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.warn('DB error on GET /api/expenses, returning memory store:', error);
    return NextResponse.json(getMemoryExpenses());
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const memoryExpense = createMemoryExpense(body);

  try {
    const expense = await prisma.expense.create({
      data: {
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
        concepto: body.concepto,
        categoria: body.categoria,
        proveedor: body.proveedor || null,
        monto: Number(body.monto) || 0,
        medioPago: body.medioPago || 'Transferencia',
        comprobante: body.comprobante || null,
        observaciones: body.observaciones || null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.warn('DB error on POST /api/expenses, returning memory expense:', error);
    return NextResponse.json(memoryExpense, { status: 201 });
  }
}
