import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Post()
  create(@Body() createOrderDto: any, @Request() req: any) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.ordersService.findAll(status, pageNum, limitNum);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes: string,
    @Request() req: any,
  ) {
    return this.ordersService.updateStatus(
      id,
      status,
      req.user.userId,
      req.user.role,
      notes,
    );
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER')
  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    return this.ordersService.addNote(id, content, req.user.userId);
  }

  @Roles('FOUNDER')
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.ordersService.softDelete(id);
  }
}
