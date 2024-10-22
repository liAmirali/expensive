import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class GroupDTO {
  @ApiProperty()
  @IsNumber()
  id: ID;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  members: ID[];

  constructor(group: Group) {
    Object.assign(this, group);
  }
}

export class CreateGroupDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  @IsString()
  name: string;

  @Optional()
  @ApiPropertyOptional()
  @IsString()
  description: string;

  @Optional()
  @ApiPropertyOptional()
  @IsNumber({}, { each: true })
  members: ID[];
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
