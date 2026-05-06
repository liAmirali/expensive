import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto.js';
import type { Request } from 'express';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';

@ApiBearerAuth()
@ApiTags('Expenses')
@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 201 })
  @Post('ledgers/:ledgerId/expenses')
  async createExpense(
    @Req() req: Request,
    @Param('ledgerId') ledgerId: string,
    @Body() body: CreateExpenseDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.expensesService.create(ledgerId, userId, body);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Get('ledgers/:ledgerId/expenses')
  async listExpenses(@Req() req: Request, @Param('ledgerId') ledgerId: string) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.expensesService.list(ledgerId, userId);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Patch('expenses/:expenseId')
  async updateExpense(
    @Req() req: Request,
    @Param('expenseId') expenseId: string,
    @Body() body: UpdateExpenseDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.expensesService.update(expenseId, userId, body);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Delete('expenses/:expenseId')
  async voidExpense(@Req() req: Request, @Param('expenseId') expenseId: string) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.expensesService.void(expenseId, userId);
  }
}
