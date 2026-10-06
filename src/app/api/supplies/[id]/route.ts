import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();

    const stock = Number(body.stock) || 0;
    const stockMinimo = Number(body.stockMinimo) || 5;
    const estado = stock <= stockMinimo ? 'Bajo Stock' : 'Disponible';

    const updated = await prisma.supply.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        categoria: body.categoria,
        proveedor: body.proveedor || null,
        unidad: body.unidad,
        stock,
        stockMinimo,
        costo: Number(body.costo) || 0,
        ubicacion: body.ubicacion || null,
        estado,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar insumo' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.supply.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar insumo' }, { status: 500 });
  }
}
