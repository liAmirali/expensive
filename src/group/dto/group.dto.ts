import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Group, GroupRole } from '../../generated/prisma/client.js';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class GroupMemberReducedDTO {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({ enum: GroupRole, enumName: 'GroupRole' })
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
  description: string | null;

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

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: Number, isArray: true })
  @IsNumber({}, { each: true })
  members: ID[];
}

export class UpdateGroupDto {
  @MaxLength(255)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | undefined;
}

export class AddGroupMemberDto {
  @ApiProperty()
  @IsNumber()
  userId: ID;
}
