import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const supplies = await prisma.supply.findMany({
      orderBy: { nombre: 'asc' },
    });
    return NextResponse.json(supplies);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener insumos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();

    const stock = Number(body.stock) || 0;
    const stockMinimo = Number(body.stockMinimo) || 5;
    const estado = stock <= stockMinimo ? 'Bajo Stock' : 'Disponible';

    const supply = await prisma.supply.create({
      data: {
        nombre: body.nombre,
        categoria: body.categoria,
        proveedor: body.proveedor || null,
        unidad: body.unidad || 'Unidad',
        stock,
        stockMinimo,
        costo: Number(body.costo) || 0,
        ubicacion: body.ubicacion || null,
        estado,
      },
    });

    return NextResponse.json(supply, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear insumo' }, { status: 500 });
  }
}
