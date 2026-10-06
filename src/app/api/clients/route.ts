import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { budgets: true, subscriptions: true },
        },
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const client = await prisma.client.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido || null,
        empresa: body.empresa || null,
        cuitDni: body.cuitDni || null,
        telefono: body.telefono || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        direccion: body.direccion || null,
        localidad: body.localidad || 'San José de Feliciano',
        provincia: body.provincia || 'Entre Ríos',
        observaciones: body.observaciones || null,
        estado: body.estado || 'Activo',
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 });
  }
}
