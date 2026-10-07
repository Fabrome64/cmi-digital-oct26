import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getMemoryProducts } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createProductTableSQL = `
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "tipo" TEXT NOT NULL DEFAULT 'PRODUCTO',
  "categoria" TEXT NOT NULL,
  "descripcion" TEXT NOT NULL,
  "precio" DOUBLE PRECISION NOT NULL,
  "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "imagen" TEXT,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "unidad" TEXT NOT NULL DEFAULT 'unidad',
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "destacado" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);`;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error on GET /api/products, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createProductTableSQL);
      const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemoryProducts());
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const dataToSave = {
    nombre: body.nombre,
    tipo: body.tipo || 'PRODUCTO',
    categoria: body.categoria || 'General',
    descripcion: body.descripcion || '',
    precio: Number(body.precio) || 0,
    costo: Number(body.costo) || 0,
    imagen: body.imagen || null,
    stock: Number(body.stock) || 0,
    unidad: body.unidad || 'unidad',
    activo: body.activo !== undefined ? Boolean(body.activo) : true,
    destacado: Boolean(body.destacado),
  };

  try {
    const product = await prisma.product.create({ data: dataToSave });
    try { revalidatePath('/', 'layout'); } catch (e) {}
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.warn('DB error creating product, auto creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createProductTableSQL);
      const product = await prisma.product.create({ data: dataToSave });
      try { revalidatePath('/', 'layout'); } catch (e) {}
      return NextResponse.json(product, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating product:', retryError);
      return NextResponse.json({ error: 'Error al registrar producto comercial' }, { status: 500 });
    }
  }
}
