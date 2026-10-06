import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: {
        fecha: body.fecha ? new Date(body.fecha) : undefined,
        concepto: body.concepto,
        categoria: body.categoria,
        proveedor: body.proveedor || null,
        monto: Number(body.monto) || 0,
        medioPago: body.medioPago,
        comprobante: body.comprobante || null,
        observaciones: body.observaciones || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar gasto' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar gasto' }, { status: 500 });
  }
}
