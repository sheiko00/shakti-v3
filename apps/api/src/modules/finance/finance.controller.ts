import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Get('dashboard')
  getDashboardSummary() {
    return this.financeService.getDashboardSummary();
  }

  // EXPENSES
  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Post('expenses')
  createExpense(@Body() createDto: any) {
    return this.financeService.createExpense(createDto);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Get('expenses')
  getExpenses(@Query('category') category?: string, @Query('status') status?: string) {
    return this.financeService.getExpenses(category, status);
  }

  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Patch('expenses/:id/status')
  updateExpenseStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.financeService.updateExpenseStatus(id, status);
  }

  // SUPPLIER PAYOUTS
  @Roles('FOUNDER', 'OPERATIONS_MANAGER')
  @Get('payouts')
  getSupplierPayouts(@Query('status') status?: string) {
    return this.financeService.getSupplierPayouts(status);
  }
}
