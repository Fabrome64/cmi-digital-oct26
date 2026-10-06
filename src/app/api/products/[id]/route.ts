import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        tipo: body.tipo,
        categoria: body.categoria,
        descripcion: body.descripcion,
        precio: Number(body.precio) || 0,
        costo: Number(body.costo) || 0,
        imagen: body.imagen || null,
        stock: Number(body.stock) || 0,
        unidad: body.unidad,
        activo: Boolean(body.activo),
        destacado: Boolean(body.destacado),
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
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
