import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('categoria');
    const featuredOnly = searchParams.get('destacado') === 'true';

    const where: any = {};
    if (category && category !== 'Todos') where.categoria = category;
    if (featuredOnly) where.destacado = true;

    where.activo = true;

    const portfolio = await prisma.webPortfolio.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(portfolio, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching web portfolio:', error);
    return NextResponse.json({ error: 'Error al obtener portfolio' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const item = await prisma.webPortfolio.create({
      data: {
        titulo: body.titulo,
        cliente: body.cliente,
        descripcion: body.descripcion,
        imagenPrincipal: body.imagenPrincipal,
        imagenes: body.imagenes ? JSON.stringify(body.imagenes) : '[]',
        url: body.url || null,
        categoria: body.categoria,
        tecnologias: body.tecnologias,
        destacado: Boolean(body.destacado),
        orden: Number(body.orden) || 0,
        activo: body.activo !== undefined ? Boolean(body.activo) : true,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json({ error: 'Error al crear proyecto de portfolio' }, { status: 500 });
  }
}
