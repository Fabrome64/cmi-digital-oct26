import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getMemorySettings, updateMemorySettings } from '@/lib/settingsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const settingsList = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = { ...getMemorySettings() };
    settingsList.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    return NextResponse.json(
      { map: settingsMap, raw: settingsList },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Database read fallback for settings:', error);
    return NextResponse.json(
      { map: getMemorySettings(), raw: [] },
      { headers: corsHeaders }
    );
  }
}

async function handleSaveSettings(request: Request) {
  try {
    const body = await request.json();
    const updates = Array.isArray(body)
      ? body
      : Object.entries(body).map(([key, value]) => ({ key, value: String(value ?? '') }));

    const updateMap: Record<string, string> = {};
    updates.forEach((u) => {
      updateMap[u.key] = u.value;
    });

    // Update in-memory fallback store
    updateMemorySettings(updateMap);

    try {
      for (const item of updates) {
        await prisma.setting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: {
            key: item.key,
            value: item.value,
            group: 'custom',
          },
        });
      }
    } catch (dbError) {
      console.warn('Prisma save failed, using memory store fallback:', dbError);
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/configuracion');

    let settingsMap: Record<string, string> = { ...getMemorySettings() };
    try {
      const settingsList = await prisma.setting.findMany();
      settingsList.forEach((item) => {
        settingsMap[item.key] = item.value;
      });
    } catch (e) {
      // ignore
    }

    return NextResponse.json(
      { success: true, message: '¡Configuración guardada exitosamente!', map: settingsMap },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error?.message || 'Error al guardar configuraciones' }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request: Request) {
  return handleSaveSettings(request);
}

export async function POST(request: Request) {
  return handleSaveSettings(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
