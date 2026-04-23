import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  // ===================== CAMPAIGNS ===================== //

  async createCampaign(data: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          name: data.name,
          objective: data.objective,
          channel: data.channel,
          budget: data.budget || 0,
          currency: data.currency || 'USD',
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: 'DRAFT',
          ownerId: userId,
          kpi: {
            create: {} // Initialize empty KPI
          },
          assets: data.assetIds?.length > 0 ? {
            create: data.assetIds.map((assetId: string) => ({ assetId }))
          } : undefined,
          products: data.productIds?.length > 0 ? {
            create: data.productIds.map((productId: string) => ({ productId }))
          } : undefined,
        },
        include: { kpi: true, assets: true, products: true }
      });
      return campaign;
    });
  }

  async getCampaigns(status?: string, channel?: string) {
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (channel && channel !== 'ALL') where.channel = channel;

    return this.prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        kpi: true,
        owner: { select: { email: true } },
        _count: { select: { assets: true, products: true, promoCodes: true } }
      }
    });
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        kpi: true,
        promoCodes: true,
        assets: { include: { asset: true } },
        products: { include: { product: true } },
        owner: { select: { email: true } }
      }
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async updateCampaignKPI(id: string, data: any) {
    return this.prisma.campaignKPI.update({
      where: { campaignId: id },
      data: {
        impressions: data.impressions,
        clicks: data.clicks,
        cpc: data.cpc,
        ctr: data.ctr,
        cpa: data.cpa,
        revenue: data.revenue,
        roas: data.roas,
      }
    });
  }

  // ===================== PROMO CODES ===================== //

  async createPromoCode(data: any) {
    // Check if code exists
    const existing = await this.prisma.promoCode.findUnique({ where: { code: data.code } });
    if (existing) throw new BadRequestException('Promo code already exists');

    return this.prisma.promoCode.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        usageLimit: data.usageLimit || null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        campaignId: data.campaignId || null,
        isActive: true,
      }
    });
  }

  async getPromoCodes(campaignId?: string) {
    const where: any = {};
    if (campaignId) where.campaignId = campaignId;

    return this.prisma.promoCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: { select: { name: true } }
      }
    });
  }
}
