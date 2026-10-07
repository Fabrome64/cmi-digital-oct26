import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryProducts, createMemoryProduct } from '@/lib/memoryDataStore';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.warn('DB error on GET /api/products, returning memory store:', error);
    return NextResponse.json(getMemoryProducts());
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const memoryProduct = createMemoryProduct(body);

  try {
    const product = await prisma.product.create({
      data: {
        nombre: body.nombre,
        tipo: body.tipo || 'PRODUCTO',
        categoria: body.categoria,
        descripcion: body.descripcion,
        precio: Number(body.precio) || 0,
        costo: Number(body.costo) || 0,
        imagen: body.imagen || null,
        stock: Number(body.stock) || 0,
        unidad: body.unidad || 'unidad',
        activo: body.activo !== undefined ? Boolean(body.activo) : true,
        destacado: Boolean(body.destacado),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.warn('DB error on POST /api/products, returning memory product:', error);
    return NextResponse.json(memoryProduct, { status: 201 });
  }
}
