import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { updateMemoryClient, deleteMemoryClient } from '@/lib/memoryDataStore';
import { sanitizeUppercasePayload } from '@/lib/stringUtils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const rawBody = await request.json();
  const body = sanitizeUppercasePayload(rawBody);
  const memoryUpdated = updateMemoryClient(params.id, body);

  try {
    const updated = await prisma.client.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido || null,
        empresa: body.empresa || null,
        cuitDni: body.cuitDni || null,
        telefono: body.telefono || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        direccion: body.direccion || null,
        localidad: body.localidad || null,
        provincia: body.provincia || null,
        observaciones: body.observaciones || null,
        estado: body.estado || 'Activo',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.warn('DB error on PUT /api/clients/[id], returning memoryUpdated:', error);
    return NextResponse.json(memoryUpdated || { id: params.id, ...body });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  deleteMemoryClient(params.id);

  try {
    await prisma.client.delete({ where: { id: params.id } });
  } catch (error) {
    console.warn('DB error on DELETE /api/clients/[id], ignored for memory fallback:', error);
  }
  return NextResponse.json({ success: true });
}
