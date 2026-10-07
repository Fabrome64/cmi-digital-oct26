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
let memorySupplies: any[] = loadData('cmi_supplies.json', []);

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
}
