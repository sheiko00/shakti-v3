import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'MARKETING_MANAGER')
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'MARKETING_MANAGER')
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER', 'MARKETING_MANAGER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
