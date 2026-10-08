import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemoryBudgetMaterial, deleteMemoryBudgetMaterial } from '@/lib/memoryDataStore';
import { sanitizeUppercasePayload } from '@/lib/stringUtils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const rawData = {
    nombre: body.nombre,
    rubro: body.rubro || 'IMPRENTA GRÁFICA',
    unidadCalculo: body.unidadCalculo || 'METRO CUADRADO',
    precioUnitario: Number(body.precioUnitario) || 0,
    observaciones: body.observaciones || null,
  };

  const dataToSave = sanitizeUppercasePayload(rawData);
  const memoryUpdated = updateMemoryBudgetMaterial(params.id, dataToSave);

  try {
    const updated = await prisma.budgetMaterial.update({
      where: { id: params.id },
      data: dataToSave,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.warn('DB error on PUT /api/budget-materials/[id], returning memoryUpdated:', error);
    return NextResponse.json(memoryUpdated || { id: params.id, ...dataToSave });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemoryBudgetMaterial(params.id);

  try {
    await prisma.budgetMaterial.delete({ where: { id: params.id } });
  } catch (error) {
    console.warn('DB error on DELETE /api/budget-materials/[id], ignored for memory fallback:', error);
  }

  return NextResponse.json({ success: true });
}
