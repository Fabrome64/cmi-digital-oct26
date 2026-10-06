import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await prisma.marketingService.update({
      where: { id: params.id },
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        icono: body.icono || 'Share2',
        imagen: body.imagen || null,
        precioOpcional: body.precioOpcional || null,
        destacado: Boolean(body.destacado),
        orden: Number(body.orden) || 0,
        activo: Boolean(body.activo),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.marketingService.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 });
  }
}
