import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ledger, LedgerVisibility } from '../../generated/prisma/client.js';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserPublicDTO } from '../../users/dto/user.dto.js';

export class LedgerParticipantDto {
  @ApiProperty()
  @IsString()
  userId: string;
}

export class LedgerParticipantPublicDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  joinedAt!: Date;

  @ApiProperty({ type: UserPublicDTO })
  @Type(() => UserPublicDTO)
  user!: UserPublicDTO;
}

export class LedgerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ enum: LedgerVisibility, enumName: 'LedgerVisibility' })
  visibility: LedgerVisibility;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time', required: false, nullable: true })
  closedAt?: Date | null;

  @ApiProperty({ type: LedgerParticipantPublicDto, isArray: true })
  @Type(() => LedgerParticipantPublicDto)
  participants: LedgerParticipantPublicDto[];

  constructor(ledger: Ledger & { participants?: LedgerParticipantPublicDto[] }) {
    Object.assign(this, ledger);
    this.participants = ledger.participants ?? [];
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

  @ApiProperty({ type: LedgerParticipantDto, isArray: true })
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
