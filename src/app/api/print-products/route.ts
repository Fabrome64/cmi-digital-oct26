import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('categoria');

    const where: any = { activo: true };
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
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener catálogo de impresiones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const product = await prisma.printProduct.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        imagen: body.imagen,
        galeria: body.galeria ? (typeof body.galeria === 'string' ? body.galeria : JSON.stringify(body.galeria)) : '[]',
        precio: body.precio ? Number(body.precio) : null,
        unidad: body.unidad || 'm2',
        medidas: body.medidas || null,
        destacado: Boolean(body.destacado),
        orden: Number(body.orden) || 0,
        activo: body.activo !== undefined ? Boolean(body.activo) : true,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto de impresión' }, { status: 500 });
  }
}
