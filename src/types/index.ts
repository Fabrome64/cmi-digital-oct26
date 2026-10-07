export interface ClientType {
  id: string;
  nombre: string;
  apellido?: string | null;
  empresa?: string | null;
  cuitDni?: string | null;
  telefono?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  direccion?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  observaciones?: string | null;
  estado: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface WebPortfolioType {
  id: string;
  titulo: string;
  cliente: string;
  descripcion: string;
  imagenPrincipal: string;
  imagenes: string;
  url?: string | null;
  categoria: string;
  tecnologias: string;
  destacado: boolean;
  orden: number;
  activo: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface MarketingServiceType {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  imagen?: string | null;
  precioOpcional?: string | null;
  destacado: boolean;
  orden: number;
  activo: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PrintProductType {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen: string;
  galeria: string;
  precio?: number | null;
  unidad?: string | null;
  medidas?: string | null;
  destacado: boolean;
  orden: number;
  activo: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BudgetType {
  id: string;
  clienteId?: string | null;
  clienteNombre: string;
  empresa?: string | null;
  telefono?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  servicio: string;
  producto?: string | null;
  descripcion: string;
  cantidad: number;
  medidas?: string | null;
  archivo?: string | null;
  estado: string;
  monto?: number | null;
  observaciones?: string | null;
  fecha: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface WebSubscriptionType {
  id: string;
  clienteId?: string | null;
  clienteNombre: string;
  sitio: string;
  dominio?: string | null;
  hosting?: string | null;
  fechaInicio: Date | string;
  fechaVencimiento: Date | string;
  importe: number;
  periodicidad: string;
  estado: string;
  observaciones?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IncomeType {
  id: string;
  clienteId?: string | null;
  clienteNombre: string;
  servicio: string; // SITIO WEB, MARKETING REDES, AUSPICIO FELICHOGUIA, IMPRENTA GRAFICA, IMPRENTA GRAN FORMATO
  fecha: Date | string;
  importe: number;
  observaciones?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SupplyType {
  id: string;
  nombre: string;
  categoria: string;
  proveedor?: string | null;
  unidad: string;
  stock: number;
  stockMinimo: number;
  costo: number;
  ubicacion?: string | null;
  estado: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProductType {
  id: string;
  nombre: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  precio: number;
  costo: number;
  imagen?: string | null;
  stock: number;
  unidad: string;
  activo: boolean;
  destacado: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ExpenseType {
  id: string;
  fecha: Date | string;
  concepto: string;
  categoria: string;
  proveedor?: string | null;
  monto: number;
  medioPago: string;
  comprobante?: string | null;
  observaciones?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SettingType {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  group: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface MediaType {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string | null;
  createdAt: Date | string;
}
