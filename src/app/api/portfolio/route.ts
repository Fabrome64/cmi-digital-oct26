import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getMemoryPortfolio } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const createWebPortfolioTableSQL = `
CREATE TABLE IF NOT EXISTS "WebPortfolio" (
  "id" TEXT NOT NULL,
  "titulo" TEXT NOT NULL,
  "cliente" TEXT NOT NULL,
  "descripcion" TEXT NOT NULL,
  "imagenPrincipal" TEXT NOT NULL,
  "imagenes" TEXT NOT NULL DEFAULT '[]',
  "url" TEXT,
  "categoria" TEXT NOT NULL,
  "tecnologias" TEXT NOT NULL,
  "destacado" BOOLEAN NOT NULL DEFAULT false,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebPortfolio_pkey" PRIMARY KEY ("id")
);`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('categoria');
    const featuredOnly = searchParams.get('destacado') === 'true';
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (category && category !== 'Todos') where.categoria = category;
    if (featuredOnly) where.destacado = true;
    if (!all) where.activo = true;

    const portfolio = await prisma.webPortfolio.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(portfolio, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.warn('DB error fetching web portfolio, auto-ensuring table:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createWebPortfolioTableSQL);
      const portfolio = await prisma.webPortfolio.findMany({
        orderBy: [{ orden: 'asc' }, { createdAt: 'desc' }],
      });
      return NextResponse.json(portfolio, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
      return NextResponse.json(getMemoryPortfolio(), { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
  }
}

export async function POST(request: Request) {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();

  const dataToSave = {
    titulo: body.titulo,
    cliente: body.cliente,
    descripcion: body.descripcion,
    imagenPrincipal: body.imagenPrincipal,
    imagenes: body.imagenes ? (typeof body.imagenes === 'string' ? body.imagenes : JSON.stringify(body.imagenes)) : '[]',
    url: body.url || null,
    categoria: body.categoria || 'General',
    tecnologias: body.tecnologias || 'Next.js',
    destacado: Boolean(body.destacado),
    orden: Number(body.orden) || 0,
    activo: body.activo !== undefined ? Boolean(body.activo) : true,
  };

  try {
    const item = await prisma.webPortfolio.create({ data: dataToSave });
    try { revalidatePath('/', 'layout'); } catch (e) {}
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.warn('DB error creating portfolio item, creating table and retrying:', error?.message);
    try {
      await prisma.$executeRawUnsafe(createWebPortfolioTableSQL);
      const item = await prisma.webPortfolio.create({ data: dataToSave });
      try { revalidatePath('/', 'layout'); } catch (e) {}
      return NextResponse.json(item, { status: 201 });
    } catch (retryError: any) {
      console.error('Final DB error creating portfolio:', retryError);
      return NextResponse.json({ error: 'Error al registrar proyecto en la base de datos' }, { status: 500 });
    }
  }
}
