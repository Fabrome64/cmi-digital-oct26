import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'ADMIN',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`,

      `CREATE TABLE IF NOT EXISTS "Client" (
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
      );`,

      `CREATE TABLE IF NOT EXISTS "WebPortfolio" (
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
      );`,

      `CREATE TABLE IF NOT EXISTS "MarketingService" (
        "id" TEXT NOT NULL,
        "titulo" TEXT NOT NULL,
        "descripcion" TEXT NOT NULL,
        "icono" TEXT NOT NULL DEFAULT 'Share2',
        "imagen" TEXT,
        "precioOpcional" TEXT,
        "destacado" BOOLEAN NOT NULL DEFAULT false,
        "orden" INTEGER NOT NULL DEFAULT 0,
        "activo" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MarketingService_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "PrintProduct" (
        "id" TEXT NOT NULL,
        "nombre" TEXT NOT NULL,
        "descripcion" TEXT NOT NULL,
        "categoria" TEXT NOT NULL,
        "imagen" TEXT NOT NULL,
        "galeria" TEXT NOT NULL DEFAULT '[]',
        "precio" DOUBLE PRECISION,
        "unidad" TEXT DEFAULT 'm2',
        "medidas" TEXT,
        "destacado" BOOLEAN NOT NULL DEFAULT false,
        "orden" INTEGER NOT NULL DEFAULT 0,
        "activo" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PrintProduct_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "Budget" (
        "id" TEXT NOT NULL,
        "clienteId" TEXT,
        "clienteNombre" TEXT NOT NULL,
        "empresa" TEXT,
        "telefono" TEXT,
        "whatsapp" TEXT,
        "email" TEXT,
        "servicio" TEXT NOT NULL,
        "producto" TEXT,
        "descripcion" TEXT NOT NULL,
        "cantidad" INTEGER NOT NULL DEFAULT 1,
        "medidas" TEXT,
        "archivo" TEXT,
        "estado" TEXT NOT NULL DEFAULT 'Nuevo',
        "monto" DOUBLE PRECISION DEFAULT 0,
        "observaciones" TEXT,
        "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "WebSubscription" (
        "id" TEXT NOT NULL,
        "clienteId" TEXT,
        "clienteNombre" TEXT NOT NULL,
        "sitio" TEXT NOT NULL,
        "dominio" TEXT,
        "hosting" TEXT,
        "fechaInicio" TIMESTAMP(3) NOT NULL,
        "fechaVencimiento" TIMESTAMP(3) NOT NULL,
        "importe" DOUBLE PRECISION NOT NULL,
        "periodicidad" TEXT NOT NULL DEFAULT 'Mensual',
        "estado" TEXT NOT NULL DEFAULT 'Activo',
        "observaciones" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WebSubscription_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "Supply" (
        "id" TEXT NOT NULL,
        "nombre" TEXT NOT NULL,
        "categoria" TEXT NOT NULL,
        "proveedor" TEXT,
        "unidad" TEXT NOT NULL,
        "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "stockMinimo" DOUBLE PRECISION NOT NULL DEFAULT 5,
        "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "ubicacion" TEXT,
        "estado" TEXT NOT NULL DEFAULT 'Disponible',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Supply_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL,
        "nombre" TEXT NOT NULL,
        "tipo" TEXT NOT NULL DEFAULT 'PRODUCTO',
        "categoria" TEXT NOT NULL,
        "descripcion" TEXT NOT NULL,
        "precio" DOUBLE PRECISION NOT NULL,
        "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "imagen" TEXT,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "unidad" TEXT NOT NULL DEFAULT 'unidad',
        "activo" BOOLEAN NOT NULL DEFAULT true,
        "destacado" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "Expense" (
        "id" TEXT NOT NULL,
        "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "concepto" TEXT NOT NULL,
        "categoria" TEXT NOT NULL,
        "proveedor" TEXT,
        "monto" DOUBLE PRECISION NOT NULL,
        "medioPago" TEXT NOT NULL DEFAULT 'Transferencia',
        "comprobante" TEXT,
        "observaciones" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
      );`,

      `CREATE TABLE IF NOT EXISTS "Setting" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "description" TEXT,
        "group" TEXT NOT NULL DEFAULT 'general',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
      );`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Setting_key_key" ON "Setting"("key");`,

      `CREATE TABLE IF NOT EXISTS "Media" (
        "id" TEXT NOT NULL,
        "filename" TEXT NOT NULL,
        "originalName" TEXT NOT NULL,
        "mimeType" TEXT NOT NULL,
        "size" INTEGER NOT NULL,
        "url" TEXT NOT NULL,
        "altText" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
      );`,
    ];

    for (const sql of sqlStatements) {
      await prisma.$executeRawUnsafe(sql);
    }

    return NextResponse.json({
      success: true,
      message: 'Base de datos sincronizada correctamente. Todas las tablas creadas en PostgreSQL.',
    });
  } catch (error: any) {
    console.error('Error sincronizando tablas en Postgres:', error);
    return NextResponse.json({
      success: false,
      error: error?.message,
    }, { status: 500 });
  }
}
