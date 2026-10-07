import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryClients, createMemoryClient } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    console.warn('DB error on GET /api/clients, returning memory store:', error);
    return NextResponse.json(getMemoryClients());
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const memoryClient = createMemoryClient(body);

  try {
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
    console.warn('DB error on POST /api/clients, returning memory client:', error);
    return NextResponse.json(memoryClient, { status: 201 });
  }
}
