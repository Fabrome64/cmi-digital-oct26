import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemoryPortfolio, deleteMemoryPortfolio } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.webPortfolio.findUnique({ where: { id: params.id } });
    if (!item) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener proyecto' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const memoryUpdated = updateMemoryPortfolio(params.id, body);

  try {
    const updated = await prisma.webPortfolio.update({
      where: { id: params.id },
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
        activo: Boolean(body.activo),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.warn('DB error updating portfolio item, using memory fallback:', error);
    return NextResponse.json(memoryUpdated || { id: params.id, ...body });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemoryPortfolio(params.id);

  try {
    await prisma.webPortfolio.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('DB error deleting portfolio item, memory deleted:', error);
    return NextResponse.json({ success: true });
  }
}
