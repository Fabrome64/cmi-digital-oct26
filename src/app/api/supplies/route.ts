import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemorySupplies } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createSupplyTableSQL = `
CREATE TABLE IF NOT EXISTS "Supply" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "proveedor" TEXT,
  "unidad" TEXT NOT NULL,
  "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "stockMinimo" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "ubicacion" TEXT,
  "estado" TEXT NOT NULL DEFAULT 'Disponible',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Supply_pkey" PRIMARY KEY ("id")
);`;

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const supplies = await prisma.supply.findMany({
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(supplies, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error on GET /api/supplies, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createSupplyTableSQL);
      const supplies = await prisma.supply.findMany({ orderBy: { nombre: 'asc' } });
      return NextResponse.json(supplies, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemorySupplies(), { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const stock = Number(body.stock) || 0;
  const stockMinimo = Number(body.stockMinimo) || 5;
  const estado = stock <= stockMinimo ? 'Bajo Stock' : 'Disponible';

  const dataToSave = {
    nombre: body.nombre,
    categoria: body.categoria || 'General',
    proveedor: body.proveedor || null,
    unidad: body.unidad || 'Unidad',
    stock,
    stockMinimo,
    costo: Number(body.costo) || 0,
    ubicacion: body.ubicacion || null,
    estado,
  };

  try {
    const supply = await prisma.supply.create({ data: dataToSave });
    return NextResponse.json(supply, { status: 201 });
  } catch (error: any) {
    console.warn('DB error on POST /api/supplies, auto creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createSupplyTableSQL);
      const supply = await prisma.supply.create({ data: dataToSave });
      return NextResponse.json(supply, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating supply:', retryError);
      return NextResponse.json({ error: 'Error al registrar insumo en la base de datos' }, { status: 500 });
    }
  }
}
