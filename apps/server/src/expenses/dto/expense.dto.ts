import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SplitMethod } from '../../generated/prisma/client.js';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExpenseSplitDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  amountOwed: string;
}

export class ExpenseItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateExpenseDto {
  @ApiProperty()
  @IsString()
  payerId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  totalAmount: string;

  @ApiProperty()
  @IsString()
  expenseDate: string;

  @ApiProperty({ enum: SplitMethod, enumName: 'SplitMethod' })
  @IsEnum(SplitMethod)
  splitMethod: SplitMethod;

  @ApiProperty({ type: ExpenseSplitDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  splits: ExpenseSplitDto[];

  @ApiPropertyOptional({ type: ExpenseItemDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseItemDto)
  items?: ExpenseItemDto[];
}

export class UpdateExpenseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expenseDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SplitMethod)
  splitMethod?: SplitMethod;

  @ApiPropertyOptional({ type: ExpenseSplitDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  splits?: ExpenseSplitDto[];

  @ApiPropertyOptional({ type: ExpenseItemDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseItemDto)
  items?: ExpenseItemDto[];
}
