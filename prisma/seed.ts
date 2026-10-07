import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la siembra de datos DEMO para CMI DIGITAL...');

  // 1. Limpieza previa
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
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@cmidigital.com',
      passwordHash: hashedPassword,
      name: 'Administrador CMI',
      role: 'ADMIN',
    },
  });
  console.log('✅ Usuario Administrador creado: admin@cmidigital.com / admin123');

  // 3. Crear Clientes DEMO (5 clientes)
  const client1 = await prisma.client.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Gómez',
      empresa: 'Distribuidora del Litoral S.R.L.',
      cuitDni: '30-71458962-4',
      telefono: '03437-421589',
      whatsapp: '5493437421589',
      email: 'contacto@distribuidoralitoral.com.ar',
      direccion: 'Av. San Martín 450',
      localidad: 'San José de Feliciano',
      provincia: 'Entre Ríos',
      observaciones: 'Cliente frecuente de lonas y ploteo vehicular.',
      estado: 'Activo',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      nombre: 'María',
      apellido: 'Fernández',
      empresa: 'Estética & Salud Feliciano',
      cuitDni: '27-32145896-8',
      telefono: '03437-422104',
      whatsapp: '5493437422104',
      email: 'info@esteticafeliciano.com',
      direccion: 'Belgrano 120',
      localidad: 'San José de Feliciano',
      provincia: 'Entre Ríos',
      observaciones: 'Servicio de abono mensual de Marketing en Instagram.',
      estado: 'Activo',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      nombre: 'Roberto',
      apellido: 'Benítez',
      empresa: 'Inmobiliaria Feliciano Propiedades',
      cuitDni: '20-25896314-3',
      telefono: '03437-423300',
      whatsapp: '5493437423300',
      email: 'roberto@felicianopropiedades.com',
      direccion: 'Urquiza 88',
      localidad: 'San José de Feliciano',
      provincia: 'Entre Ríos',
      observaciones: 'Desarrollo de sitio web inmobiliario con catálogo dinámico.',
      estado: 'Activo',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      nombre: 'Lucía',
      apellido: 'Martínez',
      empresa: 'Panadería La Espiga de Oro',
      cuitDni: '27-29876543-1',
      telefono: '03437-421900',
      whatsapp: '5493437421900',
      email: 'laespigadeoro@gmail.com',
      direccion: 'Rivadavia 310',
      localidad: 'San José de Feliciano',
      provincia: 'Entre Ríos',
      observaciones: 'Cartelería comercial frontlight y microperforados para vidriera.',
      estado: 'Activo',
    },
  });

  const client5 = await prisma.client.create({
    data: {
      nombre: 'Gonzalo',
      apellido: 'Alarcón',
      empresa: 'Agroganadera San José',
      cuitDni: '30-68954712-9',
      telefono: '03437-420055',
      whatsapp: '5493437420055',
      email: 'contacto@agroganaderasanjose.com.ar',
      direccion: 'Ruta Provincial 1 y Paraná',
      localidad: 'San José de Feliciano',
      provincia: 'Entre Ríos',
      observaciones: 'Rediseño institucional web y pasacalles promocionales.',
      estado: 'Activo',
    },
  });
  console.log('✅ 5 Clientes DEMO creados');

  // 4. Portfolio Web DEMO (5 proyectos)
  await prisma.webPortfolio.createMany({
    data: [
      {
        titulo: 'Portal Inmobiliario Feliciano',
        cliente: 'Feliciano Propiedades',
        descripcion: 'Sitio web autoadministrable para carga de propiedades en alquiler y venta, buscador avanzado y contacto por WhatsApp.',
        imagenPrincipal: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80']),
        url: 'https://felicianopropiedades.com',
        categoria: 'Inmobiliaria',
        tecnologias: 'Next.js, Tailwind CSS, Panel Admin, WhatsApp API',
        destacado: true,
        orden: 1,
        activo: true,
      },
      {
        titulo: 'E-commerce Distribuidora del Litoral',
        cliente: 'Distribuidora del Litoral S.R.L.',
        descripcion: 'Catálogo de productos mayoristas con carrito de compras, gestión de pedidos y optimización PWA.',
        imagenPrincipal: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80']),
        url: 'https://distribuidoralitoral.com.ar',
        categoria: 'E-Commerce',
        tecnologias: 'React, Node.js, SQLite, PWA',
        destacado: true,
        orden: 2,
        activo: true,
      },
      {
        titulo: 'Sitio Institucional Estética & Salud',
        cliente: 'Estética & Salud Feliciano',
        descripcion: 'Landing page moderna con reserva de turnos, galería de tratamientos y diseño 100% responsive.',
        imagenPrincipal: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80']),
        url: 'https://esteticafeliciano.com',
        categoria: 'Salud & Estética',
        tecnologias: 'Next.js, UI/UX Avanzado, SEO Local',
        destacado: true,
        orden: 3,
        activo: true,
      },
      {
        titulo: 'Plataforma Agroganadera San José',
        cliente: 'Agroganadera San José',
        descripcion: 'Portal institucional corporativo con cotizaciones de hacienda en tiempo real y mapa de lotes.',
        imagenPrincipal: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80']),
        url: 'https://agroganaderasanjose.com.ar',
        categoria: 'Corporativo',
        tecnologias: 'TypeScript, Tailwind CSS, API Weather & Commodities',
        destacado: false,
        orden: 4,
        activo: true,
      },
      {
        titulo: 'Catálogo Digital La Espiga de Oro',
        cliente: 'Panadería La Espiga de Oro',
        descripcion: 'Menú digital dinámico por código QR para lectura en teléfonos smartphones.',
        imagenPrincipal: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        imagenes: JSON.stringify(['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80']),
        url: 'https://menu.laespigadeoro.com',
        categoria: 'Gastronomía',
        tecnologias: 'QR Code Engine, Micro-Animations, Mobile First',
        destacado: false,
        orden: 5,
        activo: true,
      },
    ],
  });
  console.log('✅ 5 Proyectos de Portfolio Web DEMO creados');

  // 5. Servicios de Marketing DEMO (8 servicios)
  await prisma.marketingService.createMany({
    data: [
      {
        titulo: 'Gestión Integral de Redes Sociales',
        descripcion: 'Administración profesional de Instagram y Facebook con publicaciones planificadas y respuestas activas.',
        icono: 'Share2',
        precioOpcional: 'Desde $45.000 / mes',
        destacado: true,
        orden: 1,
        activo: true,
      },
      {
        titulo: 'Diseño de Contenido & Reels',
        descripcion: 'Creación de piezas gráficas de alto impacto visual, historias interactivas y edición de video Reels.',
        icono: 'Video',
        precioOpcional: 'Consultar Paquetes',
        destacado: true,
        orden: 2,
        activo: true,
      },
      {
        titulo: 'Campañas Publicitarias Meta Ads',
        descripcion: 'Segmentación avanzada e inversión estratégica en Facebook e Instagram Ads para conseguir clientes potenciales.',
        icono: 'Target',
        precioOpcional: 'Según presupuesto de pauta',
        destacado: true,
        orden: 3,
        activo: true,
      },
      {
        titulo: 'Calendario Editorial Mensual',
        descripcion: 'Planificación de contenidos con fechas clave, estrategia de copy y hashtags específicos de tu nicho.',
        icono: 'Calendar',
        precioOpcional: '$25.000 / plan',
        destacado: false,
        orden: 4,
        activo: true,
      },
      {
        titulo: 'Branding & Identidad Digital',
        descripcion: 'Diseño de logotipo, paleta cromática, manual de marca y plantillas editables para redes.',
        icono: 'Palette',
        precioOpcional: 'Consultar',
        destacado: false,
        orden: 5,
        activo: true,
      },
      {
        titulo: 'Community Management 24/7',
        descripcion: 'Atención a mensajes directos, comentarios y derivación de ventas a tu WhatsApp.',
        icono: 'MessageCircle',
        precioOpcional: '$35.000 / mes',
        destacado: false,
        orden: 6,
        activo: true,
      },
      {
        titulo: 'Generación de Leads e Inbound',
        descripcion: 'Embudo de ventas para captar teléfonos y emails de clientes interesados en tu ciudad.',
        icono: 'Users',
        precioOpcional: 'Personalizado',
        destacado: false,
        orden: 7,
        activo: true,
      },
      {
        titulo: 'Reportes de Analítica & Rendimiento',
        descripcion: 'Informes mensuales con métricas claras de alcance, interacción y crecimiento de audiencia.',
        icono: 'BarChart3',
        precioOpcional: 'Incluido en abonos',
        destacado: false,
        orden: 8,
        activo: true,
      },
    ],
  });
  console.log('✅ 8 Servicios de Marketing DEMO creados');

  // 6. Productos de Impresión DEMO (10 productos)
  await prisma.printProduct.createMany({
    data: [
      {
        nombre: 'Cartel Lona Frontlight en Bastidor',
        descripcion: 'Lona vinílica de alta resistencia con estructura metálica reforzada ideal para frentes comerciales.',
        categoria: 'Cartelería',
        imagen: 'https://images.unsplash.com/photo-1542744094-3a3121699496?auto=format&fit=crop&w=800&q=80',
        precio: 18500,
        unidad: 'm2',
        medidas: 'A medida (ej. 3m x 1m, 4m x 1.5m)',
        destacado: true,
        orden: 1,
        activo: true,
      },
      {
        nombre: 'Banner Roll-Up Portátil Con Funda',
        descripcion: 'Estructura auto-enrollable de aluminio super liviana con lona mate de alta resolución (85x200cm).',
        categoria: 'Banners',
        imagen: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        precio: 42000,
        unidad: 'unidad',
        medidas: '0.85m x 2.00m',
        destacado: true,
        orden: 2,
        activo: true,
      },
      {
        nombre: 'Vinilo Autoadhesivo para Vidrieras',
        descripcion: 'Vinilo brillante o mate impreso en alta definición para decoración o promociones comerciales.',
        categoria: 'Vinilos',
        imagen: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        precio: 9500,
        unidad: 'm2',
        medidas: 'A medida',
        destacado: true,
        orden: 3,
        activo: true,
      },
      {
        nombre: 'Microperforado Visión Unidireccional',
        descripcion: 'Permite visibilidad hacia el exterior mientras muestra gráfica de impacto desde afuera en vidrieras y vehículos.',
        categoria: 'Microperforados',
        imagen: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        precio: 14000,
        unidad: 'm2',
        medidas: 'A medida',
        destacado: true,
        orden: 4,
        activo: true,
      },
      {
        nombre: 'Ploteo Vehicular Parcial o Total',
        descripcion: 'Gráfica vehicular de alta durabilidad con vinilo fundido y protección UV para flotas comerciales.',
        categoria: 'Vehículos',
        imagen: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        precio: 35000,
        unidad: 'm2',
        medidas: 'A medida según vehículo',
        destacado: true,
        orden: 5,
        activo: true,
      },
      {
        nombre: 'Lona Mesh Calada para Exteriores',
        descripcion: 'Especial para grandes superficies con viento. Microperforaciones que permiten el paso del aire.',
        categoria: 'Lonas',
        imagen: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        precio: 16500,
        unidad: 'm2',
        medidas: 'A medida',
        destacado: false,
        orden: 6,
        activo: true,
      },
      {
        nombre: 'Señalética Institucional en Sintra/PVC',
        descripcion: 'Placas rigidas de PVC espumado impresas directamente o montadas para señalización interna y externa.',
        categoria: 'Señalética',
        imagen: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=800&q=80',
        precio: 12500,
        unidad: 'm2',
        medidas: 'Formatos standard o a medida',
        destacado: false,
        orden: 7,
        activo: true,
      },
      {
        nombre: 'Lona Backlight para Carteles Iluminados',
        descripcion: 'Transmite la luz uniformemente en carteles con iluminación interna trasera.',
        categoria: 'Cartelería',
        imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        precio: 21000,
        unidad: 'm2',
        medidas: 'A medida',
        destacado: false,
        orden: 8,
        activo: true,
      },
      {
        nombre: 'Vinilo de Corte Esmerilado',
        descripcion: 'Privacidad con estilo para oficinas, consultorios y mamparas de vidrio.',
        categoria: 'Vidrieras',
        imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        precio: 11000,
        unidad: 'm2',
        medidas: 'A medida',
        destacado: false,
        orden: 9,
        activo: true,
      },
      {
        nombre: 'Gigantografía Publicitaria en Lona Blackout',
        descripcion: 'Lona con alma negra interior que bloquea el 100% de paso de luz para dobles frentes.',
        categoria: 'Lonas',
        imagen: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
        precio: 22000,
        unidad: 'm2',
        medidas: 'Gran formato',
        destacado: false,
        orden: 10,
        activo: true,
      },
    ],
  });
  console.log('✅ 10 Productos de Impresión Gran Formato DEMO creados');

  // 7. Presupuestos DEMO (5 presupuestos)
  await prisma.budget.createMany({
    data: [
      {
        clienteId: client1.id,
        clienteNombre: 'Carlos Gómez',
        empresa: 'Distribuidora del Litoral S.R.L.',
        telefono: '03437-421589',
        whatsapp: '5493437421589',
        email: 'contacto@distribuidoralitoral.com.ar',
        servicio: 'IMPRESIONES',
        producto: 'Cartel Lona Frontlight',
        descripcion: 'Necesitamos 2 carteles para la fachada del deposito principal con bastidor reforzado.',
        cantidad: 2,
        medidas: '4m x 1.20m',
        estado: 'Nuevo',
        monto: 177600,
        observaciones: 'Pendiente confirmar muestra de color.',
      },
      {
        clienteId: client2.id,
        clienteNombre: 'María Fernández',
        empresa: 'Estética & Salud Feliciano',
        telefono: '03437-422104',
        whatsapp: '5493437422104',
        email: 'info@esteticafeliciano.com',
        servicio: 'MARKETING',
        producto: 'Gestión Integral de Redes',
        descripcion: 'Plan mensual de redes sociales para campaña de verano 2026.',
        cantidad: 1,
        medidas: 'N/A',
        estado: 'En análisis',
        monto: 45000,
        observaciones: 'Enviar propuesta PDF.',
      },
      {
        clienteId: client3.id,
        clienteNombre: 'Roberto Benítez',
        empresa: 'Inmobiliaria Feliciano Propiedades',
        telefono: '03437-423300',
        whatsapp: '5493437423300',
        email: 'roberto@felicianopropiedades.com',
        servicio: 'DISENO_WEB',
        producto: 'Desarrollo Web Inmobiliario',
        descripcion: 'Sitio autoadministrable con carga ilimitada de propiedades.',
        cantidad: 1,
        medidas: 'N/A',
        estado: 'Aprobado',
        monto: 280000,
        observaciones: 'Anticipo del 50% recibido.',
      },
      {
        clienteId: client4.id,
        clienteNombre: 'Lucía Martínez',
        empresa: 'Panadería La Espiga de Oro',
        telefono: '03437-421900',
        whatsapp: '5493437421900',
        email: 'laespigadeoro@gmail.com',
        servicio: 'IMPRESIONES',
        producto: 'Microperforado Vidriera',
        descripcion: 'Microperforado para frente de local comercial.',
        cantidad: 1,
        medidas: '2.50m x 1.80m',
        estado: 'Presupuestado',
        monto: 63000,
        observaciones: 'A la espera de confirmación del cliente.',
      },
      {
        clienteId: client5.id,
        clienteNombre: 'Gonzalo Alarcón',
        empresa: 'Agroganadera San José',
        telefono: '03437-420055',
        whatsapp: '5493437420055',
        email: 'contacto@agroganaderasanjose.com.ar',
        servicio: 'DISENO_WEB',
        producto: 'Mantenimiento & Hosting Web',
        descripcion: 'Abono anual de servidor y mantenimiento técnico de portal.',
        cantidad: 1,
        medidas: 'N/A',
        estado: 'Finalizado',
        monto: 96000,
        observaciones: 'Factura A emitida y cobrada.',
      },
    ],
  });
  console.log('✅ 5 Presupuestos DEMO creados');

  // 8. Abonos Sitios Web DEMO (3 abonos)
  const hoy = new Date();
  const proximoVencer = new Date();
  proximoVencer.setDate(hoy.getDate() + 4);

  const vencido = new Date();
  vencido.setDate(hoy.getDate() - 15);

  const activo = new Date();
  activo.setMonth(hoy.getMonth() + 1);

  await prisma.webSubscription.createMany({
    data: [
      {
        clienteId: client3.id,
        clienteNombre: 'Inmobiliaria Feliciano Propiedades',
        sitio: 'Feliciano Propiedades Portal',
        dominio: 'felicianopropiedades.com',
        hosting: 'Cloud VPS CMI',
        fechaInicio: new Date('2025-01-01'),
        fechaVencimiento: activo,
        importe: 18000,
        periodicidad: 'Mensual',
        estado: 'Activo',
        observaciones: 'Débito automático al día.',
      },
      {
        clienteId: client2.id,
        clienteNombre: 'Estética & Salud Feliciano',
        sitio: 'Estética & Salud Landing',
        dominio: 'esteticafeliciano.com',
        hosting: 'Cloud VPS CMI',
        fechaInicio: new Date('2025-02-01'),
        fechaVencimiento: proximoVencer,
        importe: 15000,
        periodicidad: 'Mensual',
        estado: 'Próximo a vencer',
        observaciones: 'Aviso de vencimiento enviado por WhatsApp.',
      },
      {
        clienteId: client1.id,
        clienteNombre: 'Distribuidora del Litoral S.R.L.',
        sitio: 'E-commerce Distribuidora',
        dominio: 'distribuidoralitoral.com.ar',
        hosting: 'Cloud VPS CMI Dedicated',
        fechaInicio: new Date('2024-06-01'),
        fechaVencimiento: vencido,
        importe: 22000,
        periodicidad: 'Mensual',
        estado: 'Vencido',
        observaciones: 'Pago atrasado 15 días. Recordatorio pendiente.',
      },
    ],
  });
  console.log('✅ 3 Abonos Web DEMO creados');

  // 9. Insumos DEMO (5 insumos con alertas de stock bajo)
  await prisma.supply.createMany({
    data: [
      {
        nombre: 'Bobina Vinilo Blanco Brillante 1.52m x 50m',
        categoria: 'Vinilos',
        proveedor: 'GrafiTech Argentina',
        unidad: 'Bobina',
        stock: 2.0,
        stockMinimo: 3.0, // Alerta: stock bajo!
        costo: 185000,
        ubicacion: 'Estante V-01',
        estado: 'Bajo Stock',
      },
      {
        nombre: 'Tinta Ecosolvente Cyan 1 Litro',
        categoria: 'Tintas',
        proveedor: 'Mimaki Supplies',
        unidad: 'Litro',
        stock: 1.5,
        stockMinimo: 2.0, // Alerta: stock bajo!
        costo: 92000,
        ubicacion: 'Armario Tintas A',
        estado: 'Bajo Stock',
      },
      {
        nombre: 'Bobina Lona Frontlight 13oz 2.20m x 50m',
        categoria: 'Lonas',
        proveedor: 'Lonas del Norte',
        unidad: 'Bobina',
        stock: 8.0,
        stockMinimo: 2.0,
        costo: 240000,
        ubicacion: 'Rack Lonas R-02',
        estado: 'Disponible',
      },
      {
        nombre: 'Tinta Ecosolvente Black 1 Litro',
        categoria: 'Tintas',
        proveedor: 'Mimaki Supplies',
        unidad: 'Litro',
        stock: 4.0,
        stockMinimo: 2.0,
        costo: 92000,
        ubicacion: 'Armario Tintas A',
        estado: 'Disponible',
      },
      {
        nombre: 'Ojalillos Metálicos N° 3 (Caja 1000u)',
        categoria: 'Estructuras',
        proveedor: 'Herrajes Publicitarios',
        unidad: 'Caja',
        stock: 12.0,
        stockMinimo: 4.0,
        costo: 18500,
        ubicacion: 'Cajón O-05',
        estado: 'Disponible',
      },
    ],
  });
  console.log('✅ 5 Insumos DEMO creados (con alertas de stock bajo)');

  // 10. Productos & Servicios Comerciales DEMO (5 ítems)
  await prisma.product.createMany({
    data: [
      {
        nombre: 'Pauta Publicitaria Inicial Meta',
        tipo: 'SERVICIO',
        categoria: 'Marketing',
        descripcion: 'Configuración inicial de Business Manager, Pixel y primera campaña publicitaria.',
        precio: 35000,
        costo: 5000,
        stock: 999,
        unidad: 'servicio',
        activo: true,
        destacado: true,
      },
      {
        nombre: 'Porta Banner Araña 80x180cm',
        tipo: 'PRODUCTO',
        categoria: 'Exhibición',
        descripcion: 'Estructura plástica con tensores de fibra de vidrio y bolso de transporte.',
        precio: 16500,
        costo: 8500,
        stock: 15,
        unidad: 'unidad',
        activo: true,
        destacado: false,
      },
      {
        nombre: 'Diseño de Logotipo & Marca',
        tipo: 'SERVICIO',
        categoria: 'Diseño Gráfico',
        descripcion: 'Creación de logo vectorial con 3 propuestas iniciales y manual de aplicación.',
        precio: 65000,
        costo: 10000,
        stock: 999,
        unidad: 'servicio',
        activo: true,
        destacado: true,
      },
      {
        nombre: 'Lona Impresa 1m x 1m con Ojalillos',
        tipo: 'PRODUCTO',
        categoria: 'Impresión',
        descripcion: 'Lona frontlight confeccionada lista para colgar.',
        precio: 18500,
        costo: 7200,
        stock: 100,
        unidad: 'unidad',
        activo: true,
        destacado: false,
      },
      {
        nombre: 'Mantenimiento Web Mensual',
        tipo: 'SERVICIO',
        categoria: 'Desarrollo Web',
        descripcion: 'Actualización de contenidos, copias de seguridad semanales y soporte técnico.',
        precio: 20000,
        costo: 3000,
        stock: 999,
        unidad: 'mes',
        activo: true,
        destacado: true,
      },
    ],
  });
  console.log('✅ 5 Productos y Servicios comerciales DEMO creados');

  // 11. Gastos DEMO (5 gastos del mes)
  await prisma.expense.createMany({
    data: [
      {
        fecha: new Date('2026-10-01'),
        concepto: 'Compra de bobina de vinilo brillante 1.52m',
        categoria: 'Insumos',
        proveedor: 'GrafiTech Argentina',
        monto: 185000,
        medioPago: 'Transferencia',
        comprobante: 'FAC-B-00045892',
        observaciones: 'Pago contado con descuento.',
      },
      {
        fecha: new Date('2026-10-02'),
        concepto: 'Servidor Cloud VPS mensual (Hosting clientes)',
        categoria: 'Hosting',
        proveedor: 'Hetznos / AWS',
        monto: 48500,
        medioPago: 'Tarjeta',
        comprobante: 'INV-2026-1002',
        observaciones: 'Pago automático en USD.',
      },
      {
        fecha: new Date('2026-10-03'),
        concepto: 'Publicidad propia Facebook & Instagram CMI Digital',
        categoria: 'Publicidad',
        proveedor: 'Meta Platforms Inc.',
        monto: 65000,
        medioPago: 'Tarjeta',
        comprobante: 'META-OCT-01',
        observaciones: 'Campaña de captación de clientes de sitios web.',
      },
      {
        fecha: new Date('2026-10-04'),
        concepto: 'Licencia Adobe Creative Cloud & Software',
        categoria: 'Software',
        proveedor: 'Adobe Inc.',
        monto: 32000,
        medioPago: 'Tarjeta',
        comprobante: 'ADB-9988221',
        observaciones: 'Suscripción mensual de diseño gráfico.',
      },
      {
        fecha: new Date('2026-10-05'),
        concepto: 'Mantenimiento de plotter de impresión ecosolvente',
        categoria: 'Equipamiento',
        proveedor: 'Service Técnico Oficial',
        monto: 45000,
        medioPago: 'Efectivo',
        comprobante: 'REC-001209',
        observaciones: 'Cambio de dumper y limpieza de cabezal.',
      },
    ],
  });
  console.log('✅ 5 Gastos del mes DEMO creados');

  // 12. Configuración Global (settings)
  await prisma.setting.createMany({
    data: [
      {
        key: 'company_name',
        value: 'CMI DIGITAL',
        description: 'Nombre legal e comercial de la empresa',
        group: 'general',
      },
      {
        key: 'hero_title',
        value: 'CMI DIGITAL',
        description: 'Título principal de la sección Hero',
        group: 'hero',
      },
      {
        key: 'hero_subtitle',
        value: 'Soluciones que hacen visible tu negocio.',
        description: 'Subtítulo destacado del Hero',
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
        description: 'Número de WhatsApp con código de país',
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
        description: 'URL de iframe de Google Maps centrado en Paraná 19',
        group: 'contacto',
      },
      {
        key: 'meta_title',
        value: 'CMI DIGITAL | Impresiones Gran Formato, Marketing & Desarrollo Web en Feliciano',
        description: 'Título SEO para Google',
        group: 'seo',
      },
      {
        key: 'meta_description',
        value: 'Empresa líder en San José de Feliciano en Impresiones de Gran Formato, Marketing Digital, Administración de Redes Sociales y Desarrollo de Sitios Web Profesionales.',
        description: 'Meta Descripción SEO',
        group: 'seo',
      },
    ],
  });
  console.log('✅ Configuración global de la empresa sembrada');

  console.log('🎉 Siembra de datos DEMO finalizada con éxito para CMI DIGITAL!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
