import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  name: string;

  @Optional()
  @ApiPropertyOptional()
  description: string;

  @Optional()
  @ApiPropertyOptional()
  members: ID[];
}
