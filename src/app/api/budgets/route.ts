import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const budgets = await prisma.budget.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cliente: true },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener presupuestos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.clienteNombre || !body.descripcion || !body.servicio) {
      return NextResponse.json(
        { error: 'Nombre, servicio y descripción son requeridos.' },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        clienteNombre: body.clienteNombre,
        empresa: body.empresa || null,
        telefono: body.telefono || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        servicio: body.servicio,
        producto: body.producto || null,
        descripcion: body.descripcion,
        cantidad: body.cantidad ? Number(body.cantidad) : 1,
        medidas: body.medidas || null,
        archivo: body.archivo || null,
        observaciones: body.observaciones || null,
        estado: 'Nuevo',
      },
    });

    return NextResponse.json({ success: true, budget }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Error al registrar solicitud de presupuesto' }, { status: 500 });
  }
}
