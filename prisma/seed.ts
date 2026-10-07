import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando base de datos y dejando únicamente configuración real y usuario Admin...');

  // 1. Limpieza de tablas operativas
  await prisma.user.deleteMany();
  await prisma.client.deleteMany();
  await prisma.webPortfolio.deleteMany();
  await prisma.marketingService.deleteMany();
  await prisma.printProduct.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.webSubscription.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.product.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.media.deleteMany();

  // 2. Crear usuario Administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@cmidigital.com',
      passwordHash: hashedPassword,
      name: 'Administrador CMI',
      role: 'ADMIN',
    },
  });
  console.log('✅ Usuario Administrador listo: admin@cmidigital.com / admin123');

  // 3. Configuración inicial limpia con datos reales de CMI Digital
  await prisma.setting.createMany({
    data: [
      {
        key: 'company_name',
        value: 'CMI DIGITAL',
        description: 'Nombre comercial de la empresa',
        group: 'general',
      },
      {
        key: 'hero_title',
        value: 'CMI DIGITAL',
        description: 'Título principal del Hero',
        group: 'hero',
      },
      {
        key: 'hero_subtitle',
        value: 'Soluciones que hacen visible tu negocio.',
        description: 'Subtítulo del Hero',
        group: 'hero',
      },
      {
        key: 'hero_text',
        value: 'Impresiones, marketing digital y desarrollo web para llevar tu empresa al próximo nivel.',
        description: 'Párrafo descriptivo del Hero',
        group: 'hero',
      },
      {
        key: 'address',
        value: 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina',
        description: 'Dirección física de la empresa',
        group: 'contacto',
      },
      {
        key: 'phone',
        value: '03458-659792',
        description: 'Teléfono fijo de contacto',
        group: 'contacto',
      },
      {
        key: 'whatsapp',
        value: '5493458659792',
        description: 'Número de WhatsApp oficial con código de país',
        group: 'contacto',
      },
      {
        key: 'email',
        value: 'fabrome64@gmail.com',
        description: 'Correo electrónico oficial',
        group: 'contacto',
      },
      {
        key: 'facebook_url',
        value: 'https://web.facebook.com/profile.php?id=100091974249919&_rdc=2&_rdr#',
        description: 'Página de Facebook',
        group: 'social',
      },
      {
        key: 'instagram_url',
        value: 'https://www.instagram.com/cmidigital/',
        description: 'Perfil de Instagram',
        group: 'social',
      },
      {
        key: 'google_maps_iframe',
        value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.739775432904!2d-58.7554901!3d-30.3846301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b28b7e28cf69a1%3A0xb36b539c96129fa!2sParan%C3%A1%2019%2C%20San%20Jos%C3%A9%20de%20Feliciano%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar',
        description: 'Iframe de Google Maps',
        group: 'contacto',
      },
      {
        key: 'meta_title',
        value: 'CMI DIGITAL | Impresiones Gran Formato, Marketing & Desarrollo Web',
        description: 'Título SEO para motores de búsqueda',
        group: 'seo',
      },
      {
        key: 'meta_description',
        value: 'Imprenta digital gran formato, diseño web y gestión de redes sociales en Feliciano, Entre Ríos.',
        description: 'Descripción SEO',
        group: 'seo',
      },
    ],
  });

  console.log('✅ Base de datos reseteada a 0 registros con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed limpio:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
