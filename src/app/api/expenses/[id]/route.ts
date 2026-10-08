import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemoryExpense, deleteMemoryExpense } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function parseLocalDate(fechaVal: any): Date {
  if (!fechaVal) return new Date();
  if (typeof fechaVal === 'string') {
    if (fechaVal.includes('T')) return new Date(fechaVal);
    return new Date(`${fechaVal}T12:00:00`);
  }
  return new Date(fechaVal);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const dataToSave = {
    fecha: body.fecha ? parseLocalDate(body.fecha) : undefined,
    concepto: body.concepto,
    categoria: body.categoria,
    proveedor: body.proveedor || null,
    monto: Number(body.monto) || 0,
    medioPago: body.medioPago,
    comprobante: body.comprobante || null,
    observaciones: body.observaciones || null,
  };

  updateMemoryExpense(params.id, dataToSave);

  try {
    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: dataToSave,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.warn('DB error on PUT /api/expenses/[id], returning memoryUpdated:', error);
    return NextResponse.json({ id: params.id, ...dataToSave });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemoryExpense(params.id);

  try {
    await prisma.expense.delete({ where: { id: params.id } });
  } catch (error) {
    console.warn('DB error on DELETE /api/expenses/[id], ignored for memory fallback:', error);
  }
  return NextResponse.json({ success: true });
}
