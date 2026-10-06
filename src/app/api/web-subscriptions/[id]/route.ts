import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await prisma.webSubscription.update({
      where: { id: params.id },
      data: {
        clienteId: body.clienteId || null,
        clienteNombre: body.clienteNombre,
        sitio: body.sitio,
        dominio: body.dominio || null,
        hosting: body.hosting || null,
        fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : undefined,
        fechaVencimiento: body.fechaVencimiento ? new Date(body.fechaVencimiento) : undefined,
        importe: body.importe !== undefined ? Number(body.importe) : undefined,
        periodicidad: body.periodicidad,
        estado: body.estado,
        observaciones: body.observaciones,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar abono web' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.webSubscription.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar abono web' }, { status: 500 });
  }
}
