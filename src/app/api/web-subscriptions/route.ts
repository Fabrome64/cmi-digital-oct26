import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { sanitizeUppercasePayload } from '@/lib/stringUtils';

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const subscriptions = await prisma.webSubscription.findMany({
      orderBy: { fechaVencimiento: 'asc' },
      include: { cliente: true },
    });
    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener abonos web' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const rawData = {
      clienteId: body.clienteId || null,
      clienteNombre: body.clienteNombre,
      sitio: body.sitio,
      dominio: body.dominio || null,
      hosting: body.hosting || null,
      fechaInicio: new Date(body.fechaInicio),
      fechaVencimiento: new Date(body.fechaVencimiento),
      importe: Number(body.importe),
      periodicidad: body.periodicidad || 'Mensual',
      estado: body.estado || 'Activo',
      observaciones: body.observaciones || null,
    };
    const dataToSave = sanitizeUppercasePayload(rawData);

    const subscription = await prisma.webSubscription.create({
      data: dataToSave,
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear abono web' }, { status: 500 });
  }
}
