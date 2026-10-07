import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getMemoryProducts } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createPrintProductTableSQL = `
CREATE TABLE IF NOT EXISTS "PrintProduct" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "descripcion" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "imagen" TEXT NOT NULL,
  "galeria" TEXT NOT NULL DEFAULT '[]',
  "precio" DOUBLE PRECISION,
  "unidad" TEXT DEFAULT 'm2',
  "medidas" TEXT,
  "destacado" BOOLEAN NOT NULL DEFAULT false,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PrintProduct_pkey" PRIMARY KEY ("id")
);`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('categoria');
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (!all) where.activo = true;
    if (category && category !== 'Todos') {
      where.categoria = category;
    }

    const products = await prisma.printProduct.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error fetching print products, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createPrintProductTableSQL);
      const products = await prisma.printProduct.findMany({
        orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
      });
      return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemoryProducts(), { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const dataToSave = {
    nombre: body.nombre,
    descripcion: body.descripcion,
    categoria: body.categoria || 'Banners',
    imagen: body.imagen,
    galeria: body.galeria ? (typeof body.galeria === 'string' ? body.galeria : JSON.stringify(body.galeria)) : '[]',
    precio: body.precio ? Number(body.precio) : null,
    unidad: body.unidad || 'm2',
    medidas: body.medidas || null,
    destacado: Boolean(body.destacado),
    orden: Number(body.orden) || 0,
    activo: body.activo !== undefined ? Boolean(body.activo) : true,
  };

  try {
    const product = await prisma.printProduct.create({ data: dataToSave });
    try { revalidatePath('/', 'layout'); } catch (e) {}
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.warn('DB error creating print product, creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createPrintProductTableSQL);
      const product = await prisma.printProduct.create({ data: dataToSave });
      try { revalidatePath('/', 'layout'); } catch (e) {}
      return NextResponse.json(product, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating print product:', retryError);
      return NextResponse.json({ error: 'Error al registrar producto en la base de datos' }, { status: 500 });
    }
  }
}
