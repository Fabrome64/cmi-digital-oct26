import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const item = await prisma.webPortfolio.create({
      data: {
        titulo: 'Prueba Diagnostica DB',
        cliente: 'Cliente Test',
        descripcion: 'Prueba de insercion real en Postgres',
        imagenPrincipal: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
        categoria: 'Inmobiliaria',
        tecnologias: 'Next.js',
        destacado: true,
        orden: 1,
        activo: true,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      errorName: error?.name,
      errorMessage: error?.message,
      errorCode: error?.code,
      meta: error?.meta,
    }, { status: 500 });
  }
}
