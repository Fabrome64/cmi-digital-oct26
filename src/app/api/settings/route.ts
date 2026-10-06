import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const settingsList = await prisma.setting.findMany();
    // Transform array to key-value dictionary for easy access in frontend
    const settingsMap: Record<string, string> = {};
    settingsList.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    return NextResponse.json({ map: settingsMap, raw: settingsList });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener configuraciones' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json(); // Array of { key, value } or object map
    const updates = Array.isArray(body)
      ? body
      : Object.entries(body).map(([key, value]) => ({ key, value: String(value) }));

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Error al guardar configuraciones' }, { status: 500 });
  }
}
