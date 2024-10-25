import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Group, GroupRole } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class GroupMemberReducedDTO {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({ type: GroupRole, enum: GroupRole })
  @IsEnum(GroupRole)
  role: GroupRole;
}
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

  @ApiProperty({ type: GroupMemberReducedDTO, isArray: true, required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupMemberReducedDTO)
  members: GroupMemberReducedDTO[];

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
  @ApiProperty({ type: Number, isArray: true, required: false })
  @ValidateNested()
  @IsNumber({}, { each: true })
  members: ID[];
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
