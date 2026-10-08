import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryBudgetMaterials, createMemoryBudgetMaterial } from '@/lib/memoryDataStore';
import { sanitizeUppercasePayload } from '@/lib/stringUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createBudgetMaterialTableSQL = `
CREATE TABLE IF NOT EXISTS "BudgetMaterial" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "rubro" TEXT NOT NULL,
  "unidadCalculo" TEXT NOT NULL,
  "precioUnitario" DOUBLE PRECISION NOT NULL,
  "observaciones" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BudgetMaterial_pkey" PRIMARY KEY ("id")
);`;

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const materials = await (prisma as any).budgetMaterial.findMany({
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(materials, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error on GET /api/budget-materials, using fallback memory store:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createBudgetMaterialTableSQL);
      const materials = await (prisma as any).budgetMaterial.findMany({ orderBy: { nombre: 'asc' } });
      return NextResponse.json(materials, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemoryBudgetMaterials(), { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  }
}

export async function POST(request: Request) {
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

  const memoryItem = createMemoryBudgetMaterial(dataToSave);

  try {
    const material = await (prisma as any).budgetMaterial.create({ data: dataToSave });
    return NextResponse.json(material, { status: 201 });
  } catch (error: any) {
    console.warn('DB error on POST /api/budget-materials, returning memory material:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createBudgetMaterialTableSQL);
      const material = await (prisma as any).budgetMaterial.create({ data: dataToSave });
      return NextResponse.json(material, { status: 201 });
    } catch {
      return NextResponse.json(memoryItem, { status: 201 });
    }
  }
}
