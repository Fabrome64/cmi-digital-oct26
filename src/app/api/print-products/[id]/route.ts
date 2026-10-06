import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await prisma.printProduct.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        imagen: body.imagen,
        galeria: body.galeria ? (typeof body.galeria === 'string' ? body.galeria : JSON.stringify(body.galeria)) : '[]',
        precio: body.precio ? Number(body.precio) : null,
        unidad: body.unidad || 'm2',
        medidas: body.medidas || null,
        destacado: Boolean(body.destacado),
        orden: Number(body.orden) || 0,
        activo: Boolean(body.activo),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.printProduct.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
