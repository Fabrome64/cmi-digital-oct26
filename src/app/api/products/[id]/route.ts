import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemoryProduct, deleteMemoryProduct } from '@/lib/memoryDataStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const memoryUpdated = updateMemoryProduct(params.id, body);

  try {
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
    console.warn('DB error on PUT /api/products/[id], returning memoryUpdated:', error);
    return NextResponse.json(memoryUpdated || { id: params.id, ...body });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemoryProduct(params.id);

  try {
    await prisma.product.delete({ where: { id: params.id } });
  } catch (error) {
    console.warn('DB error on DELETE /api/products/[id], ignored for memory fallback:', error);
  }
  return NextResponse.json({ success: true });
}
