import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSettlementDto {
  @ApiProperty()
  @IsString()
  fromUserId: string;

  @ApiProperty()
  @IsString()
  toUserId: string;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsString()
  settlementDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
