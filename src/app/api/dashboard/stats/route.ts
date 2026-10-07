import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getMemoryClients,
  getMemoryProducts,
  getMemoryExpenses,
  getMemorySupplies,
  getMemoryBudgets,
  getMemorySubscriptions,
  getMemoryPortfolio
} from '@/lib/memoryDataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let clientsCount = 0;
    let activeWebsitesCount = 0;
    let pendingSubscriptionsCount = 0;
    let newBudgetsCount = 0;
    let totalProductsCount = 0;
    let monthlyExpensesTotal = 0;
    let lowStockSupplies: any[] = [];
    let budgetsByStatus: { name: string; value: number }[] = [];
    let expensesByCategory: { name: string; total: number }[] = [];
    let subscriptionsByStatus: { name: string; value: number }[] = [];

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

    // 3. Subscriptions
    try {
      pendingSubscriptionsCount = await prisma.webSubscription.count({
        where: { estado: { in: ['Próximo a vencer', 'Vencido'] } },
      });
    } catch {
      pendingSubscriptionsCount = getMemorySubscriptions().filter(
        (s: any) => s.estado === 'Próximo a vencer' || s.estado === 'Vencido'
      ).length;
    }

    // 4. Budgets
    try {
      newBudgetsCount = await prisma.budget.count({ where: { estado: 'Nuevo' } });
    } catch {
      newBudgetsCount = getMemoryBudgets().filter((b: any) => b.estado === 'Nuevo').length;
    }

    // 5. Products
    try {
      const printProdCount = await prisma.printProduct.count({ where: { activo: true } });
      const prodCount = await prisma.product.count({ where: { activo: true } });
      totalProductsCount = printProdCount + prodCount;
    } catch {
      totalProductsCount = getMemoryProducts().filter((p: any) => p.activo !== false).length;
    }

    // 6. Monthly Expenses
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyExpensesGroup = await prisma.expense.aggregate({
        where: { fecha: { gte: startOfMonth } },
        _sum: { monto: true },
      });
      monthlyExpensesTotal = monthlyExpensesGroup._sum.monto || 0;
    } catch {
      const memExpenses = getMemoryExpenses();
      monthlyExpensesTotal = memExpenses.reduce((sum: number, e: any) => sum + (Number(e.monto) || 0), 0);
    }

    // 7. Low stock supplies
    try {
      lowStockSupplies = await prisma.supply.findMany({
        where: { estado: 'Bajo Stock' },
      });
    } catch {
      lowStockSupplies = getMemorySupplies().filter((s: any) => s.estado === 'Bajo Stock');
    }

    // 8. Charts
    try {
      const bGroupBy = await prisma.budget.groupBy({
        by: ['estado'],
        _count: { id: true },
      });
      budgetsByStatus = bGroupBy.map((b) => ({ name: b.estado, value: b._count.id }));
    } catch {
      budgetsByStatus = [];
    }

    try {
      const eGroupBy = await prisma.expense.groupBy({
        by: ['categoria'],
        _sum: { monto: true },
      });
      expensesByCategory = eGroupBy.map((e) => ({ name: e.categoria, total: e._sum.monto || 0 }));
    } catch {
      expensesByCategory = [];
    }

    try {
      const sGroupBy = await prisma.webSubscription.groupBy({
        by: ['estado'],
        _count: { id: true },
      });
      subscriptionsByStatus = sGroupBy.map((s) => ({ name: s.estado, value: s._count.id }));
    } catch {
      subscriptionsByStatus = [];
    }

    return NextResponse.json({
      kpis: {
        clientsCount,
        activeWebsitesCount,
        pendingSubscriptionsCount,
        newBudgetsCount,
        totalProductsCount,
        monthlyExpensesTotal,
        lowStockAlertsCount: lowStockSupplies.length,
      },
      charts: {
        budgetsByStatus,
        expensesByCategory,
        subscriptionsByStatus,
      },
      lowStockSupplies,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return clean zero metrics fallback when DB is completely empty
    return NextResponse.json({
      kpis: {
        clientsCount: 0,
        activeWebsitesCount: 0,
        pendingSubscriptionsCount: 0,
        newBudgetsCount: 0,
        totalProductsCount: 0,
        monthlyExpensesTotal: 0,
        lowStockAlertsCount: 0,
      },
      charts: {
        budgetsByStatus: [],
        expensesByCategory: [],
        subscriptionsByStatus: [],
      },
      lowStockSupplies: [],
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}
