import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getMemoryPortfolio, createMemoryPortfolio } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('categoria');
    const featuredOnly = searchParams.get('destacado') === 'true';
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (category && category !== 'Todos') where.categoria = category;
    if (featuredOnly) where.destacado = true;
    if (!all) where.activo = true;

    const portfolio = await prisma.webPortfolio.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(portfolio, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.warn('DB error fetching web portfolio, returning memory store:', error);
    return NextResponse.json(getMemoryPortfolio(), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const memoryItem = createMemoryPortfolio({
    titulo: body.titulo,
    cliente: body.cliente,
    descripcion: body.descripcion,
    imagenPrincipal: body.imagenPrincipal,
    imagenes: body.imagenes ? (typeof body.imagenes === 'string' ? body.imagenes : JSON.stringify(body.imagenes)) : '[]',
    url: body.url || null,
    categoria: body.categoria,
    tecnologias: body.tecnologias,
    destacado: Boolean(body.destacado),
    orden: Number(body.orden) || 0,
    activo: body.activo !== undefined ? Boolean(body.activo) : true,
  });

  try {
    const item = await prisma.webPortfolio.create({
      data: {
        titulo: body.titulo,
        cliente: body.cliente,
        descripcion: body.descripcion,
        imagenPrincipal: body.imagenPrincipal,
        imagenes: body.imagenes ? (typeof body.imagenes === 'string' ? body.imagenes : JSON.stringify(body.imagenes)) : '[]',
        url: body.url || null,
        categoria: body.categoria,
        tecnologias: body.tecnologias,
        destacado: Boolean(body.destacado),
        orden: Number(body.orden) || 0,
        activo: body.activo !== undefined ? Boolean(body.activo) : true,
      },
    });

    try { revalidatePath('/', 'layout'); } catch (e) {}
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.warn('DB error creating portfolio item, returning memory item:', error);
    return NextResponse.json(memoryItem, { status: 201 });
  }
}
