import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // ===================== CAMPAIGNS ===================== //

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER')
  @Post('campaigns')
  createCampaign(@Body() createDto: any, @Request() req: any) {
    return this.marketingService.createCampaign(createDto, req.user.userId);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER')
  @Get('campaigns')
  getCampaigns(@Query('status') status?: string, @Query('channel') channel?: string) {
    return this.marketingService.getCampaigns(status, channel);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER')
  @Get('campaigns/:id')
  getCampaign(@Param('id') id: string) {
    return this.marketingService.getCampaign(id);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER')
  @Patch('campaigns/:id/kpi')
  updateCampaignKPI(@Param('id') id: string, @Body() data: any) {
    return this.marketingService.updateCampaignKPI(id, data);
  }

  // ===================== PROMO CODES ===================== //

  @Roles('FOUNDER', 'MARKETING_MANAGER')
  @Post('promo-codes')
  createPromoCode(@Body() createDto: any) {
    return this.marketingService.createPromoCode(createDto);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER')
  @Get('promo-codes')
  getPromoCodes(@Query('campaignId') campaignId?: string) {
    return this.marketingService.getPromoCodes(campaignId);
  }
}
