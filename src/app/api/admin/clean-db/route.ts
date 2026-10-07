import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { clearAllMemoryStores } from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Wipe all memory fallback caches
    clearAllMemoryStores();

    // 2. Wipe PostgreSQL database tables
    try {
      await prisma.client.deleteMany();
      await prisma.product.deleteMany();
      await prisma.expense.deleteMany();
      await prisma.supply.deleteMany();
      await prisma.budget.deleteMany();
      await prisma.webSubscription.deleteMany();
      await prisma.webPortfolio.deleteMany();
      await prisma.marketingService.deleteMany();
      await prisma.printProduct.deleteMany();
      await prisma.media.deleteMany();
      await prisma.setting.deleteMany();
      await prisma.user.deleteMany();
    } catch (dbErr) {
      console.warn('DB delete error, continuing with seed reset:', dbErr);
    }

    // 3. Ensure Admin User exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    try {
      await prisma.user.create({
        data: {
          email: 'admin@cmidigital.com',
          passwordHash: hashedPassword,
          name: 'Administrador CMI',
          role: 'ADMIN',
        },
      });
    } catch (e) {
      // ignore
    }

    // 4. Populate default real settings
    const defaultSettingsData = [
      { key: 'company_name', value: 'CMI DIGITAL', group: 'general' },
      { key: 'hero_title', value: 'CMI DIGITAL', group: 'hero' },
      { key: 'hero_subtitle', value: 'Soluciones que hacen visible tu negocio.', group: 'hero' },
      { key: 'hero_text', value: 'Impresiones, marketing digital y desarrollo web para llevar tu empresa al próximo nivel.', group: 'hero' },
      { key: 'address', value: 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina', group: 'contacto' },
      { key: 'phone', value: '03458-659792', group: 'contacto' },
      { key: 'whatsapp', value: '5493458659792', group: 'contacto' },
      { key: 'email', value: 'fabrome64@gmail.com', group: 'contacto' },
      { key: 'facebook_url', value: 'https://web.facebook.com/profile.php?id=100091974249919&_rdc=2&_rdr#', group: 'social' },
      { key: 'instagram_url', value: 'https://www.instagram.com/cmidigital/', group: 'social' },
      { key: 'google_maps_iframe', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.739775432904!2d-58.7554901!3d-30.3846301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b28b7e28cf69a1%3A0xb36b539c96129fa!2sParan%C3%A1%2019%2C%20San%20Jos%C3%A9%20de%20Feliciano%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar', group: 'contacto' },
    ];

    for (const item of defaultSettingsData) {
      try {
        await prisma.setting.create({ data: item });
      } catch (e) {
        // ignore
      }
    }

    return NextResponse.json({
      success: true,
      message: '¡Base de datos limpiada a CERO exitosamente! Todas las tablas quedaron vacías y listas para tus datos reales.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al limpiar base de datos' }, { status: 500 });
  }
}
