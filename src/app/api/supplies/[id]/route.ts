import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemorySupply, deleteMemorySupply } from '@/lib/memoryDataStore';
import { sanitizeUppercasePayload } from '@/lib/stringUtils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const stock = Number(body.stock) || 0;
  const stockMinimo = Number(body.stockMinimo) || 5;
  const estado = stock <= stockMinimo ? 'BAJO STOCK' : 'DISPONIBLE';

  const rawData = {
    nombre: body.nombre,
    categoria: body.categoria,
    proveedor: body.proveedor || null,
    unidad: body.unidad,
    stock,
    stockMinimo,
    costo: Number(body.costo) || 0,
    ubicacion: body.ubicacion || null,
    estado,
  };

  const dataToSave = sanitizeUppercasePayload(rawData);
  const memoryUpdated = updateMemorySupply(params.id, dataToSave);

  try {
    const updated = await prisma.supply.update({
      where: { id: params.id },
      data: dataToSave,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.warn('DB error on PUT /api/supplies/[id], returning memoryUpdated:', error);
    return NextResponse.json(memoryUpdated || { id: params.id, ...dataToSave });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemorySupply(params.id);

  try {
    await prisma.supply.delete({ where: { id: params.id } });
  } catch (error) {
    console.warn('DB error on DELETE /api/supplies/[id], ignored for memory fallback:', error);
  }

  return NextResponse.json({ success: true });
}
