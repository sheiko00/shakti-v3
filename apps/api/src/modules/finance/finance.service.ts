import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ===================== EXECUTIVE DASHBOARD ===================== //

  async getDashboardSummary() {
    // 1. Revenue: Sum of DELIVERED / SHIPPED orders total amount
    const revenueResult = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ['SHIPPED', 'DELIVERED'] },
      },
    });
    const totalRevenue = revenueResult._sum.total || 0;

    // 2. Costs: Sum of all PAID expenses
    const costsResult = await this.prisma.expense.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' },
    });
    const totalCosts = costsResult._sum.amount || 0;

    // 3. Profit Calculation
    const netProfit = totalRevenue - totalCosts;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // 4. Marketing Spend (Specific Cost)
    const adSpendResult = await this.prisma.expense.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID', category: 'MARKETING' },
    });
    const adSpend = adSpendResult._sum.amount || 0;

    return {
      totalRevenue,
      totalCosts,
      netProfit,
      netMargin: Number(netMargin.toFixed(2)),
      adSpend,
    };
  }

  // ===================== EXPENSES ===================== //

  async createExpense(data: any) {
    return this.prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        currency: data.currency || 'USD',
        category: data.category,
        status: data.status || 'PENDING',
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes,
        productionBatchId: data.productionBatchId || null,
        shipmentId: data.shipmentId || null,
        campaignId: data.campaignId || null,
      },
    });
  }

  async getExpenses(category?: string, status?: string) {
    const where: any = {};
    if (category && category !== 'ALL') where.category = category;
    if (status && status !== 'ALL') where.status = status;

    return this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        productionBatch: { select: { batchNumber: true } },
        shipment: { select: { trackingNumber: true } },
        campaign: { select: { name: true } },
      },
    });
  }

  async updateExpenseStatus(id: string, status: any) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');

    return this.prisma.expense.update({
      where: { id },
      data: { status },
    });
  }

  // ===================== SUPPLIER PAYOUTS ===================== //

  async getSupplierPayouts(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;

    return this.prisma.supplierPayout.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        supplier: { select: { email: true } },
      },
    });
  }
}
