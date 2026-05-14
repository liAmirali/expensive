import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SplitMethod } from '../../generated/prisma/client.js';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserPublicDTO } from '../../users/dto/user.dto.js';

export class ExpenseResponseSplitDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  amountOwed: string;
}

export class ExpenseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ledgerId: string;

  @ApiProperty()
  payerId: string;

  @ApiProperty({ type: UserPublicDTO })
  payer: UserPublicDTO;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  totalAmount: string;

  @ApiProperty({ type: String, format: 'date-time' })
  expenseDate: string;

  @ApiProperty({ enum: SplitMethod, enumName: 'SplitMethod' })
  splitMethod: SplitMethod;

  @ApiProperty()
  isVoided: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: ExpenseResponseSplitDto, isArray: true })
  splits: ExpenseResponseSplitDto[];
}

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
