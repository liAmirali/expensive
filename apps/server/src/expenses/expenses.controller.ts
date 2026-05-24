import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto, ExpenseResponseDto, UpdateExpenseDto } from './dto/expense.dto.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';
import { CurrentUserId } from '../common/decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags('Expenses')
@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 201 })
  @Post('ledgers/:ledgerId/expenses')
  async createExpense(
    @CurrentUserId() userId: ID,
    @Param('ledgerId') ledgerId: string,
    @Body() body: CreateExpenseDto,
  ) {
    return this.expensesService.create(ledgerId, userId, body);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200, type: ExpenseResponseDto, isArray: true })
  @Get('ledgers/:ledgerId/expenses')
  async listExpenses(@CurrentUserId() userId: ID, @Param('ledgerId') ledgerId: string) {
    return this.expensesService.list(ledgerId, userId);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Patch('expenses/:expenseId')
  async updateExpense(
    @CurrentUserId() userId: ID,
    @Param('expenseId') expenseId: string,
    @Body() body: UpdateExpenseDto,
  ) {
    return this.expensesService.update(expenseId, userId, body);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Delete('expenses/:expenseId')
  async voidExpense(@CurrentUserId() userId: ID, @Param('expenseId') expenseId: string) {
    return this.expensesService.void(expenseId, userId);
  }
}
