import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const session = getAuthSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const clientsCount = await prisma.client.count({ where: { estado: 'Activo' } });
    const activeWebsitesCount = await prisma.webPortfolio.count({ where: { activo: true } });
    const pendingSubscriptionsCount = await prisma.webSubscription.count({
      where: { estado: { in: ['Próximo a vencer', 'Vencido'] } },
    });
    const newBudgetsCount = await prisma.budget.count({ where: { estado: 'Nuevo' } });
    const totalProductsCount = await prisma.printProduct.count({ where: { activo: true } }) + await prisma.product.count({ where: { activo: true } });

    // Expenses of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyExpensesGroup = await prisma.expense.aggregate({
      where: { fecha: { gte: startOfMonth } },
      _sum: { monto: true },
    });
    const monthlyExpensesTotal = monthlyExpensesGroup._sum.monto || 0;

    // Chart Data 1: Presupuestos por estado
    const budgetsByStatus = await prisma.budget.groupBy({
      by: ['estado'],
      _count: { id: true },
    });

    // Chart Data 2: Gastos por categoría
    const expensesByCategory = await prisma.expense.groupBy({
      by: ['categoria'],
      _sum: { monto: true },
    });

    // Chart Data 3: Abonos por estado
    const subscriptionsByStatus = await prisma.webSubscription.groupBy({
      by: ['estado'],
      _count: { id: true },
    });

    // Low stock supplies alert count
    const lowStockSupplies = await prisma.supply.findMany({
      where: { estado: 'Bajo Stock' },
    });

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
        budgetsByStatus: budgetsByStatus.map((b) => ({ name: b.estado, value: b._count.id })),
        expensesByCategory: expensesByCategory.map((e) => ({ name: e.categoria, total: e._sum.monto || 0 })),
        subscriptionsByStatus: subscriptionsByStatus.map((s) => ({ name: s.estado, value: s._count.id })),
      },
      lowStockSupplies,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Error al obtener métricas del dashboard' }, { status: 500 });
  }
}
