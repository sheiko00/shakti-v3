import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPerformanceMetrics() {
    // 1. Order Stats
    const totalOrders = await this.prisma.order.count({
      where: { status: { notIn: ['CANCELLED', 'RETURNED'] } }
    });

    const revenueResult = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { notIn: ['CANCELLED', 'RETURNED'] } }
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Best Selling Products (by quantity)
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
      where: { order: { status: { notIn: ['CANCELLED', 'RETURNED'] } } }
    });

    const bestSellingProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, coverImageUrl: true }
        });
        return {
          id: item.productId,
          name: product?.name || 'Unknown',
          coverImageUrl: product?.coverImageUrl,
          quantitySold: item._sum.quantity || 0
        };
      })
    );

    // 3. Marketing Channel Performance
    const campaigns = await this.prisma.campaign.groupBy({
      by: ['channel'],
      _sum: { spent: true },
    });

    const channelPerformance = await Promise.all(
      campaigns.map(async (c) => {
        const channelRevenue = await this.prisma.campaignKPI.aggregate({
          _sum: { revenue: true },
          where: { campaign: { channel: c.channel } }
        });
        const rev = channelRevenue._sum.revenue || 0;
        const spent = c._sum.spent || 0;
        const roas = spent > 0 ? rev / spent : 0;

        return {
          channel: c.channel,
          spent,
          revenue: rev,
          roas: Number(roas.toFixed(2))
        };
      })
    );

    // 4. Fulfillment Speed (Avg days from APPROVED to DELIVERED)
    // For MVP, we'll just mock a static number or do a simple calculation if we have history.
    // In Prisma, calculating date diffs in groupBy is tricky without raw queries.
    // Let's return a placeholder for now, to be enhanced with RAW SQL later.
    const avgFulfillmentDays = 3.5; 

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: Number(aov.toFixed(2)),
      avgFulfillmentDays,
      bestSellingProducts,
      channelPerformance,
    };
  }
}
