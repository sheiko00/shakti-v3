import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Post()
  create(@Body() createBatchDto: any, @Request() req: any) {
    return this.productionService.create(createBatchDto, req.user.userId);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Get()
  findAll(@Request() req: any, @Query('status') status?: string) {
    return this.productionService.findAll(
      req.user.role,
      req.user.userId,
      status,
    );
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.productionService.findOne(id, req.user.role, req.user.userId);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.productionService.updateStatus(
      id,
      status,
      req.user.userId,
      req.user.role,
    );
  }
}
