import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const services = await prisma.marketingService.findMany({
      where: { activo: true },
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener servicios de marketing' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const service = await prisma.marketingService.create({
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        icono: body.icono || 'Share2',
        imagen: body.imagen || null,
        precioOpcional: body.precioOpcional || null,
        destacado: Boolean(body.destacado),
        orden: Number(body.orden) || 0,
        activo: body.activo !== undefined ? Boolean(body.activo) : true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}
