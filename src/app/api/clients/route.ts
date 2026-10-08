import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { getMemoryClients } from '@/lib/memoryDataStore';
import { sanitizeUppercasePayload } from '@/lib/stringUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createClientTableSQL = `
CREATE TABLE IF NOT EXISTS "Client" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "apellido" TEXT,
  "empresa" TEXT,
  "cuitDni" TEXT,
  "telefono" TEXT,
  "whatsapp" TEXT,
  "email" TEXT,
  "direccion" TEXT,
  "localidad" TEXT,
  "provincia" TEXT,
  "observaciones" TEXT,
  "estado" TEXT NOT NULL DEFAULT 'Activo',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);`;

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { budgets: true, subscriptions: true } },
      },
    });
    return NextResponse.json(clients);
  } catch (error: any) {
    console.warn('DB error on GET /api/clients, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createClientTableSQL);
      const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(clients);
    } catch {
      return NextResponse.json(getMemoryClients());
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const rawData = {
    nombre: body.nombre,
    apellido: body.apellido || null,
    empresa: body.empresa || null,
    cuitDni: body.cuitDni || null,
    telefono: body.telefono || null,
    whatsapp: body.whatsapp || null,
    email: body.email || null,
    direccion: body.direccion || null,
    localidad: body.localidad || 'SAN JOSÉ DE FELICIANO',
    provincia: body.provincia || 'ENTRE RÍOS',
    observaciones: body.observaciones || null,
    estado: body.estado || 'Activo',
  };
  const dataToSave = sanitizeUppercasePayload(rawData);

  try {
    const client = await prisma.client.create({ data: dataToSave });
    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    console.warn('DB error on POST /api/clients, creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createClientTableSQL);
      const client = await prisma.client.create({ data: dataToSave });
      return NextResponse.json(client, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating client:', retryError);
      return NextResponse.json({ error: 'Error al registrar cliente en la base de datos' }, { status: 500 });
    }
  }
}
