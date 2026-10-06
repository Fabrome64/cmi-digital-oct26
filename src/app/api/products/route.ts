import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
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
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
