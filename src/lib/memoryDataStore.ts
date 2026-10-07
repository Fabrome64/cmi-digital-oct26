import fs from 'fs';
import path from 'path';

function getCachePath(filename: string): string {
  try {
    const tmpDir = process.env.TMPDIR || process.env.TMP || '/tmp';
    if (fs.existsSync(tmpDir)) {
      return path.join(tmpDir, filename);
    }
  } catch (e) {
    // fallback
  }
  return path.join(process.cwd(), filename);
}

function loadData<T>(filename: string, initialData: T[]): T[] {
  try {
    const filePath = getCachePath(filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [...initialData];
}

function saveData<T>(filename: string, data: T[]): void {
  try {
    const filePath = getCachePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn(`Could not save fallback data to ${filename}:`, e);
  }
}

// 1. CLIENTS STORE
let memoryClients: any[] = loadData('cmi_clients.json', [
  {
    id: 'client-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    empresa: 'Comercial Feliciano',
    cuitDni: '20-34567890-9',
    telefono: '03437-421111',
    whatsapp: '5493437421111',
    email: 'contacto@comercialfeliciano.com',
    direccion: 'San Martín 450',
    localidad: 'San José de Feliciano',
    provincia: 'Entre Ríos',
    observaciones: 'Cliente frecuente de impresiones',
    estado: 'Activo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    nombre: 'María',
    apellido: 'Gómez',
    empresa: 'Farmacia Del Pueblo',
    cuitDni: '27-28999888-4',
    telefono: '03437-422222',
    whatsapp: '5493437422222',
    email: 'farmaciadelpueblo@gmail.com',
    direccion: 'Belgrano 120',
    localidad: 'San José de Feliciano',
    provincia: 'Entre Ríos',
    observaciones: 'Abono mensual mantenimiento web',
    estado: 'Activo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export function getMemoryClients() {
  memoryClients = loadData('cmi_clients.json', memoryClients);
  return [...memoryClients];
}

export function createMemoryClient(data: any) {
  const newClient = {
    id: `client-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryClients = [newClient, ...memoryClients];
  saveData('cmi_clients.json', memoryClients);
  return newClient;
}

export function updateMemoryClient(id: string, data: any) {
  memoryClients = memoryClients.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
  saveData('cmi_clients.json', memoryClients);
  return memoryClients.find((c) => c.id === id);
}

export function deleteMemoryClient(id: string) {
  memoryClients = memoryClients.filter((c) => c.id !== id);
  saveData('cmi_clients.json', memoryClients);
  return true;
}

// 2. PRODUCTS STORE
let memoryProducts: any[] = loadData('cmi_products.json', [
  {
    id: 'prod-1',
    nombre: 'Banner Lona Frontlight 13oz High Res',
    tipo: 'PRODUCTO',
    categoria: 'Banners',
    descripcion: 'Impresión en lona vinílica 13oz con tintas solventes alta durabilidad para intemperie',
    precio: 18500,
    costo: 9200,
    imagen: '/products/banner-frontlight.jpg',
    stock: 50,
    unidad: 'm2',
    activo: true,
    destacado: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    nombre: 'Vinilo Autoadhesivo Mate / Brillante',
    tipo: 'PRODUCTO',
    categoria: 'Vinilos',
    descripcion: 'Vinilo autoadhesivo de corte e impresión fotográfica full color 1440 DPI',
    precio: 14200,
    costo: 6800,
    imagen: '/products/vinilo-adhesivo.jpg',
    stock: 100,
    unidad: 'm2',
    activo: true,
    destacado: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export function getMemoryProducts() {
  memoryProducts = loadData('cmi_products.json', memoryProducts);
  return [...memoryProducts];
}

export function createMemoryProduct(data: any) {
  const item = {
    id: `prod-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryProducts = [item, ...memoryProducts];
  saveData('cmi_products.json', memoryProducts);
  return item;
}

export function updateMemoryProduct(id: string, data: any) {
  memoryProducts = memoryProducts.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
  saveData('cmi_products.json', memoryProducts);
  return memoryProducts.find((p) => p.id === id);
}

export function deleteMemoryProduct(id: string) {
  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  saveData('cmi_products.json', memoryProducts);
  return true;
}

// 3. EXPENSES STORE
let memoryExpenses: any[] = loadData('cmi_expenses.json', [
  {
    id: 'exp-1',
    fecha: new Date().toISOString(),
    concepto: 'Bobina Lona Frontlight 13oz 3.20m x 50m',
    categoria: 'Insumos',
    proveedor: 'Impresoras Argentina SRL',
    monto: 345000,
    medioPago: 'Transferencia',
    comprobante: 'FAC-0001-00293',
    observaciones: 'Compra de lona para cartelería',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    fecha: new Date().toISOString(),
    concepto: 'Hosting Vercel Pro & Dominio .digital',
    categoria: 'Servicios',
    proveedor: 'Spaceship / Vercel',
    monto: 24800,
    medioPago: 'Tarjeta',
    comprobante: 'INV-2026-904',
    observaciones: 'Pago de hosting y dominio anual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export function getMemoryExpenses() {
  memoryExpenses = loadData('cmi_expenses.json', memoryExpenses);
  return [...memoryExpenses];
}

export function createMemoryExpense(data: any) {
  const item = {
    id: `exp-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryExpenses = [item, ...memoryExpenses];
  saveData('cmi_expenses.json', memoryExpenses);
  return item;
}

export function updateMemoryExpense(id: string, data: any) {
  memoryExpenses = memoryExpenses.map((e) => (e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e));
  saveData('cmi_expenses.json', memoryExpenses);
  return memoryExpenses.find((e) => e.id === id);
}

export function deleteMemoryExpense(id: string) {
  memoryExpenses = memoryExpenses.filter((e) => e.id !== id);
  saveData('cmi_expenses.json', memoryExpenses);
  return true;
}

// 4. SUPPLIES STORE
let memorySupplies: any[] = loadData('cmi_supplies.json', [
  {
    id: 'sup-1',
    nombre: 'Tinta Eco-Solvente Cyan (Botella 1L)',
    categoria: 'Tintas',
    proveedor: 'PlotterSur',
    unidad: 'Litro',
    stock: 8,
    stockMinimo: 3,
    costo: 38000,
    ubicacion: 'Estante A-1',
    estado: 'Disponible',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sup-2',
    nombre: 'Bobina Vinilo Blanco 1.52m x 50m',
    categoria: 'Vinilos',
    proveedor: 'Plastiferia',
    unidad: 'Bobina',
    stock: 4,
    stockMinimo: 2,
    costo: 145000,
    ubicacion: 'Depósito 2',
    estado: 'Disponible',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export function getMemorySupplies() {
  memorySupplies = loadData('cmi_supplies.json', memorySupplies);
  return [...memorySupplies];
}

export function createMemorySupply(data: any) {
  const item = {
    id: `sup-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memorySupplies = [item, ...memorySupplies];
  saveData('cmi_supplies.json', memorySupplies);
  return item;
}

export function updateMemorySupply(id: string, data: any) {
  memorySupplies = memorySupplies.map((s) => (s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s));
  saveData('cmi_supplies.json', memorySupplies);
  return memorySupplies.find((s) => s.id === id);
}

export function deleteMemorySupply(id: string) {
  memorySupplies = memorySupplies.filter((s) => s.id !== id);
  saveData('cmi_supplies.json', memorySupplies);
  return true;
}

// 5. BUDGETS STORE
let memoryBudgets: any[] = loadData('cmi_budgets.json', [
  {
    id: 'bud-1',
    clienteNombre: 'Comercial Feliciano',
    empresa: 'Comercial Feliciano',
    telefono: '03437-421111',
    whatsapp: '5493437421111',
    email: 'contacto@comercialfeliciano.com',
    servicio: 'Cartelería Gran Formato & Ploteo',
    producto: 'Cartel Lona Frontlight 4m x 2m',
    descripcion: 'Estructura metálica con lona impresa e iluminación LED superior',
    cantidad: 1,
    medidas: '4.00m x 2.00m',
    estado: 'Presupuestado',
    monto: 148000,
    observaciones: 'Incluye colocación en San José de Feliciano',
    fecha: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export function getMemoryBudgets() {
  memoryBudgets = loadData('cmi_budgets.json', memoryBudgets);
  return [...memoryBudgets];
}

export function createMemoryBudget(data: any) {
  const item = {
    id: `bud-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryBudgets = [item, ...memoryBudgets];
  saveData('cmi_budgets.json', memoryBudgets);
  return item;
}

export function updateMemoryBudget(id: string, data: any) {
  memoryBudgets = memoryBudgets.map((b) => (b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b));
  saveData('cmi_budgets.json', memoryBudgets);
  return memoryBudgets.find((b) => b.id === id);
}

export function deleteMemoryBudget(id: string) {
  memoryBudgets = memoryBudgets.filter((b) => b.id !== id);
  saveData('cmi_budgets.json', memoryBudgets);
  return true;
}

// 6. WEB SUBSCRIPTIONS STORE
let memorySubscriptions: any[] = loadData('cmi_web_subscriptions.json', [
  {
    id: 'sub-1',
    clienteNombre: 'Farmacia Del Pueblo',
    sitio: 'Farmacia Del Pueblo Web & PWA',
    dominio: 'farmaciadelpueblo.com.ar',
    hosting: 'Servidor CMI Vercel Pro',
    fechaInicio: new Date().toISOString(),
    fechaVencimiento: new Date(Date.now() + 30 * 86400000).toISOString(),
    importe: 25000,
    periodicidad: 'Mensual',
    estado: 'Activo',
    observaciones: 'Mantenimiento mensual de catálogo y hosting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export function getMemorySubscriptions() {
  memorySubscriptions = loadData('cmi_web_subscriptions.json', memorySubscriptions);
  return [...memorySubscriptions];
}

export function createMemorySubscription(data: any) {
  const item = {
    id: `sub-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memorySubscriptions = [item, ...memorySubscriptions];
  saveData('cmi_web_subscriptions.json', memorySubscriptions);
  return item;
}

export function updateMemorySubscription(id: string, data: any) {
  memorySubscriptions = memorySubscriptions.map((s) => (s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s));
  saveData('cmi_web_subscriptions.json', memorySubscriptions);
  return memorySubscriptions.find((s) => s.id === id);
}

export function deleteMemorySubscription(id: string) {
  memorySubscriptions = memorySubscriptions.filter((s) => s.id !== id);
  saveData('cmi_web_subscriptions.json', memorySubscriptions);
  return true;
}
