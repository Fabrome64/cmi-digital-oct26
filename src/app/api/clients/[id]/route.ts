import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await prisma.client.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido || null,
        empresa: body.empresa || null,
        cuitDni: body.cuitDni || null,
        telefono: body.telefono || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        direccion: body.direccion || null,
        localidad: body.localidad || null,
        provincia: body.provincia || null,
        observaciones: body.observaciones || null,
        estado: body.estado || 'Activo',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}
