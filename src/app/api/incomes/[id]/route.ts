import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemoryIncome, deleteMemoryIncome } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

  updateMemoryIncome(params.id, {
    ...dataToSave,
    fecha: dataToSave.fecha.toISOString(),
  });

  try {
    const updated = await prisma.income.update({
      where: { id: params.id },
      data: dataToSave,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.warn('DB error updating income, memory updated:', error);
    return NextResponse.json({ id: params.id, ...dataToSave });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemoryIncome(params.id);

  try {
    await prisma.income.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('DB error deleting income, memory deleted:', error);
    return NextResponse.json({ success: true });
  }
}
