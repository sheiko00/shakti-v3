import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Post()
  create(@Body() createDto: any, @Request() req: any) {
    return this.shippingService.create(createDto, req.user.userId);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Get()
  findAll(@Query('status') status?: string) {
    return this.shippingService.findAll(status);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(id);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('returnReason') returnReason: string,
    @Body('notes') notes: string,
    @Request() req: any,
  ) {
    return this.shippingService.updateStatus(id, status, req.user.userId, returnReason, notes);
  }
}
