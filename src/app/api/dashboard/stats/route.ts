import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getMemoryClients,
  getMemoryProducts,
  getMemoryExpenses,
  getMemorySupplies,
  getMemoryPortfolio,
  getMemoryIncomes
} from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let clientsCount = 0;
    let activeWebsitesCount = 0;
    let totalProductsCount = 0;
    let monthlyIncomesTotal = 0;
    let monthlyExpensesTotal = 0;
    let lowStockSupplies: any[] = [];
    let incomesByService: { name: string; total: number }[] = [];
    let expensesByCategory: { name: string; total: number }[] = [];

    // 1. Clients
    try {
      clientsCount = await prisma.client.count({ where: { estado: 'Activo' } });
    } catch {
      clientsCount = getMemoryClients().filter((c: any) => c.estado === 'Activo').length;
    }

    // 2. Web Portfolio
    try {
      activeWebsitesCount = await prisma.webPortfolio.count({ where: { activo: true } });
    } catch {
      activeWebsitesCount = getMemoryPortfolio().filter((p: any) => p.activo).length;
    }

    // 3. Products
    try {
      const printProdCount = await prisma.printProduct.count({ where: { activo: true } });
      const prodCount = await prisma.product.count({ where: { activo: true } });
      totalProductsCount = printProdCount + prodCount;
    } catch {
      totalProductsCount = getMemoryProducts().filter((p: any) => p.activo !== false).length;
    }

    // 4. Incomes of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    try {
      const monthlyIncomesGroup = await prisma.income.aggregate({
        where: { fecha: { gte: startOfMonth } },
        _sum: { importe: true },
      });
      monthlyIncomesTotal = monthlyIncomesGroup._sum.importe || 0;

      // Fallback to all time if current month has 0 records but database has records
      if (monthlyIncomesTotal === 0) {
        const allIncomesGroup = await prisma.income.aggregate({
          _sum: { importe: true },
        });
        monthlyIncomesTotal = allIncomesGroup._sum.importe || 0;
      }
    } catch {
      const memIncomes = getMemoryIncomes();
      monthlyIncomesTotal = memIncomes.reduce((sum: number, i: any) => sum + (Number(i.importe) || 0), 0);
    }

    // 5. Monthly Expenses
    try {
      const monthlyExpensesGroup = await prisma.expense.aggregate({
        where: { fecha: { gte: startOfMonth } },
        _sum: { monto: true },
      });
      monthlyExpensesTotal = monthlyExpensesGroup._sum.monto || 0;

      if (monthlyExpensesTotal === 0) {
        const allExpensesGroup = await prisma.expense.aggregate({
          _sum: { monto: true },
        });
        monthlyExpensesTotal = allExpensesGroup._sum.monto || 0;
      }
    } catch {
      const memExpenses = getMemoryExpenses();
      monthlyExpensesTotal = memExpenses.reduce((sum: number, e: any) => sum + (Number(e.monto) || 0), 0);
    }

    // 6. Low stock supplies
    try {
      lowStockSupplies = await prisma.supply.findMany({
        where: { estado: 'Bajo Stock' },
      });
    } catch {
      lowStockSupplies = getMemorySupplies().filter((s: any) => s.estado === 'Bajo Stock');
    }

    // 7. Chart: Ingresos por Servicio
    try {
      const iGroupBy = await prisma.income.groupBy({
        by: ['servicio'],
        _sum: { importe: true },
      });
      incomesByService = iGroupBy.map((i) => ({ name: i.servicio, total: i._sum.importe || 0 }));
    } catch {
      const memIncomes = getMemoryIncomes();
      const grouped: Record<string, number> = {};
      memIncomes.forEach((i: any) => {
        const srv = i.servicio || 'SITIO WEB';
        grouped[srv] = (grouped[srv] || 0) + (Number(i.importe) || 0);
      });
      incomesByService = Object.entries(grouped).map(([name, total]) => ({ name, total }));
    }

    // 8. Chart: Gastos por Categoría
    try {
      const eGroupBy = await prisma.expense.groupBy({
        by: ['categoria'],
        _sum: { monto: true },
      });
      expensesByCategory = eGroupBy.map((e) => ({ name: e.categoria, total: e._sum.monto || 0 }));
    } catch {
      const memExpenses = getMemoryExpenses();
      const grouped: Record<string, number> = {};
      memExpenses.forEach((e: any) => {
        const cat = e.categoria || 'Otros';
        grouped[cat] = (grouped[cat] || 0) + (Number(e.monto) || 0);
      });
      expensesByCategory = Object.entries(grouped).map(([name, total]) => ({ name, total }));
    }

    return NextResponse.json({
      kpis: {
        clientsCount,
        activeWebsitesCount,
        totalProductsCount,
        monthlyIncomesTotal,
        monthlyExpensesTotal,
        netBalance: monthlyIncomesTotal - monthlyExpensesTotal,
        lowStockAlertsCount: lowStockSupplies.length,
      },
      charts: {
        incomesByService,
        expensesByCategory,
      },
      lowStockSupplies,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      kpis: {
        clientsCount: 0,
        activeWebsitesCount: 0,
        totalProductsCount: 0,
        monthlyIncomesTotal: 0,
        monthlyExpensesTotal: 0,
        netBalance: 0,
        lowStockAlertsCount: 0,
      },
      charts: {
        incomesByService: [],
        expensesByCategory: [],
      },
      lowStockSupplies: [],
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}
