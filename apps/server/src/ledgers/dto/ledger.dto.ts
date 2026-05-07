import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ledger, LedgerVisibility } from '../../generated/prisma/client.js';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LedgerParticipantDto {
  @ApiProperty()
  userId: string;
}

export class LedgerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty({ enum: LedgerVisibility, enumName: 'LedgerVisibility' })
  visibility: LedgerVisibility;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  closedAt?: Date | null;

  constructor(ledger: Ledger) {
    Object.assign(this, ledger);
  }
}

export class CreateLedgerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: LedgerVisibility, enumName: 'LedgerVisibility' })
  @IsOptional()
  @IsEnum(LedgerVisibility)
  visibility?: LedgerVisibility;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LedgerParticipantDto)
  participants: LedgerParticipantDto[];
}

export class UpdateLedgerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: LedgerVisibility, enumName: 'LedgerVisibility' })
  @IsOptional()
  @IsEnum(LedgerVisibility)
  visibility?: LedgerVisibility;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closedAt?: string;
}

export class AddLedgerParticipantDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
