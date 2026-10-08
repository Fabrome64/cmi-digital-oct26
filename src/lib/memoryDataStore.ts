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
let memoryClients: any[] = loadData('cmi_clients.json', []);

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
let memoryProducts: any[] = loadData('cmi_products.json', []);

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
let memoryExpenses: any[] = loadData('cmi_expenses.json', []);

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
const defaultSupplies = [
  { id: 'sup-1', nombre: 'VINILO AUTOHADESIVO 1.40M', categoria: 'VINILOS', proveedor: 'GRAFITECH', unidad: 'BOBINA', stock: 8, stockMinimo: 3, costo: 45000, ubicacion: 'ESTANTE A-1', estado: 'DISPONIBLE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'sup-2', nombre: 'TINTA ECO-SOLVENTE NEGRA 1L', categoria: 'TINTAS', proveedor: 'MIMAKI ARG', unidad: 'LITRO', stock: 2, stockMinimo: 3, costo: 65000, ubicacion: 'DEPOSITO B', estado: 'BAJO STOCK', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'sup-3', nombre: 'LONA FRONT 440G 1.60M', categoria: 'LONAS', proveedor: 'PLASTIGRAF', unidad: 'BOBINA', stock: 5, stockMinimo: 2, costo: 89000, ubicacion: 'ESTANTE C-3', estado: 'DISPONIBLE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let memorySupplies: any[] = loadData('cmi_supplies.json', defaultSupplies);

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
let memoryBudgets: any[] = loadData('cmi_budgets.json', []);

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
let memorySubscriptions: any[] = loadData('cmi_web_subscriptions.json', []);

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

// 7. WEB PORTFOLIO STORE
let memoryPortfolio: any[] = loadData('cmi_portfolio.json', []);

export function getMemoryPortfolio() {
  memoryPortfolio = loadData('cmi_portfolio.json', memoryPortfolio);
  return [...memoryPortfolio];
}

export function createMemoryPortfolio(data: any) {
  const item = {
    id: `port-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryPortfolio = [item, ...memoryPortfolio];
  saveData('cmi_portfolio.json', memoryPortfolio);
  return item;
}

export function updateMemoryPortfolio(id: string, data: any) {
  memoryPortfolio = memoryPortfolio.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
  saveData('cmi_portfolio.json', memoryPortfolio);
  return memoryPortfolio.find((p) => p.id === id);
}

export function deleteMemoryPortfolio(id: string) {
  memoryPortfolio = memoryPortfolio.filter((p) => p.id !== id);
  saveData('cmi_portfolio.json', memoryPortfolio);
  return true;
}

// 8. INCOMES STORE
let memoryIncomes: any[] = loadData('cmi_incomes.json', []);

export function getMemoryIncomes() {
  memoryIncomes = loadData('cmi_incomes.json', memoryIncomes);
  return [...memoryIncomes];
}

export function createMemoryIncome(data: any) {
  const item = {
    id: `inc-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryIncomes = [item, ...memoryIncomes];
  saveData('cmi_incomes.json', memoryIncomes);
  return item;
}

export function updateMemoryIncome(id: string, data: any) {
  memoryIncomes = memoryIncomes.map((i) => (i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
  saveData('cmi_incomes.json', memoryIncomes);
  return memoryIncomes.find((i) => i.id === id);
}

export function deleteMemoryIncome(id: string) {
  memoryIncomes = memoryIncomes.filter((i) => i.id !== id);
  saveData('cmi_incomes.json', memoryIncomes);
  return true;
}

// 9. BUDGET MATERIALS STORE
const defaultBudgetMaterials = [
  { id: 'bm-1', nombre: 'LONA FRONT 440G', rubro: 'GRAN FORMATO', unidadCalculo: 'METRO CUADRADO', precioUnitario: 12500, observaciones: 'Impresión gran formato alta resolución', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-2', nombre: 'VINILO BRILLO / MATE', rubro: 'GRAN FORMATO', unidadCalculo: 'METRO CUADRADO', precioUnitario: 11000, observaciones: 'Apto exterior y vidrieras', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-3', nombre: 'MICROPERFORADO', rubro: 'GRAN FORMATO', unidadCalculo: 'METRO CUADRADO', precioUnitario: 15500, observaciones: 'Ideal para lunetas de vehículos y vidrieras', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-4', nombre: 'LONA BACKLIGHT', rubro: 'GRAN FORMATO', unidadCalculo: 'METRO CUADRADO', precioUnitario: 18000, observaciones: 'Para carteles luminosos', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-5', nombre: 'BAJADA A3 COLOR 300G', rubro: 'IMPRENTA GRÁFICA', unidadCalculo: 'UNIDAD', precioUnitario: 1200, observaciones: 'Papel ilustración 300g doble faz', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-6', nombre: 'FOLLETOS 10X15 (1000 UNID)', rubro: 'IMPRENTA GRÁFICA', unidadCalculo: 'UNIDAD', precioUnitario: 35000, observaciones: 'Frente full color, dorso b/n', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-7', nombre: 'CANVAS TEXTURADO', rubro: 'GRAN FORMATO', unidadCalculo: 'METRO CUADRADO', precioUnitario: 22000, observaciones: 'Lienzo de cuadro con bastidor opcional', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'bm-8', nombre: 'PERFIL DE ALUMINIO / BASTIDOR', rubro: 'GRAN FORMATO', unidadCalculo: 'METRO LINEAL', precioUnitario: 8500, observaciones: 'Cálculo por metro lineal de estructura', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let memoryBudgetMaterials: any[] = loadData('cmi_budget_materials.json', defaultBudgetMaterials);

export function getMemoryBudgetMaterials() {
  memoryBudgetMaterials = loadData('cmi_budget_materials.json', memoryBudgetMaterials);
  return [...memoryBudgetMaterials];
}

export function createMemoryBudgetMaterial(data: any) {
  const item = {
    id: `bm-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryBudgetMaterials = [item, ...memoryBudgetMaterials];
  saveData('cmi_budget_materials.json', memoryBudgetMaterials);
  return item;
}

export function updateMemoryBudgetMaterial(id: string, data: any) {
  memoryBudgetMaterials = memoryBudgetMaterials.map((m) => (m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m));
  saveData('cmi_budget_materials.json', memoryBudgetMaterials);
  return memoryBudgetMaterials.find((m) => m.id === id);
}

export function deleteMemoryBudgetMaterial(id: string) {
  memoryBudgetMaterials = memoryBudgetMaterials.filter((m) => m.id !== id);
  saveData('cmi_budget_materials.json', memoryBudgetMaterials);
  return true;
}

export function clearAllMemoryStores() {
  memoryClients = [];
  saveData('cmi_clients.json', []);
  memoryProducts = [];
  saveData('cmi_products.json', []);
  memoryExpenses = [];
  saveData('cmi_expenses.json', []);
  memorySupplies = [];
  saveData('cmi_supplies.json', []);
  memoryBudgets = [];
  saveData('cmi_budgets.json', []);
  memorySubscriptions = [];
  saveData('cmi_web_subscriptions.json', []);
  memoryPortfolio = [];
  saveData('cmi_portfolio.json', []);
  memoryIncomes = [];
  saveData('cmi_incomes.json', []);
  memoryBudgetMaterials = [];
  saveData('cmi_budget_materials.json', []);
}

